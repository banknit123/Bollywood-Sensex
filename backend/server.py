from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import requests
from bson import ObjectId
import asyncio
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# TMDb API Configuration
TMDB_API_KEY = os.environ.get('TMDB_API_KEY', '')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# ==================== MODELS ====================

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    balance: float = 100000.0
    created_at: str

class Movie(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    tmdb_id: Optional[int] = None
    title: str
    poster: Optional[str] = None
    backdrop: Optional[str] = None
    release_date: Optional[str] = None
    synopsis: Optional[str] = None
    cast: List[str] = []
    genres: List[str] = []
    current_price: float
    initial_price: float
    total_shares: int
    available_shares: int
    volume: int = 0
    change: float = 0.0
    change_percent: float = 0.0
    created_at: str

class TradeOrder(BaseModel):
    movie_id: str
    action: str  # 'buy' or 'sell'
    quantity: int
    order_type: str = 'market'  # 'market' or 'limit'
    price: Optional[float] = None

class Portfolio(BaseModel):
    model_config = ConfigDict(extra="ignore")
    movie_id: str
    movie_title: str
    movie_symbol: str
    quantity: int
    avg_price: float
    current_price: float
    current_value: float
    pl: float
    pl_percent: float

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    movie_id: str
    movie_title: str
    type: str
    quantity: int
    price: float
    amount: float
    timestamp: str

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': expiration
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    user = await db.users.find_one({'id': payload['user_id']}, {'_id': 0, 'password_hash': 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def fetch_bollywood_movies():
    """Fetch Bollywood movies from TMDb API"""
    if not TMDB_API_KEY:
        return []
    
    try:
        # Fetch popular Hindi movies
        response = requests.get(
            f"{TMDB_BASE_URL}/discover/movie",
            params={
                'api_key': TMDB_API_KEY,
                'with_original_language': 'hi',
                'sort_by': 'popularity.desc',
                'page': 1
            },
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json().get('results', [])[:20]
    except Exception as e:
        logging.error(f"Error fetching movies from TMDb: {str(e)}")
    
    return []

async def get_movie_details(tmdb_id: int):
    """Fetch detailed movie info from TMDb"""
    if not TMDB_API_KEY:
        return None
    
    try:
        response = requests.get(
            f"{TMDB_BASE_URL}/movie/{tmdb_id}",
            params={
                'api_key': TMDB_API_KEY,
                'append_to_response': 'credits'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        logging.error(f"Error fetching movie details: {str(e)}")
    
    return None

async def update_movie_price(movie_id: str, quantity: int, action: str):
    """Update movie price based on demand-supply logic"""
    movie = await db.movies.find_one({'id': movie_id})
    if not movie:
        return
    
    current_price = movie['current_price']
    total_shares = movie['total_shares']
    
    # Price impact based on trade volume (percentage of total shares)
    volume_impact = (quantity / total_shares) * 100
    
    # Calculate price change (0.1% to 5% based on volume)
    price_change_percent = min(volume_impact * 0.5, 5.0)
    
    if action == 'buy':
        new_price = current_price * (1 + price_change_percent / 100)
    else:
        new_price = current_price * (1 - price_change_percent / 100)
    
    # Ensure price doesn't go below 10% of initial price
    min_price = movie['initial_price'] * 0.1
    new_price = max(new_price, min_price)
    
    change = new_price - current_price
    change_percent = (change / current_price) * 100
    
    await db.movies.update_one(
        {'id': movie_id},
        {
            '$set': {
                'current_price': round(new_price, 2),
                'change': round(change, 2),
                'change_percent': round(change_percent, 2)
            },
            '$inc': {'volume': quantity}
        }
    )

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({'email': user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    user_doc = {
        'id': user_id,
        'email': user_data.email,
        'name': user_data.name,
        'password_hash': hash_password(user_data.password),
        'balance': 100000.0,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    token = create_token(user_id, user_data.email)
    
    return {
        'token': token,
        'user': {
            'id': user_id,
            'email': user_data.email,
            'name': user_data.name,
            'balance': 100000.0
        }
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({'email': credentials.email})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(user['id'], user['email'])
    
    return {
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'balance': user['balance']
        }
    }

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# ==================== MOVIE ROUTES ====================

@api_router.get("/movies")
async def get_movies(limit: int = 50):
    movies = await db.movies.find({}, {'_id': 0}).to_list(limit)
    return movies

@api_router.get("/movies/{movie_id}")
async def get_movie(movie_id: str):
    movie = await db.movies.find_one({'id': movie_id}, {'_id': 0})
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@api_router.post("/movies/sync")
async def sync_movies():
    """Sync movies from TMDb API"""
    movies_data = await fetch_bollywood_movies()
    
    if not movies_data:
        raise HTTPException(status_code=500, detail="Unable to fetch movies from TMDb")
    
    synced_count = 0
    
    for movie_data in movies_data:
        # Check if movie already exists
        existing = await db.movies.find_one({'tmdb_id': movie_data['id']})
        if existing:
            continue
        
        # Get detailed info
        details = await get_movie_details(movie_data['id'])
        
        # Extract cast
        cast = []
        if details and 'credits' in details:
            cast = [actor['name'] for actor in details['credits'].get('cast', [])[:5]]
        
        # Extract genres
        genres = []
        if details and 'genres' in details:
            genres = [genre['name'] for genre in details['genres']]
        
        # Create movie symbol from title
        symbol = movie_data['title'].upper().replace(' ', '')[:6]
        
        # Generate initial price (between 50-500)
        initial_price = round(random.uniform(50, 500), 2)
        total_shares = random.randint(10000, 100000)
        
        movie_doc = {
            'id': str(uuid.uuid4()),
            'tmdb_id': movie_data['id'],
            'title': movie_data['title'],
            'symbol': symbol,
            'poster': f"https://image.tmdb.org/t/p/w500{movie_data.get('poster_path')}" if movie_data.get('poster_path') else None,
            'backdrop': f"https://image.tmdb.org/t/p/w1280{movie_data.get('backdrop_path')}" if movie_data.get('backdrop_path') else None,
            'release_date': movie_data.get('release_date', ''),
            'synopsis': movie_data.get('overview', ''),
            'cast': cast,
            'genres': genres,
            'current_price': initial_price,
            'initial_price': initial_price,
            'total_shares': total_shares,
            'available_shares': total_shares,
            'volume': 0,
            'change': 0.0,
            'change_percent': 0.0,
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        await db.movies.insert_one(movie_doc)
        synced_count += 1
    
    return {'message': f'Successfully synced {synced_count} movies'}

# ==================== TRADING ROUTES ====================

@api_router.post("/trade/order")
async def place_order(order: TradeOrder, current_user: dict = Depends(get_current_user)):
    # Get movie
    movie = await db.movies.find_one({'id': order.movie_id})
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    price = movie['current_price'] if order.order_type == 'market' else order.price
    total_cost = price * order.quantity
    
    if order.action == 'buy':
        # Check if user has enough balance
        if current_user['balance'] < total_cost:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        
        # Check if enough shares available
        if movie['available_shares'] < order.quantity:
            raise HTTPException(status_code=400, detail="Insufficient shares available")
        
        # Update user balance
        await db.users.update_one(
            {'id': current_user['id']},
            {'$inc': {'balance': -total_cost}}
        )
        
        # Update movie shares
        await db.movies.update_one(
            {'id': order.movie_id},
            {'$inc': {'available_shares': -order.quantity}}
        )
        
        # Update or create portfolio entry
        portfolio = await db.portfolio.find_one({
            'user_id': current_user['id'],
            'movie_id': order.movie_id
        })
        
        if portfolio:
            # Calculate new average price
            total_quantity = portfolio['quantity'] + order.quantity
            total_value = (portfolio['quantity'] * portfolio['avg_price']) + total_cost
            new_avg_price = total_value / total_quantity
            
            await db.portfolio.update_one(
                {'user_id': current_user['id'], 'movie_id': order.movie_id},
                {
                    '$set': {'avg_price': round(new_avg_price, 2)},
                    '$inc': {'quantity': order.quantity}
                }
            )
        else:
            portfolio_doc = {
                'id': str(uuid.uuid4()),
                'user_id': current_user['id'],
                'movie_id': order.movie_id,
                'movie_title': movie['title'],
                'movie_symbol': movie['symbol'],
                'quantity': order.quantity,
                'avg_price': price,
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            await db.portfolio.insert_one(portfolio_doc)
    
    else:  # sell
        # Check if user has enough shares
        portfolio = await db.portfolio.find_one({
            'user_id': current_user['id'],
            'movie_id': order.movie_id
        })
        
        if not portfolio or portfolio['quantity'] < order.quantity:
            raise HTTPException(status_code=400, detail="Insufficient shares to sell")
        
        # Update user balance
        await db.users.update_one(
            {'id': current_user['id']},
            {'$inc': {'balance': total_cost}}
        )
        
        # Update movie shares
        await db.movies.update_one(
            {'id': order.movie_id},
            {'$inc': {'available_shares': order.quantity}}
        )
        
        # Update portfolio
        new_quantity = portfolio['quantity'] - order.quantity
        if new_quantity == 0:
            await db.portfolio.delete_one({'user_id': current_user['id'], 'movie_id': order.movie_id})
        else:
            await db.portfolio.update_one(
                {'user_id': current_user['id'], 'movie_id': order.movie_id},
                {'$inc': {'quantity': -order.quantity}}
            )
    
    # Create transaction record
    transaction_doc = {
        'id': str(uuid.uuid4()),
        'user_id': current_user['id'],
        'movie_id': order.movie_id,
        'movie_title': movie['title'],
        'movie_symbol': movie['symbol'],
        'type': order.action.upper(),
        'quantity': order.quantity,
        'price': price,
        'amount': total_cost,
        'timestamp': datetime.now(timezone.utc).isoformat()
    }
    await db.transactions.insert_one(transaction_doc)
    
    # Update movie price based on trade
    await update_movie_price(order.movie_id, order.quantity, order.action)
    
    return {'message': 'Order placed successfully', 'transaction': transaction_doc}

# ==================== PORTFOLIO ROUTES ====================

@api_router.get("/portfolio")
async def get_portfolio(current_user: dict = Depends(get_current_user)):
    portfolio_items = await db.portfolio.find({'user_id': current_user['id']}, {'_id': 0}).to_list(100)
    
    # Enrich with current prices
    enriched_portfolio = []
    total_value = 0
    total_pl = 0
    
    for item in portfolio_items:
        movie = await db.movies.find_one({'id': item['movie_id']})
        if movie:
            current_value = item['quantity'] * movie['current_price']
            cost = item['quantity'] * item['avg_price']
            pl = current_value - cost
            pl_percent = (pl / cost) * 100 if cost > 0 else 0
            
            enriched_item = {
                **item,
                'current_price': movie['current_price'],
                'current_value': round(current_value, 2),
                'pl': round(pl, 2),
                'pl_percent': round(pl_percent, 2),
                'day_change': movie.get('change', 0),
                'day_change_percent': movie.get('change_percent', 0)
            }
            enriched_portfolio.append(enriched_item)
            total_value += current_value
            total_pl += pl
    
    # Get updated user balance
    user = await db.users.find_one({'id': current_user['id']})
    
    return {
        'portfolio': enriched_portfolio,
        'total_value': round(total_value, 2),
        'total_pl': round(total_pl, 2),
        'balance': user['balance'],
        'total_assets': round(total_value + user['balance'], 2)
    }

@api_router.get("/transactions")
async def get_transactions(current_user: dict = Depends(get_current_user), limit: int = 50):
    transactions = await db.transactions.find(
        {'user_id': current_user['id']},
        {'_id': 0}
    ).sort('timestamp', -1).to_list(limit)
    
    return transactions

# ==================== MARKET ROUTES ====================

@api_router.get("/market/trending")
async def get_trending():
    # Get top gainers
    gainers = await db.movies.find(
        {'change_percent': {'$gt': 0}},
        {'_id': 0}
    ).sort('change_percent', -1).limit(10).to_list(10)
    
    # Get top losers
    losers = await db.movies.find(
        {'change_percent': {'$lt': 0}},
        {'_id': 0}
    ).sort('change_percent', 1).limit(10).to_list(10)
    
    # Get top volume
    volume_leaders = await db.movies.find(
        {},
        {'_id': 0}
    ).sort('volume', -1).limit(10).to_list(10)
    
    return {
        'gainers': gainers,
        'losers': losers,
        'volume_leaders': volume_leaders
    }

@api_router.get("/market/stats")
async def get_market_stats():
    total_movies = await db.movies.count_documents({})
    total_users = await db.users.count_documents({})
    total_transactions = await db.transactions.count_documents({})
    
    # Calculate total market cap
    movies = await db.movies.find({}, {'_id': 0, 'current_price': 1, 'total_shares': 1}).to_list(1000)
    total_market_cap = sum(m['current_price'] * m['total_shares'] for m in movies)
    
    return {
        'total_movies': total_movies,
        'total_users': total_users,
        'total_transactions': total_transactions,
        'total_market_cap': round(total_market_cap, 2)
    }

# ==================== PRICE UPDATE SIMULATION ====================

async def simulate_price_updates():
    """Background task to simulate market price fluctuations"""
    while True:
        try:
            movies = await db.movies.find({}, {'_id': 0}).to_list(1000)
            
            for movie in movies:
                # Random price fluctuation (-2% to +2%)
                change_percent = random.uniform(-2, 2)
                new_price = movie['current_price'] * (1 + change_percent / 100)
                
                # Ensure price doesn't go below 10% of initial price
                min_price = movie['initial_price'] * 0.1
                new_price = max(new_price, min_price)
                
                change = new_price - movie['current_price']
                
                await db.movies.update_one(
                    {'id': movie['id']},
                    {
                        '$set': {
                            'current_price': round(new_price, 2),
                            'change': round(change, 2),
                            'change_percent': round(change_percent, 2)
                        }
                    }
                )
            
            await asyncio.sleep(30)  # Update every 30 seconds
        except Exception as e:
            logging.error(f"Error in price update simulation: {str(e)}")
            await asyncio.sleep(30)

# ==================== APP SETUP ====================

@app.on_event("startup")
async def startup_event():
    # Start price update simulation
    asyncio.create_task(simulate_price_updates())
    logging.info("Bollywood Sensex API started")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
