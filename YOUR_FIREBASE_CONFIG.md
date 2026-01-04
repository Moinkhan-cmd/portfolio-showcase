# Your Firebase Configuration

This file contains YOUR Firebase configuration values. Use these values when setting up your `.env` file.

## 🔑 Your Firebase Config Values

```env
# Copy these into your .env file

VITE_FIREBASE_API_KEY=AIzaSyBc6z77sXLqBIy3nTmhpD2hXUj59nPRzb0
VITE_FIREBASE_AUTH_DOMAIN=portfolio-showcase-9748a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=portfolio-showcase-9748a
VITE_FIREBASE_MESSAGING_SENDER_ID=1013442670098
VITE_FIREBASE_APP_ID=1:1013442670098:web:19a4887b0df698f2f332cb

# ⚠️ IMPORTANT: Replace this with YOUR admin email (from Firebase Authentication)
VITE_ADMIN_EMAIL=your-email-here@example.com
```

## 📝 Quick Instructions

1. **Create a `.env` file** in your project root (same folder as `package.json`)

2. **Copy all the lines above** (starting with `VITE_FIREBASE_...`)

3. **Paste into your `.env` file**

4. **Replace `your-email-here@example.com`** with the actual email you use in Firebase Authentication

5. **Save the file**

6. **Done!** Now you can test with `npm run dev`

---

## 🔐 Your Firebase Project Details

- **Project ID**: `portfolio-showcase-9748a`
- **Project Name**: portfolio-showcase
- **Auth Domain**: portfolio-showcase-9748a.firebaseapp.com

## ⚠️ Important Security Note

This file is safe to have in your project because:
- It only contains public configuration (not secrets)
- The real security is your admin email and password
- Your `.env` file (with the actual admin email) is NOT committed to Git

However, if you want to be extra safe, you can delete this file after setting up your `.env` file.











