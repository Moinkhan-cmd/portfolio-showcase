# Firebase Admin Panel Setup Guide

This guide will walk you through setting up Firebase for the admin panel. The admin panel uses Firebase Authentication and Firestore to manage your portfolio content. Images are hosted externally (ImgBB, Cloudinary, GitHub raw URLs, etc.) and stored as URLs in Firestore - no Firebase Storage needed, keeping everything on the free Spark plan!

## 📋 Prerequisites

- A Google account
- Your portfolio website project ready to deploy

## 🚀 Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "portfolio-admin")
4. Click **Continue**
5. **Enable Google Analytics** (recommended - you can enable it later if you skip this step)
   - If you enable it now, select or create a Google Analytics account
   - If you skip it, see [ENABLE_FIREBASE_ANALYTICS.md](./ENABLE_FIREBASE_ANALYTICS.md) to enable it later
6. Click **Create project**
7. Wait for the project to be created, then click **Continue**

## 🔐 Step 2: Enable Authentication

1. In your Firebase project, click on **Authentication** in the left sidebar
2. Click **Get started**
3. Click on **Sign-in method** tab
4. Click on **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

### Create Admin User

1. Still in **Authentication**, click on the **Users** tab
2. Click **Add user**
3. Enter your admin email address
4. Enter a strong password (save this - you'll need it to log in)
5. Click **Add user**
6. **Important**: Note down your email - this is your admin email

## 💾 Step 3: Create Firestore Database

1. Click on **Firestore Database** in the left sidebar
2. Click **Create database**
3. Select **Start in test mode** (we'll update rules later)
4. Choose a location closest to your users
5. Click **Enable**

### Set Firestore Security Rules

1. In Firestore Database, click on the **Rules** tab
2. Open the `firestore.rules` file from this project in your code editor
3. Copy **ALL** the contents of that file (select all with Ctrl+A, then Ctrl+C)
4. Go back to Firebase Console (Rules tab)
5. Delete all the existing rules in the editor
6. Paste the rules you copied (Ctrl+V)
7. Click **Publish** button (top right)
8. ✅ You should see a green success message

**Note**: The current rules allow public read access (so your portfolio can display content) but restrict write access to authenticated admin users only. The admin email check is handled in your app code, not in the rules.

## 🔑 Step 4: Get Firebase Configuration

**Important**: This admin panel uses **URL-based images only**. Images are hosted externally (ImgBB, Cloudinary, GitHub raw URLs, etc.) and stored as URLs in Firestore. No Firebase Storage setup is required, keeping everything on the free Spark plan.

1. Click on the **Project Settings** (gear icon) next to "Project Overview"
2. Scroll down to **"Your apps"** section
3. Click on the **Web icon** (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Portfolio Admin")
5. Check **"Also set up Firebase Hosting"** (optional)
6. Click **Register app**
7. Copy the Firebase configuration object - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

**Note**: `storageBucket` is not needed since we're using URL-based images.

## ⚙️ Step 5: Configure Environment Variables

### Local Development (.env file)

**📝 What is a .env file?**  
It's a file that stores your secret keys (like passwords) so they're not visible in your code. The `.env` file is already in `.gitignore`, so it won't be uploaded to GitHub.

**Steps:**

1. **Create a `.env` file** in your project root folder (same folder where `package.json` is)
   - In VS Code: Right-click in the folder → New File → name it `.env` (with the dot!)
   - Make sure it's in the root, not in a subfolder

2. **Copy and paste this template**, then replace the values with YOUR Firebase config:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...

# Admin Email (the email you used to create the admin user)
VITE_ADMIN_EMAIL=your-admin-email@example.com

# EmailJS (your existing variables - keep them)
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_PUBLIC_KEY=your-public-key
```

**Note**: `VITE_FIREBASE_STORAGE_BUCKET` is not needed since we use URL-based images.

3. **Replace the placeholder values** with your actual Firebase configuration:
   - Copy each value from your Firebase config (from Step 4)
   - Paste it after the `=` sign in the `.env` file
   - **Important**: 
     - No spaces around the `=` sign
     - No quotes around the values
     - For `VITE_ADMIN_EMAIL`, use the exact email you created in Firebase Authentication (Step 2)

4. **Save the file** (Ctrl+S or Cmd+S)

5. **Double-check**: Make sure `.env` is in your `.gitignore` file (it should be already - this keeps your secrets safe!)

### Netlify Production Environment Variables

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site configuration** > **Environment variables**
4. Add each environment variable from your `.env` file:

   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_EMAIL` (your admin email)
   - `VITE_EMAILJS_SERVICE_ID` (your existing)
   - `VITE_EMAILJS_TEMPLATE_ID` (your existing)
   - `VITE_EMAILJS_PUBLIC_KEY` (your existing)

5. After adding all variables, **redeploy your site** in Netlify

## 🎯 Step 6: Test the Setup

### Local Testing

1. Make sure your `.env` file is configured correctly
2. Start your development server:
   ```bash
   npm run dev
   ```
3. Navigate to `http://localhost:8080/admin/login`
4. Log in with your admin email and password
5. You should see the admin dashboard

### Production Testing

1. After deploying to Netlify with environment variables set
2. Visit `https://your-site.netlify.app/admin/login`
3. Log in with your admin email and password
4. Test creating a project, certification, experience entry, or skill

## 🛡️ Security Best Practices

1. **Keep your admin email secure** - This is the only email that can access the admin panel
2. **Use a strong password** - Use a password manager to generate and store a strong password
3. **Never commit `.env` file** - Make sure it's in `.gitignore`
4. **Regularly review Firebase usage** - Check Firebase Console for unexpected activity
5. **Set up billing alerts** - Firebase free tier is generous, but set up alerts to avoid surprises

## 📝 Important Notes

- **Public Read Access**: The Firestore rules allow anyone to read projects, certifications, experience, and skills. This is intentional so your portfolio website can display the content.
- **Admin-Only Write Access**: Only users authenticated with your admin email can create, update, or delete content.
- **Image URLs**: Images are hosted externally (ImgBB, Cloudinary, GitHub raw URLs, etc.) and stored as URL strings in Firestore. No Firebase Storage needed!
- **First Time Setup**: When you first log in, the database will be empty. Use the admin panel to add your first project, certification, experience entry, or skill.

## 🔧 Troubleshooting

### "Firebase: Error (auth/user-not-found)"
- Make sure you created the user in Firebase Authentication > Users
- Verify your email is correct in the environment variables

### "Permission denied" errors
- Check that your Firestore rules are published
- Verify your admin email matches `VITE_ADMIN_EMAIL` exactly
- Make sure you're logged in with the correct admin account

### Images not displaying
- Verify image URLs are accessible (try opening them in a new tab)
- Check browser console for CORS or 404 errors
- Ensure URLs are complete (include https://)
- For GitHub raw URLs, use the raw file URL, not the repository page

### Environment variables not working in Netlify
- Make sure all variables start with `VITE_`
- Redeploy your site after adding/updating variables
- Check Netlify build logs for errors

### Can't access `/admin` route
- Make sure you've deployed the latest code with the admin routes
- Check that the route exists in your `App.tsx` or router configuration
- Try accessing `/admin/login` directly

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## ✅ Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Admin user created in Authentication
- [ ] Firestore database created
- [ ] Firestore security rules updated and published
- [ ] Firebase configuration copied
- [ ] Environment variables added to `.env` (local)
- [ ] Environment variables added to Netlify (production)
- [ ] Site redeployed with new environment variables
- [ ] Admin login tested successfully
- [ ] Created first project/certification/experience/skill successfully

---

**Congratulations!** 🎉 Your admin panel is now set up and ready to use. You can now manage your portfolio content dynamically without touching code!

