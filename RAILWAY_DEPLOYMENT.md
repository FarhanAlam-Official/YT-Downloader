# Railway Deployment Guide

## Prerequisites
1. GitHub account with your YTDownloader repository
2. Railway account (free tier available)
3. Brevo account for email service

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 1.2 Verify Repository Structure
```
YT-Downloader/
├── app/                    # Frontend (Next.js)
├── backend/               # Backend (FastAPI)
├── components/            # Shared components
├── railway.toml          # Railway configuration
├── package.json          # Frontend dependencies
└── backend/requirements.txt  # Backend dependencies
```

## Step 2: Deploy to Railway

### 2.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### 2.2 Deploy Backend First
1. Click "Deploy from GitHub repo"
2. Select your YTDownloader repository
3. Choose "Deploy from existing repo"
4. Set source directory to `backend`
5. Railway will auto-detect Python and install dependencies

### 2.3 Configure Backend Environment Variables
In Railway dashboard, go to your backend service → Variables tab:

```
BREVO_API_KEY=your-api-key
CONTACT_TO_EMAIL=your-email@gmail.com
CONTACT_FROM_EMAIL=your-verified-sender@domain.com
CONTACT_FROM_NAME=YTDownloader
RATE_LIMIT_PER_MIN=5
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=production
CORS_ORIGINS=https://ytdownloader-production.up.railway.app
```

### 2.4 Get Backend URL
1. Go to your backend service in Railway
2. Copy the generated URL (e.g., `https://ytdownloader-backend-production.up.railway.app`)

### 2.5 Deploy Frontend
1. In Railway dashboard, click "New Service"
2. Choose "Deploy from GitHub repo"
3. Select the same repository
4. Set source directory to `.` (root)
5. Railway will auto-detect Next.js

### 2.6 Configure Frontend Environment Variables
In Railway dashboard, go to your frontend service → Variables tab:

```
NEXT_PUBLIC_API_BASE=https://ytdownloader-backend-production.up.railway.app
```

## Step 3: Configure Domains

### 3.1 Backend Domain
1. Go to backend service → Settings → Domains
2. Railway provides a default domain
3. Note this URL for frontend configuration

### 3.2 Frontend Domain
1. Go to frontend service → Settings → Domains
2. Railway provides a default domain
3. This is your main app URL

### 3.3 Update CORS (if needed)
If your frontend domain changes, update the backend CORS_ORIGINS variable.

## Step 4: Test Your Deployment

### 4.1 Test Backend
Visit: `https://your-backend-url.railway.app/status`
Should show: `{"message": "YouTube Downloader API is running..."}`

### 4.2 Test Frontend
Visit: `https://your-frontend-url.railway.app`
Should show your YTDownloader homepage

### 4.3 Test Contact Form
1. Go to About page
2. Submit contact form
3. Check if email is received

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain
1. Go to Railway dashboard → Settings → Domains
2. Click "Add Domain"
3. Follow DNS configuration instructions

### 5.2 Update Environment Variables
Update `CORS_ORIGINS` and `NEXT_PUBLIC_API_BASE` with your custom domain.

## Troubleshooting

### Backend Issues
- Check Railway logs for Python errors
- Verify all environment variables are set
- Ensure FFmpeg is available (Railway supports it)

### Frontend Issues
- Check Railway logs for build errors
- Verify `NEXT_PUBLIC_API_BASE` points to correct backend URL
- Check CORS configuration

### Contact Form Issues
- Verify Brevo API key is correct
- Check if sender email is verified in Brevo
- Test with Railway logs

## Monitoring

### Railway Dashboard
- Monitor service health
- View logs in real-time
- Check resource usage

### Health Checks
- Backend: `/status` endpoint
- Frontend: Automatic Railway health checks

## Cost Optimization
- Railway free tier: $5 credit monthly
- Both services should fit within free tier
- Monitor usage in Railway dashboard

## Security Notes
- Environment variables are encrypted
- HTTPS is enabled by default
- CORS is properly configured
- Rate limiting is active

## Support
- Railway documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
