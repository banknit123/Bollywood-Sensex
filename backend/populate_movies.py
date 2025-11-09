import asyncio
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone
import random
import requests
from bs4 import BeautifulSoup

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

def scrape_bollywood_hungama():
    """Attempt to scrape movies from Bollywood Hungama"""
    movies = []
    
    try:
        print("Attempting to scrape Bollywood Hungama...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Try to fetch upcoming movies page
        response = requests.get('https://www.bollywoodhungama.com/movies/upcoming/', headers=headers, timeout=10)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try to find movie elements (this is a basic attempt, may need adjustment)
            movie_elements = soup.find_all('div', class_=['movie-item', 'movie', 'film-item'])[:30]
            
            for element in movie_elements:
                try:
                    title = element.find(['h2', 'h3', 'h4', 'a']).text.strip() if element.find(['h2', 'h3', 'h4', 'a']) else None
                    if title and len(title) > 2:
                        movies.append({'title': title})
                except:
                    continue
        
        if len(movies) > 5:
            print(f"Successfully scraped {len(movies)} movies from Bollywood Hungama")
            return movies
        else:
            print("Scraping didn't return enough data, using dummy data instead")
            return None
            
    except Exception as e:
        print(f"Scraping failed: {str(e)}")
        return None

def get_dummy_bollywood_movies():
    """Realistic dummy data based on actual 2024-2025 Bollywood movies"""
    return [
        {
            "title": "Fighter",
            "synopsis": "An aerial action thriller featuring India's elite fighter pilots protecting the nation.",
            "cast": ["Hrithik Roshan", "Deepika Padukone", "Anil Kapoor", "Karan Singh Grover"],
            "release_date": "2024-01-25",
            "genres": ["Action", "Thriller"]
        },
        {
            "title": "Bade Miyan Chote Miyan",
            "synopsis": "Two elite soldiers team up for a dangerous mission to save the country.",
            "cast": ["Akshay Kumar", "Tiger Shroff", "Prithviraj Sukumaran", "Manushi Chhillar"],
            "release_date": "2024-04-10",
            "genres": ["Action", "Comedy"]
        },
        {
            "title": "Crew",
            "synopsis": "Three air hostesses get caught up in a gold smuggling racket.",
            "cast": ["Kareena Kapoor Khan", "Tabu", "Kriti Sanon", "Diljit Dosanjh"],
            "release_date": "2024-03-29",
            "genres": ["Comedy", "Drama"]
        },
        {
            "title": "Singham Again",
            "synopsis": "The iconic cop Bajirao Singham returns for another action-packed mission.",
            "cast": ["Ajay Devgn", "Kareena Kapoor Khan", "Deepika Padukone", "Tiger Shroff"],
            "release_date": "2024-11-01",
            "genres": ["Action", "Drama"]
        },
        {
            "title": "Pushpa 2: The Rule",
            "synopsis": "Pushpa Raj's journey continues as he faces new enemies and challenges.",
            "cast": ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil"],
            "release_date": "2024-08-15",
            "genres": ["Action", "Thriller"]
        },
        {
            "title": "Stree 2",
            "synopsis": "The horror-comedy sequel brings back the ghost of Stree with new twists.",
            "cast": ["Shraddha Kapoor", "Rajkummar Rao", "Pankaj Tripathi", "Aparshakti Khurana"],
            "release_date": "2024-08-15",
            "genres": ["Horror", "Comedy"]
        },
        {
            "title": "Khiladi 1080",
            "synopsis": "Akshay Kumar returns as the action hero in this high-octane thriller.",
            "cast": ["Akshay Kumar", "Jacqueline Fernandez", "Emraan Hashmi"],
            "release_date": "2024-09-27",
            "genres": ["Action", "Thriller"]
        },
        {
            "title": "War 2",
            "synopsis": "The action-packed sequel to the blockbuster War with new missions.",
            "cast": ["Hrithik Roshan", "Jr NTR", "Deepika Padukone"],
            "release_date": "2025-08-14",
            "genres": ["Action", "Thriller"]
        },
        {
            "title": "Jolly LLB 3",
            "synopsis": "The courtroom comedy-drama returns with more legal battles and humor.",
            "cast": ["Akshay Kumar", "Arshad Warsi", "Huma Qureshi"],
            "release_date": "2024-12-25",
            "genres": ["Comedy", "Drama"]
        },
        {
            "title": "Housefull 5",
            "synopsis": "The comedy franchise returns with more confusion and hilarious situations.",
            "cast": ["Akshay Kumar", "Riteish Deshmukh", "Abhishek Bachchan", "Jacqueline Fernandez"],
            "release_date": "2024-06-06",
            "genres": ["Comedy"]
        },
        {
            "title": "Welcome 3",
            "synopsis": "The Welcome series continues with new comic adventures.",
            "cast": ["Akshay Kumar", "Disha Patani", "Raveena Tandon"],
            "release_date": "2024-12-20",
            "genres": ["Comedy", "Action"]
        },
        {
            "title": "Bhool Bhulaiyaa 3",
            "synopsis": "Rooh Baba returns to uncover another haunted mystery.",
            "cast": ["Kartik Aaryan", "Triptii Dimri", "Vidya Balan"],
            "release_date": "2024-11-01",
            "genres": ["Horror", "Comedy"]
        },
        {
            "title": "Raid 2",
            "synopsis": "The honest income tax officer returns for another high-stakes raid.",
            "cast": ["Ajay Devgn", "Vaani Kapoor", "Ileana D'Cruz"],
            "release_date": "2024-11-15",
            "genres": ["Drama", "Thriller"]
        },
        {
            "title": "Merry Christmas",
            "synopsis": "A Christmas Eve encounter leads to mysterious and thrilling events.",
            "cast": ["Katrina Kaif", "Vijay Sethupathi"],
            "release_date": "2024-01-12",
            "genres": ["Thriller", "Mystery"]
        },
        {
            "title": "Yodha",
            "synopsis": "A soldier fights against a hijacking mission to save hundreds of lives.",
            "cast": ["Sidharth Malhotra", "Raashii Khanna", "Disha Patani"],
            "release_date": "2024-03-15",
            "genres": ["Action", "Thriller"]
        },
        {
            "title": "Article 370",
            "synopsis": "A political thriller based on the abrogation of Article 370 in Kashmir.",
            "cast": ["Yami Gautam", "Priyamani", "Arun Govil"],
            "release_date": "2024-02-23",
            "genres": ["Political", "Drama"]
        },
        {
            "title": "Chandu Champion",
            "synopsis": "The inspiring story of India's first Paralympic gold medalist.",
            "cast": ["Kartik Aaryan", "Shreya Dhanwanthary"],
            "release_date": "2024-06-14",
            "genres": ["Biography", "Sports"]
        },
        {
            "title": "Khel Khel Mein",
            "synopsis": "Friends gather for a party where secrets are revealed through phones.",
            "cast": ["Akshay Kumar", "Taapsee Pannu", "Fardeen Khan", "Ammy Virk"],
            "release_date": "2024-08-15",
            "genres": ["Comedy", "Drama"]
        },
        {
            "title": "Madgaon Express",
            "synopsis": "Three friends on a trip to Goa get caught in hilarious situations.",
            "cast": ["Divyenndu", "Pratik Gandhi", "Avinash Tiwary"],
            "release_date": "2024-03-22",
            "genres": ["Comedy"]
        },
        {
            "title": "Shaitaan",
            "synopsis": "A family's life turns upside down when they encounter a mysterious stranger.",
            "cast": ["Ajay Devgn", "R. Madhavan", "Jyothika"],
            "release_date": "2024-03-08",
            "genres": ["Horror", "Thriller"]
        },
        {
            "title": "Maidaan",
            "synopsis": "The story of legendary football coach Syed Abdul Rahim.",
            "cast": ["Ajay Devgn", "Priyamani", "Gajraj Rao"],
            "release_date": "2024-04-10",
            "genres": ["Biography", "Sports"]
        },
        {
            "title": "Teri Baaton Mein Aisa Uljha Jiya",
            "synopsis": "A man falls in love with a robot in this romantic comedy.",
            "cast": ["Shahid Kapoor", "Kriti Sanon"],
            "release_date": "2024-02-09",
            "genres": ["Romance", "Comedy", "Sci-Fi"]
        },
        {
            "title": "Devara",
            "synopsis": "An epic action drama set in coastal India.",
            "cast": ["Jr NTR", "Janhvi Kapoor", "Saif Ali Khan"],
            "release_date": "2024-10-10",
            "genres": ["Action", "Drama"]
        },
        {
            "title": "Vicky Vidya Ka Woh Wala Video",
            "synopsis": "A comedy about a couple whose private video goes missing.",
            "cast": ["Rajkummar Rao", "Triptii Dimri"],
            "release_date": "2024-10-11",
            "genres": ["Comedy"]
        },
        {
            "title": "Sikandar",
            "synopsis": "An action-packed thriller with Salman Khan in the lead.",
            "cast": ["Salman Khan", "Rashmika Mandanna"],
            "release_date": "2025-03-27",
            "genres": ["Action", "Thriller"]
        },
        {
            "title": "Jigra",
            "synopsis": "A sister's fight to save her brother from a foreign prison.",
            "cast": ["Alia Bhatt", "Vedang Raina"],
            "release_date": "2024-10-11",
            "genres": ["Drama", "Thriller"]
        },
        {
            "title": "Sonu Ke Titu Ki Sweety 2",
            "synopsis": "The sequel to the hit friendship comedy continues the story.",
            "cast": ["Kartik Aaryan", "Sunny Singh", "Ananya Panday"],
            "release_date": "2025-02-14",
            "genres": ["Comedy", "Romance"]
        },
        {
            "title": "Dhamaka 2",
            "synopsis": "A journalist faces another high-stakes situation in this thriller sequel.",
            "cast": ["Kartik Aaryan", "Kriti Sanon"],
            "release_date": "2025-06-20",
            "genres": ["Thriller", "Drama"]
        },
        {
            "title": "Brahmastra Part Two: Dev",
            "synopsis": "The Astraverse saga continues with the story of Dev.",
            "cast": ["Ranbir Kapoor", "Alia Bhatt", "Deepika Padukone"],
            "release_date": "2025-12-25",
            "genres": ["Fantasy", "Action"]
        },
        {
            "title": "Pathaan 2",
            "synopsis": "RAW agent Pathaan returns for another thrilling mission.",
            "cast": ["Shah Rukh Khan", "Deepika Padukone", "John Abraham"],
            "release_date": "2025-11-04",
            "genres": ["Action", "Thriller"]
        }
    ]

async def populate_movies():
    """Populate the database with Bollywood movies"""
    
    print("Starting movie population process...")
    
    # First, try scraping
    scraped_movies = scrape_bollywood_hungama()
    
    # Use dummy data if scraping failed
    if not scraped_movies:
        print("\nUsing comprehensive dummy data with 30 realistic Bollywood movies...")
        movies_data = get_dummy_bollywood_movies()
    else:
        # If scraping worked, use scraped data
        movies_data = scraped_movies
    
    # Check if movies already exist
    existing_count = await db.movies.count_documents({})
    if existing_count > 0:
        print(f"\nDatabase already has {existing_count} movies.")
        response = input("Do you want to clear and re-populate? (yes/no): ")
        if response.lower() == 'yes':
            await db.movies.delete_many({})
            print("Cleared existing movies.")
        else:
            print("Keeping existing movies. Exiting.")
            return
    
    print(f"\nAdding {len(movies_data)} movies to database...")
    
    added_count = 0
    
    for movie_data in movies_data:
        # Create movie symbol from title
        symbol = ''.join(c for c in movie_data['title'].upper() if c.isalnum())[:6]
        
        # Generate realistic initial prices based on movie type
        base_price = random.randint(80, 400)
        initial_price = round(base_price + random.uniform(-20, 50), 2)
        
        # Generate shares based on popularity
        total_shares = random.randint(50000, 200000)
        
        movie_doc = {
            'id': str(uuid.uuid4()),
            'tmdb_id': None,
            'title': movie_data['title'],
            'symbol': symbol,
            'poster': None,  # Can be added later
            'backdrop': None,
            'release_date': movie_data.get('release_date', '2024-12-31'),
            'synopsis': movie_data.get('synopsis', f"An exciting Bollywood movie - {movie_data['title']}"),
            'cast': movie_data.get('cast', ['Star Cast']),
            'genres': movie_data.get('genres', ['Drama']),
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
        added_count += 1
        print(f"Added: {movie_data['title']} ({symbol}) - ₹{initial_price}")
    
    print(f"\n✅ Successfully added {added_count} movies to the database!")
    print(f"Total movies in database: {await db.movies.count_documents({})}")

async def main():
    try:
        await populate_movies()
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
