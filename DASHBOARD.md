# Dashboard Features

## Overview
The Dashboard provides comprehensive analytics and management for your QR code generation activities.

## Features

### 📊 Key Metrics
- **Total QR Codes Generated**: Track all QR codes created
- **Downloads**: Monitor how many QR codes were downloaded
- **Shares**: Track social media and direct shares
- **Scans**: Count of QR code scans (when tracking is enabled)

### 📈 Analytics Charts
- **QR Types Distribution**: Visual breakdown by type (URL, vCard, WiFi, Text)
- **Export Formats**: Distribution of PNG, SVG, and JPG exports
- **Real-time Updates**: Automatically refreshes with new data

### 🎯 Performance Metrics
- **Download Rate**: Percentage of generated codes that were downloaded
- **Share Rate**: Percentage of codes that were shared
- **Session Duration**: Total time spent using the application
- **Most Used Type**: Your preferred QR code type
- **Last Activity**: Latest usage timestamp

### 💼 Batch Session Management
- View all active batch sessions
- See item counts and creation dates
- Delete individual sessions
- Track session updates

### 🏆 Achievement System
Dynamic badges based on usage:
- 🎯 **First Steps**: 1-9 QR codes
- ⚡ **Getting Started**: 10-49 QR codes
- 🌟 **QR Master**: 50-99 QR codes
- 🏆 **Power User**: 100+ QR codes

### 🛠️ Management Tools
- **Refresh**: Update dashboard with latest data
- **Reset Statistics**: Clear all analytics data
- **Delete Sessions**: Remove batch sessions

## Access Methods

### 1. Navigation Menu
Click "Dashboard" in the top navigation bar

### 2. Floating Action Button (FAB)
- Appears on all pages except Dashboard
- Bottom-right corner
- Hover to expand label
- Quick access from anywhere

### 3. Direct URL
Navigate to `/#dashboard` or use the routing system

## Data Storage
All analytics data is stored locally using:
- **LocalStorage** for persistence
- **No server communication** - complete privacy
- **Auto-cleanup** - Expired sessions removed automatically

## Data Tracked
- QR code generation count
- Download events
- Share events
- Scan tracking (optional)
- QR type preferences
- Export format preferences
- Session duration
- Timestamps

## Privacy
- All data stored locally on your device
- No data sent to external servers
- Complete control over your analytics
- Reset anytime with one click

## Technical Details

### Components
- `Dashboard.tsx` - Main dashboard page
- `StatsDashboard.tsx` - Detailed statistics modal
- `QuickStats.tsx` - Summary widget
- `DashboardFAB.tsx` - Floating action button

### Services
- `analyticsService.ts` - Analytics tracking
- `batchQRService.ts` - Batch session management

### Storage Keys
- `qr_analytics` - Analytics data
- `qr_batch_sessions` - Batch sessions
- `qr_history` - Recent QR codes

## Future Enhancements
- Export analytics as PDF/CSV
- Comparison charts (week/month/year)
- Custom date range filters
- Goal setting and tracking
- Integration with cloud storage
- Team collaboration features
