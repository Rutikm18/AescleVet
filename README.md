# Medicine Management Application

A comprehensive medicine inventory management system built with Next.js, designed to work seamlessly on iOS devices as a Progressive Web App (PWA).

## Features

- ✅ **Medicine Inventory Management**: Add, edit, and delete medicines
- ✅ **Expiry Date Tracking**: Automatic alerts for expiring and expired medicines
- ✅ **Financial Tracking**: Track MRP, quantity, and total price invested
- ✅ **Summary Dashboard**: 
  - 15-day summary of medicine additions and investments
  - Monthly summary with trend charts
  - Category distribution visualization
- ✅ **Medicine Search**: Auto-complete suggestions for medicine names
- ✅ **Categorization**: Organize medicines by categories (Antibiotics, Pain Relief, etc.)
- ✅ **PWA Support**: Installable on iOS devices
- ✅ **Local Storage**: All data stored locally in browser
- ✅ **Security & Validation**: Comprehensive input validation, XSS prevention, data integrity checks
- ✅ **Error Handling**: Error boundaries, user-friendly error messages, graceful failure handling

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **date-fns** - Date manipulation
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. **Generate PWA Icons** (Required for iOS installation):
   - Icons are already generated in the `public/` folder
   - To regenerate them, run: `npm run generate-icons` or `python3 scripts/generate-icons.py`
   - Requires Python 3 with Pillow: `pip install Pillow`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## iOS Installation & Offline Usage

### Quick Setup (3 Steps)

1. **Open Safari** on your iPhone/iPad (not Chrome)
2. Navigate to your app URL
3. Tap **Share** → **"Add to Home Screen"** → **"Add"**

### Offline Functionality

✅ **Works Completely Offline After First Visit**
- All data stored locally on your device
- No internet required after initial installation
- Service worker caches app files automatically
- Perfect for use in areas with poor connectivity

**Important**: Visit the app **with internet connection** the first time to cache all files. After that, it works offline forever!

📖 **Detailed Guide**: See [IOS_OFFLINE_GUIDE.md](./IOS_OFFLINE_GUIDE.md) for complete instructions, troubleshooting, and FAQs.

📱 **Quick Start**: See [QUICK_START_IOS.md](./QUICK_START_IOS.md) for a 3-step guide.

## Deployment

### Vercel (Recommended)

**📖 Complete Guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**Quick Deploy:**
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel auto-detects Next.js (configured in `vercel.json`)
4. Deploy automatically - live in ~2 minutes!

**Configuration:**
- ✅ `vercel.json` already configured
- ✅ Service worker headers set
- ✅ PWA support enabled
- ✅ Security headers configured
- ✅ Image optimization enabled

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Heroku

## Project Structure

```
medicine-mgmt/
├── app/
│   ├── layout.tsx      # Root layout with PWA metadata
│   ├── page.tsx        # Main page component
│   └── globals.css     # Global styles
├── components/
│   ├── MedicineForm.tsx      # Form for adding/editing medicines
│   ├── MedicineList.tsx      # List of medicines with expiry alerts
│   └── SummaryDashboard.tsx  # Summary and analytics dashboard
├── types/
│   └── medicine.ts     # TypeScript interfaces
└── public/
    └── manifest.json   # PWA manifest
```

## Features in Detail

### Medicine Management
- Add medicines with name, category, MRP, quantity, expiry date
- Auto-calculate total price invested (MRP × Quantity)
- Track manufacturer and batch number
- Edit and delete medicines

### Expiry Tracking
- Visual alerts for medicines expiring within 15 days
- Highlight expired medicines
- Sort medicines by expiry date

### Summary Dashboard
- **15 Days Summary**: Track recent additions and investments
- **Monthly Summary**: View monthly trends with charts
- **Category Distribution**: Pie chart showing medicine distribution
- **Investment Trends**: Bar chart showing 6-month investment history

## Security & Validation

The application includes comprehensive security measures:

- **Input Validation**: All inputs are validated and sanitized
- **XSS Prevention**: HTML/script tags and event handlers are stripped
- **Data Integrity**: Type checking, range validation, and consistency checks
- **Error Handling**: Error boundaries catch crashes, user-friendly error messages
- **Storage Security**: Quota checking, safe localStorage operations
- **Business Logic Validation**: Price calculations, date logic, duplicate detection

See [SECURITY.md](./SECURITY.md) and [TEST_CASES.md](./TEST_CASES.md) for detailed documentation.

## Future Enhancements

- Cloud sync across devices
- Barcode scanning for medicine lookup
- Advanced analytics and reports
- Medicine usage tracking
- Reminder notifications
- Export to PDF/Excel
- Data encryption
- Backup/restore functionality

## License

MIT

