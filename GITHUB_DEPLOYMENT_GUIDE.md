# 🚀 GitHub Deployment Guide for BollywoodSensex

## Domain: www.bollywoodsensex.com

---

## 📋 Complete File Structure for GitHub

Upload the following files and folders to your GitHub repository:

```
bollywoodsensex/
├── backend/
│   ├── server.py
│   ├── populate_movies.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   └── ui/          (all Shadcn components)
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── TradingPage.js
│   │   │   ├── PortfolioPage.js
│   │   │   └── MarketPage.js
│   │   ├── hooks/
│   │   │   └── use-toast.js
│   │   └── lib/
│   │       └── utils.js
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── craco.config.js
│   └── .env.example
├── .gitignore
├── README.md
├── DEPLOYMENT_REPORT.md
└── docker-compose.yml (optional)
```

---

## 🔧 Environment Configuration for Production

### Backend Environment (.env.example)
Create this file in `/backend/` folder:

```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=bollywood_sensex

# Security
JWT_SECRET=change-this-to-a-secure-random-string-in-production

# CORS - Update with your domain
CORS_ORIGINS=https://www.bollywoodsensex.com,http://localhost:3000

# TMDb API (Optional - for real movie data)
TMDB_API_KEY=
```

### Frontend Environment (.env.example)
Create this file in `/frontend/` folder:

```env
# Backend API URL - Update with your deployed backend URL
REACT_APP_BACKEND_URL=https://api.bollywoodsensex.com

# WebSocket Settings
WDS_SOCKET_PORT=443

# Development Settings
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

---

## 📦 Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel:
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variable: `REACT_APP_BACKEND_URL=https://api.bollywoodsensex.com`
4. Add custom domain: `www.bollywoodsensex.com`
5. Deploy

#### Backend on Railway:
1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Set environment variables from .env.example
4. Add MongoDB service
5. Set custom domain: `api.bollywoodsensex.com`

### Option 2: AWS/Google Cloud

Deploy both frontend and backend on cloud platform with custom domain configuration.

### Option 3: Docker Deployment

Use the provided docker-compose.yml for containerized deployment.

---

## 🌐 Domain Configuration

### DNS Records to Configure:

```
Type    Name    Value                           TTL
A       @       [Your Server IP]                3600
A       www     [Your Server IP]                3600
CNAME   api     [Your Backend Server]           3600
```

### SSL Certificate:
- Use Let's Encrypt for free SSL
- Configure HTTPS for both www.bollywoodsensex.com and api.bollywoodsensex.com

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update CORS_ORIGINS to only allow your domain
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Configure MongoDB authentication
- [ ] Set up monitoring and logging
- [ ] Enable rate limiting on API endpoints
- [ ] Review and test all security measures

---

## 📝 Post-Deployment Steps

1. **Test the application:**
   - Register a new user at www.bollywoodsensex.com
   - Verify ₹1,00,000 starting balance
   - Test trading functionality
   - Check portfolio updates
   - Verify real-time price changes

2. **Populate Movie Data:**
   ```bash
   python backend/populate_movies.py
   ```

3. **Monitor logs:**
   - Check backend API logs
   - Monitor frontend errors
   - Track user registrations

4. **Set up backups:**
   - Daily MongoDB backups
   - Code repository backups
   - User data backups

---

## 🆘 Troubleshooting

### Issue: CORS Errors
**Solution:** Update CORS_ORIGINS in backend/.env to include your domain

### Issue: API Not Connecting
**Solution:** Verify REACT_APP_BACKEND_URL in frontend/.env matches your backend URL

### Issue: Database Connection Failed
**Solution:** Check MONGO_URL and ensure MongoDB service is running

### Issue: Movies Not Loading
**Solution:** Run populate_movies.py script to populate database

---

## 📞 Support Resources

- GitHub Issues: Create issue in your repository
- Documentation: README.md and DEPLOYMENT_REPORT.md
- Backend Logs: Check backend service logs
- Frontend Console: Browser DevTools console

---

## ✅ Pre-Deployment Checklist

- [ ] All files uploaded to GitHub
- [ ] .env.example files created (don't commit actual .env files)
- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] MongoDB database set up
- [ ] Environment variables configured
- [ ] Movie data populated
- [ ] All features tested
- [ ] Security measures implemented
- [ ] Monitoring set up

---

**Ready to Deploy!** 🚀

Once you've completed all steps, your BollywoodSensex platform will be live at www.bollywoodsensex.com
