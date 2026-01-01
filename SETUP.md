# Quick Setup Guide

Follow these steps to get your Medicine Management app up and running:

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, TypeScript, Tailwind CSS, and charting libraries.

## Step 2: PWA Icons

✅ **Icons are already generated!** The `public/` folder contains:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

If you need to regenerate them:
```bash
npm run generate-icons
# or
python3 scripts/generate-icons.py
```

**Note:** The icon generator requires Python 3 with Pillow:
```bash
pip install Pillow
```

## Step 3: Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Step 4: Test Features

1. **Add Medicine**: Click "Add New Medicine" and fill in the form
2. **Edit Medicine**: Click the edit icon on any medicine card
3. **Delete Medicine**: Click the delete icon (trash) on any medicine card
4. **View Summary**: Switch to the "Summary" tab to see analytics
5. **Test Expiry Alerts**: Add a medicine with expiry date within 15 days

## Step 5: Test on iOS Device

1. Make sure your development server is accessible on your network
2. Find your computer's local IP address:
   - Mac: System Preferences → Network
   - Windows: `ipconfig` in command prompt
3. On your iOS device, open Safari and go to: `http://YOUR_IP:3000`
4. Test the app functionality
5. To install as PWA: Tap Share → Add to Home Screen

## Step 6: Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Icons Not Showing
- Ensure icon files are in `public/` folder
- Check file names are exactly `icon-192.png` and `icon-512.png`
- Verify files are valid PNG images

### Build Errors
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Check Node version: `node --version` (should be 18+)

### TypeScript Errors
- These are normal before first `npm install`
- Run `npm install` to resolve

## Next Steps

- Review `DEPLOYMENT.md` for hosting instructions
- Customize categories in `types/medicine.ts`
- Add more features as needed

