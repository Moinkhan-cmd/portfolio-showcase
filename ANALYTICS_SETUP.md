# Analytics & Visitors Tracking Setup

This document describes the Analytics & Visitors Tracking feature implemented in the Admin Panel.

## Overview

The Analytics system tracks website visitors, page views, user engagement, and provides comprehensive insights through Firebase Analytics integration and custom Firestore-based tracking.

## Features

### 📊 Metrics Tracked

1. **Total Visitors** (daily/weekly/monthly)
   - Unique visitor counts
   - New vs returning visitors
   - Visitor trends over time

2. **Page Views**
   - Total page views
   - Page views per page
   - Page view trends over time

3. **User Engagement**
   - Active users (real-time, last 5 minutes)
   - Logged-in users activity
   - Last active time
   - Pages visited by authenticated users

4. **Device Analytics**
   - Device type distribution (desktop/tablet/mobile)
   - Device type breakdown with charts

5. **Geographic Data**
   - Country-level visitor distribution
   - Top countries by visitor count

6. **Traffic Sources**
   - Referrer tracking
   - Traffic source breakdown (Google, Direct, Social Media, etc.)

## Implementation Details

### Data Storage

The analytics data is stored in Firestore collections:

- `analytics_page_views` - Individual page view events
- `analytics_daily_stats` - Aggregated daily statistics
- `analytics_visitors` - Unique visitor records
- `analytics_users` - Logged-in user activity

### Privacy & Security

✅ **Privacy Compliant:**
- No sensitive personal data stored (no IP addresses, no personal identifiers)
- Visitor IDs are anonymized UUIDs stored in localStorage
- Only approximate location data (country/region from timezone)
- Follows basic privacy standards

✅ **Security:**
- Analytics collections have appropriate Firestore security rules
- Public write access for tracking (anonymous visitors)
- Admin-only read access for viewing analytics

### Tracking Implementation

1. **Page View Tracking**
   - Automatically tracks page views on route changes
   - Uses `useAnalytics` hook integrated in the app
   - Tracks: page path, device type, country, traffic source, visitor type

2. **User Activity Tracking**
   - Tracks authenticated user activity
   - Records last active time
   - Maintains activity log (last 50 activities)

3. **Real-time Active Visitors**
   - Calculates active visitors from last 5 minutes
   - Updates every 30 seconds in the admin panel

## Admin Panel UI

### Dashboard Cards

- **Total Visitors** - Shows visitor count for selected period
- **Page Views** - Total page views
- **Active Users (Real-time)** - Currently active visitors
- **Logged-in Users** - Number of authenticated users

### Charts & Visualizations

1. **Visitors Over Time** - Line chart showing visitor trends
2. **Page Views Over Time** - Bar chart showing page view trends
3. **New vs Returning Visitors** - Pie chart breakdown
4. **Device Types** - Pie chart showing device distribution
5. **Top Pages** - Horizontal bar chart of most viewed pages
6. **Top Countries** - Bar chart of visitor distribution by country
7. **Traffic Sources** - Bar chart showing traffic source breakdown

### Time Period Selection

- **Daily** - Last 24 hours
- **Weekly** - Last 7 days
- **Monthly** - Last 30 days

### Logged-in Users Table

Shows:
- Email address
- Last active time
- Last page visited
- Activity count
- Recent pages visited (last 3)

## Setup Instructions

### 1. Update Firestore Rules

The `firestore.rules` file has been updated to include analytics collections. Make sure to:

1. Copy the updated rules to Firebase Console
2. Go to Firestore Database > Rules
3. Paste the updated rules
4. Click "Publish"

### 2. Firebase Analytics (Optional)

Firebase Analytics is initialized in `src/lib/firebase.ts`. If you want to use Firebase Analytics:

1. Enable Google Analytics in your Firebase project (optional)
2. The analytics events are automatically logged alongside Firestore tracking

### 3. No Additional Configuration Required

The analytics tracking is automatically enabled once:
- Firestore rules are updated
- The app is deployed/run
- Users visit your website

## Usage

### Viewing Analytics

1. Log in to the Admin Panel
2. Navigate to "Analytics" in the sidebar
3. Select your desired time period (Daily/Weekly/Monthly)
4. View charts, metrics, and user activity

### Data Collection

Analytics data is collected automatically:
- Page views are tracked on every route change
- User activity is tracked for authenticated users
- No manual intervention required

## Technical Stack

- **Frontend**: React, TypeScript, Recharts
- **Backend**: Firebase Analytics, Firestore
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Hooks

## File Structure

```
src/
├── lib/
│   ├── analytics.ts          # Analytics tracking functions
│   └── firebase.ts           # Firebase config (updated with Analytics)
├── hooks/
│   └── useAnalytics.ts       # Analytics tracking hook
├── components/
│   └── AnalyticsTracker.tsx  # Analytics tracker component
└── pages/admin/
    └── Analytics.tsx         # Analytics admin page
```

## Future Enhancements

Potential improvements:
- Export analytics data (CSV/JSON)
- Custom date range selection
- Advanced filtering options
- User journey tracking
- Conversion tracking
- A/B testing integration

## Notes

- Analytics data starts accumulating from the moment tracking is enabled
- Historical data before implementation won't be available
- The system is designed to be privacy-friendly and GDPR-compliant
- All tracking is done client-side with Firestore storage

