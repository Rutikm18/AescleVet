# Deployment Guide

This guide will help you deploy the Medicine Management application to various hosting platforms.

## Prerequisites

1. Node.js 18+ installed
2. Git repository set up
3. Account on your chosen hosting platform

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate PWA Icons

You need to create two icon files for the PWA:
- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

You can use any image editor or online tool to create these icons. A simple medicine/healthcare themed icon works best.

### 3. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to test the application.

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the recommended platform for Next.js applications.

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"
   - Your app will be live in minutes!

3. **Custom Domain (Optional)**
   - In Vercel dashboard, go to Settings → Domains
   - Add your custom domain

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login
   - Drag and drop the `.next` folder, OR
   - Connect to GitHub and auto-deploy

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

### Option 3: Railway

1. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Next.js

### Option 4: AWS Amplify

1. **Deploy on AWS Amplify**
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Amplify will auto-detect Next.js
   - Review and deploy

## Environment Variables

Currently, the app doesn't require any environment variables. If you add features like:
- Medicine API integration
- Database connections
- Authentication

You'll need to add them in your hosting platform's environment variables section.

## Post-Deployment

### iOS Installation Instructions

After deployment, share these instructions with users:

1. Open the app URL in Safari on iOS
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Customize the name if needed
5. Tap "Add"
6. The app icon will appear on the home screen

### Testing on iOS

1. Open the deployed URL on your iPhone/iPad
2. Test all features:
   - Add/edit/delete medicines
   - Check expiry alerts
   - View summary dashboard
   - Test offline functionality (if service worker is added)

## Troubleshooting

### Build Errors

If you encounter build errors:

1. **Check Node version**: Ensure you're using Node.js 18+
   ```bash
   node --version
   ```

2. **Clear cache and reinstall**:
   ```bash
   rm -rf node_modules .next
   npm install
   npm run build
   ```

3. **Check for TypeScript errors**:
   ```bash
   npm run lint
   ```

### PWA Not Working

1. Ensure `manifest.json` is in the `public` folder
2. Check that icons exist and are properly sized
3. Verify the app is served over HTTPS (required for PWA)

### iOS Specific Issues

1. **App not installing**: Ensure you're using Safari (not Chrome)
2. **Icons not showing**: Check that icon files exist and are valid PNGs
3. **Layout issues**: Test on actual iOS device, not just simulator

## Continuous Deployment

All recommended platforms support automatic deployments:
- Push to `main` branch → Auto-deploy
- Pull requests → Preview deployments

## Monitoring

Consider adding:
- Analytics (Google Analytics, Plausible)
- Error tracking (Sentry)
- Performance monitoring

## Support

For issues or questions:
1. Check the README.md
2. Review Next.js documentation
3. Check hosting platform documentation

