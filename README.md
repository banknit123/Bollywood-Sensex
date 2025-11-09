# BollywoodSensex - Movie Stock Trading Platform

🎬 **Live URL**: https://cinematic-stocks-1.preview.emergentagent.com

## Overview

BollywoodSensex is India's first movie stock trading platform where users can trade Bollywood movie stocks using virtual currency. Each user starts with ₹1,00,000 to build their entertainment portfolio.

## Key Features

- ✅ **Real-time Trading**: Prices update every 30 seconds
- ✅ **Demand-Supply Pricing**: Prices change based on trading volume
- ✅ **30 Bollywood Movies**: Latest and upcoming films
- ✅ **₹1,00,000 Starting Balance**: Free virtual funds for every user
- ✅ **Portfolio Tracking**: Real-time P&L and performance metrics
- ✅ **Indian Theme**: Saffron & green color scheme
- ✅ **No Hardcoded Data**: Everything stored in MongoDB

## Quick Start

### Register & Start Trading
1. Visit https://cinematic-stocks-1.preview.emergentagent.com
2. Click "Start Trading" → Create account
3. Receive ₹1,00,000 instantly
4. Browse movies and start trading!

## Tech Stack

- **Frontend**: React 19 + Shadcn UI + Tailwind CSS
- **Backend**: FastAPI (Python 3.11)
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt

## How Pricing Works

Movie stock prices change based on:
1. **Trading Volume**: Each trade impacts price (0.1% - 5%)
2. **Market Simulation**: Random fluctuations every 30 seconds
3. **Supply-Demand**: Large orders have bigger impact
4. **Price Floor**: Cannot drop below 10% of initial price

## Database Collections

- `users` - User accounts with balances
- `movies` - 30 Bollywood movies with live prices
- `portfolio` - User holdings
- `transactions` - Complete trade history

## Sample Movies

Fighter • Pushpa 2 • Stree 2 • Singham Again • War 2 • Pathaan 2 • Brahmastra 2 • and 23 more...

## API Endpoints

**Auth**: `/api/auth/register`, `/api/auth/login`  
**Trading**: `/api/trade/order`, `/api/movies`  
**Portfolio**: `/api/portfolio`, `/api/transactions`  
**Market**: `/api/market/trending`, `/api/market/stats`

Built with ❤️ for Bollywood fans
