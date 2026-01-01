# iOS Offline Usage Guide

## 📱 How to Install on iOS for Offline Use

### Step 1: Open in Safari

1. **Open Safari** on your iPhone or iPad (not Chrome or other browsers)
2. Navigate to your deployed app URL (e.g., `https://your-app.vercel.app`)
   - Or use your local development server if testing locally

### Step 2: Add to Home Screen

1. Tap the **Share button** (square with arrow pointing up) at the bottom of Safari
2. Scroll down and tap **"Add to Home Screen"**
3. Customize the name if you want (default: "Medicine Management")
4. Tap **"Add"** in the top right corner

### Step 3: Launch the App

1. Find the app icon on your home screen
2. Tap it to launch
3. The app will open in **standalone mode** (no Safari browser UI)

## 🔌 Offline Functionality

### What Works Offline

✅ **All Core Features Work Offline:**
- View all medicines
- Add new medicines
- Edit existing medicines
- Delete medicines
- Search and filter medicines
- View summary dashboard
- Track most used medicines
- All data is stored locally in your device

### How It Works

1. **Service Worker**: Caches the app files for offline access
2. **localStorage**: All medicine data is stored on your device
3. **No Internet Required**: Once installed, works completely offline

### First-Time Setup

1. **Connect to Internet** the first time you visit the app
2. The app will automatically:
   - Download and cache all necessary files
   - Register the service worker for offline support
   - Save everything to your device

3. **After first load**, you can use it offline forever!

## 🚀 Using the App Offline

### Normal Usage

1. Open the app from your home screen
2. Use it exactly as you would online
3. All changes are saved to your device automatically
4. No internet connection needed

### Data Storage

- **All data is stored on your device**
- **No cloud sync** (data stays on your device only)
- **No account required**
- **Completely private**

### Offline Indicators

- The app works the same whether online or offline
- No special "offline mode" indicator needed
- If you see any errors, check your device storage

## 🔄 Syncing Between Devices

### Current Limitation

- Data is stored **only on the device** where you use it
- **No automatic sync** between devices
- Each device has its own separate data

### Future Enhancement

- Cloud sync feature can be added later
- For now, use export/import if needed

## 📋 Troubleshooting

### App Not Working Offline?

1. **Check Installation**:
   - Make sure you added it to home screen from Safari
   - Don't use bookmarks - use "Add to Home Screen"

2. **First-Time Setup**:
   - Visit the app **with internet** first time
   - Wait for service worker to install
   - Check browser console for errors (if developer)

3. **Clear and Reinstall**:
   - Delete the app from home screen
   - Clear Safari cache: Settings → Safari → Clear History and Website Data
   - Reinstall following steps above

4. **Storage Issues**:
   - Check available storage: Settings → General → iPhone Storage
   - Free up space if needed
   - App uses minimal storage (data only, no media)

### Service Worker Not Registering?

1. **HTTPS Required**: Service workers only work on HTTPS (or localhost)
2. **Safari Support**: iOS Safari fully supports service workers
3. **Check Console**: Open Safari Developer Tools to see errors

### Data Not Saving?

1. **localStorage Available**: Check if localStorage is enabled
2. **Private Browsing**: Don't use private browsing mode
3. **Storage Quota**: Check if device storage is full

## 💾 Data Management

### Backup Your Data

Currently, data is stored in browser localStorage. To backup:

1. **Export Data** (if export feature is added):
   - Go to Settings/Export
   - Download JSON file
   - Save to iCloud or Files app

2. **Manual Backup**:
   - Use Safari Developer Tools
   - Or wait for export feature

### Restore Data

1. **Import Data** (if import feature is added):
   - Upload previously exported JSON file
   - Data will be restored

## 🔒 Privacy & Security

### Data Privacy

- ✅ All data stored **locally on your device**
- ✅ **No data sent to servers**
- ✅ **No tracking or analytics** (unless you add it)
- ✅ **Completely private**

### Security

- ✅ Data encrypted by iOS (device encryption)
- ✅ No network requests = no data leaks
- ✅ Works in airplane mode

## 📱 iOS-Specific Features

### Standalone Mode

- App opens without Safari UI
- Looks like a native app
- Full screen experience
- Status bar customization

### Home Screen Icon

- Custom icon (medicine pill design)
- Appears on home screen
- Can be organized in folders
- Can be added to Control Center (iOS 14+)

### Notifications

- Currently not implemented
- Can be added for expiry reminders
- Requires user permission

## 🎯 Best Practices

1. **First Visit**: Always visit with internet first time
2. **Regular Use**: Can use completely offline after first visit
3. **Updates**: Visit with internet occasionally to get app updates
4. **Backup**: Export data regularly if important
5. **Storage**: Monitor device storage

## ❓ FAQ

**Q: Do I need internet after installation?**  
A: No! Once installed, works completely offline.

**Q: Will I lose data if I delete the app?**  
A: Yes, data is stored locally. Export before deleting.

**Q: Can I use it on multiple devices?**  
A: Each device has separate data. No sync currently.

**Q: Does it work in airplane mode?**  
A: Yes! Perfect for offline use.

**Q: How much storage does it use?**  
A: Very minimal - only your medicine data (typically < 1MB).

**Q: Can I use it without installing?**  
A: Yes, but offline features work better when installed.

**Q: Will it work on iPad?**  
A: Yes! Works on both iPhone and iPad.

## 🆘 Support

If you encounter issues:

1. Check this guide
2. Try reinstalling
3. Clear Safari cache
4. Check device storage
5. Ensure first visit was with internet

---

**Note**: This app is designed to work completely offline. All data is stored on your device using localStorage, and the app files are cached by the service worker for offline access.

