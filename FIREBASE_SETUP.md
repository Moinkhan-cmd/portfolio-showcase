# Firebase Admin Panel Setup Guide

This guide will walk you through setting up Firebase for the admin panel. The admin panel uses Firebase Authentication, Firestore, and Storage to manage your portfolio content.

## 📋 Prerequisites

- A Google account
- Your portfolio website project ready to deploy

## 🚀 Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "portfolio-admin")
4. Click **Continue**
5. Disable Google Analytics (optional, you can enable it later if needed)
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
2. Copy the contents of `firestore.rules` file from this project
3. Replace the existing rules with the copied rules
4. **Important**: Replace `adminEmail` in the rules with your actual admin email (the one you created in Authentication)
5. Click **Publish**

**Example rule modification:**
```
// Replace this line in the rules:
function isAdmin() {
  return isAuthenticated() && 
         request.auth.token.email == 'your-admin-email@example.com';
}
```

**Note**: The current rules allow public read access (so your portfolio can display content) but restrict write access to authenticated admin users only.

## 📦 Step 4: Set Up Cloud Storage

1. Click on **Storage** in the left sidebar
2. Click **Get started**
3. Select **Start in test mode** (we'll update rules later)
4. Choose the same location as Firestore
5. Click **Done**

### Set Storage Security Rules

1. In Storage, click on the **Rules** tab
2. Copy the contents of `storage.rules` file from this project
3. Replace the existing rules with the copied rules
4. Click **Publish**

## 🔑 Step 5: Get Firebase Configuration

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
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## ⚙️ Step 6: Configure Environment Variables

### Local Development (.env file)

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...

# Admin Email (the email you used to create the admin user)
VITE_ADMIN_EMAIL=your-admin-email@example.com

# EmailJS (your existing variables - keep them)
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_PUBLIC_KEY=your-public-key
```

3. Replace all the placeholder values with your actual Firebase configuration values
4. **Important**: Make sure `.env` is in your `.gitignore` file (it should be already)

### Netlify Production Environment Variables

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site configuration** > **Environment variables**
4. Add each environment variable from your `.env` file:

   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_EMAIL` (your admin email)
   - `VITE_EMAILJS_SERVICE_ID` (your existing)
   - `VITE_EMAILJS_TEMPLATE_ID` (your existing)
   - `VITE_EMAILJS_PUBLIC_KEY` (your existing)

5. After adding all variables, **redeploy your site** in Netlify

## 🎯 Step 7: Test the Setup

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
- **Image Storage**: Images are stored in Firebase Storage with public read access but authenticated write access.
- **First Time Setup**: When you first log in, the database will be empty. Use the admin panel to add your first project, certification, experience entry, or skill.

## 🔧 Troubleshooting

### "Firebase: Error (auth/user-not-found)"
- Make sure you created the user in Firebase Authentication > Users
- Verify your email is correct in the environment variables

### "Permission denied" errors
- Check that your Firestore rules are published
- Verify your admin email matches `VITE_ADMIN_EMAIL` exactly
- Make sure you're logged in with the correct admin account

### Images not uploading
- Check Storage rules are published
- Verify `VITE_FIREBASE_STORAGE_BUCKET` is correct
- Check browser console for specific error messages

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
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## ✅ Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Admin user created in Authentication
- [ ] Firestore database created
- [ ] Firestore security rules updated and published
- [ ] Storage bucket created
- [ ] Storage security rules updated and published
- [ ] Firebase configuration copied
- [ ] Environment variables added to `.env` (local)
- [ ] Environment variables added to Netlify (production)
- [ ] Site redeployed with new environment variables
- [ ] Admin login tested successfully
- [ ] Created first project/certification/experience/skill successfully

---

**Congratulations!** 🎉 Your admin panel is now set up and ready to use. You can now manage your portfolio content dynamically without touching code!

