# Vercel Deployment Guide

Complete guide to deploy your Veterinary Medicine Management app to Vercel.

## 🚀 Quick Deployment (5 Minutes)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login (use GitHub for easy integration)
   - Click **"New Project"**
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click **"Deploy"**

3. **Done!** Your app will be live in ~2 minutes

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose your settings
   - Deploy!

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All dependencies are in `package.json`
- [ ] `vercel.json` is configured (already done!)
- [ ] Icons are generated (`public/icon-192.png` and `icon-512.png`)
- [ ] `manifest.json` exists in `public/` folder
- [ ] Service worker (`public/sw.js`) exists
- [ ] No environment variables needed (or configure them in Vercel dashboard)
- [ ] Code is pushed to Git repository

## ⚙️ Configuration Details

### vercel.json Explained

Our `vercel.json` includes:

1. **Framework Detection**: Auto-detects Next.js
2. **Build Settings**: Uses `npm run build`
3. **Service Worker Headers**: Proper caching for offline support
4. **PWA Headers**: Security headers and PWA support
5. **Image Optimization**: AVIF and WebP support
6. **Function Configuration**: 10s timeout for API routes
7. **Region**: Deploys to `iad1` (US East)

### Headers Configuration

- **Service Worker**: No cache (always fresh)
- **Manifest & Icons**: Long cache (1 year, immutable)
- **Security Headers**: XSS protection, frame options, etc.

## 🔧 Environment Variables

Currently, no environment variables are required. If you add features later:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables for:
   - Production
   - Preview
   - Development

## 📱 Post-Deployment: iOS Setup

After deployment:

1. **Get your app URL** (e.g., `https://your-app.vercel.app`)
2. **Open in Safari on iOS**
3. **Add to Home Screen** (see [IOS_OFFLINE_GUIDE.md](./IOS_OFFLINE_GUIDE.md))
4. **Test offline functionality**

## 🔄 Continuous Deployment

Vercel automatically deploys:

- **Every push to `main`** → Production
- **Every pull request** → Preview deployment
- **Every branch push** → Preview deployment

### Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificate is automatic (Let's Encrypt)

## 🐛 Troubleshooting

### Build Fails

**Error: Missing dependencies**
```bash
# Check package.json includes all dependencies
npm install
npm run build  # Test locally first
```

**Error: TypeScript errors**
```bash
npm run lint  # Fix linting errors
```

**Error: Service worker not found**
- Ensure `public/sw.js` exists
- Check file is committed to Git

### Service Worker Not Working

1. **Check HTTPS**: Service workers require HTTPS (Vercel provides this)
2. **Check Headers**: Verify `vercel.json` headers are correct
3. **Check Console**: Open browser DevTools → Application → Service Workers

### Offline Not Working

1. **First Visit**: Must visit with internet to cache files
2. **Service Worker**: Check if registered in DevTools
3. **Cache**: Check Application → Cache Storage in DevTools

## 📊 Monitoring & Analytics

### Vercel Analytics (Optional)

1. Go to Project Settings → Analytics
2. Enable Vercel Analytics
3. View real-time analytics

### Error Tracking (Optional)

Consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for usage stats

## 🔒 Security Settings

### Recommended Vercel Settings

1. **Attack Challenge Mode**: Enable in Security settings
2. **Logs Protection**: Enable to protect sensitive data
3. **Fork Protection**: Enable to prevent unauthorized forks

### Security Headers

Already configured in `vercel.json`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

## 🚀 Performance Optimization

### Automatic Optimizations

Vercel automatically:
- ✅ Optimizes images (AVIF, WebP)
- ✅ Minifies JavaScript/CSS
- ✅ Enables HTTP/2
- ✅ Provides CDN globally
- ✅ Enables compression

### Manual Optimizations

Already configured:
- ✅ Service worker caching
- ✅ Static asset caching
- ✅ Next.js optimizations

## 📈 Scaling

Vercel handles:
- **Automatic scaling** based on traffic
- **Edge network** for global performance
- **Serverless functions** scale automatically

No configuration needed!

## 🔄 Updating Your App

### Automatic Updates

1. **Push to GitHub**
2. **Vercel auto-deploys**
3. **Preview URLs** for PRs
4. **Production** for main branch

### Manual Rollback

1. Go to Vercel Dashboard → Deployments
2. Find previous deployment
3. Click "..." → "Promote to Production"

## 💰 Pricing

### Free Tier (Hobby)

- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic SSL
- ✅ Custom domains
- ✅ Perfect for this app!

### When to Upgrade

- High traffic (>100GB/month)
- Team collaboration
- Advanced analytics
- Priority support

## 📝 Deployment Checklist

Before going live:

- [ ] Code pushed to GitHub
- [ ] `vercel.json` configured
- [ ] Icons generated
- [ ] Service worker exists
- [ ] Tested locally (`npm run build`)
- [ ] Deployed to Vercel
- [ ] Tested on iOS device
- [ ] Tested offline functionality
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)

## 🎯 Next Steps

After deployment:

1. ✅ Share your app URL
2. ✅ Test on iOS devices
3. ✅ Test offline functionality
4. ✅ Monitor analytics
5. ✅ Set up custom domain (optional)
6. ✅ Configure environment variables (if needed)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Service Worker Guide](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🆘 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify `vercel.json` configuration
4. Test build locally first
5. Check [Vercel Status](https://www.vercel-status.com/)

---

**Your app is now ready for production deployment on Vercel!** 🎉

