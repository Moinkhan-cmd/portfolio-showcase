# 🔧 Fix: Netlify Environment Variables Setup

**Error**: `Firebase: Error (auth/invalid-api-key)` on Netlify  
**Solution**: Add environment variables to Netlify and redeploy

---

## 📝 Step-by-Step: Add Environment Variables to Netlify

### Step 1: Get Your Values

You need these values from your `.env` file. Open it in VS Code and copy each value:

```
VITE_FIREBASE_API_KEY=AIzaSyBc6z77sXLqBIy3nTmhpD2hXUj59nPRzb0
VITE_FIREBASE_AUTH_DOMAIN=portfolio-showcase-9748a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=portfolio-showcase-9748a
VITE_FIREBASE_MESSAGING_SENDER_ID=1013442670098
VITE_FIREBASE_APP_ID=1:1013442670098:web:19a4887b0df698f2f332cb
VITE_ADMIN_EMAIL=your-admin-email@example.com
```

---

### Step 2: Go to Netlify Dashboard

1. **Go to**: https://app.netlify.com/
2. **Sign in** to your account
3. **Click on your site** (portfolio-showcase)

---

### Step 3: Add Environment Variables

1. **Click "Site configuration"** (or "Site settings") in the top menu

2. **Click "Environment variables"** in the left sidebar

3. **Click "Add a variable"** button (or "Add variable")

4. **Add each variable ONE BY ONE:**

   **Variable 1:**
   - **Key**: `VITE_FIREBASE_API_KEY`
   - **Value**: `AIzaSyBc6z77sXLqBIy3nTmhpD2hXUj59nPRzb0`
   - **Scope**: Production (or "All scopes")
   - Click "Add variable"

   **Variable 2:**
   - **Key**: `VITE_FIREBASE_AUTH_DOMAIN`
   - **Value**: `portfolio-showcase-9748a.firebaseapp.com`
   - **Scope**: Production (or "All scopes")
   - Click "Add variable"

   **Variable 3:**
   - **Key**: `VITE_FIREBASE_PROJECT_ID`
   - **Value**: `portfolio-showcase-9748a`
   - **Scope**: Production (or "All scopes")
   - Click "Add variable"

   **Variable 4:**
   - **Key**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - **Value**: `1013442670098`
   - **Scope**: Production (or "All scopes")
   - Click "Add variable"

   **Variable 5:**
   - **Key**: `VITE_FIREBASE_APP_ID`
   - **Value**: `1:1013442670098:web:19a4887b0df698f2f332cb`
   - **Scope**: Production (or "All scopes")
   - Click "Add variable"

   **Variable 6:**
   - **Key**: `VITE_ADMIN_EMAIL`
   - **Value**: `your-admin-email@example.com` (replace with YOUR actual admin email from Firebase!)
   - **Scope**: Production (or "All scopes")
   - Click "Add variable"

5. **✅ You should now see all 6 variables listed!**

---

### Step 4: Redeploy Your Site

**This is IMPORTANT!** Netlify needs to rebuild your site with the new variables.

1. **Click "Deploys"** in the top menu

2. **Click "Trigger deploy"** button (usually at the top right)

3. **Click "Clear cache and deploy site"**

4. **Wait 2-3 minutes** for the deployment to finish

5. **Click on the new deployment** to watch it build

6. **✅ Wait until you see "Published"** (green checkmark)

---

### Step 5: Test Your Site

1. **Visit your Netlify site**: `https://your-site-name.netlify.app/admin/login`

2. **Try to log in** with your admin email and password

3. **✅ The error should be gone!**

---

## 🔍 Quick Checklist

- [ ] Added `VITE_FIREBASE_API_KEY` to Netlify
- [ ] Added `VITE_FIREBASE_AUTH_DOMAIN` to Netlify
- [ ] Added `VITE_FIREBASE_PROJECT_ID` to Netlify
- [ ] Added `VITE_FIREBASE_MESSAGING_SENDER_ID` to Netlify
- [ ] Added `VITE_FIREBASE_APP_ID` to Netlify
- [ ] Added `VITE_ADMIN_EMAIL` to Netlify (with your actual email!)
- [ ] Clicked "Trigger deploy" → "Clear cache and deploy site"
- [ ] Waited for deployment to finish
- [ ] Tested the site - error is gone! ✅

---

## ⚠️ Common Mistakes

1. **Forgot to redeploy** - Adding variables alone isn't enough, you MUST redeploy!
2. **Wrong variable name** - Make sure it starts with `VITE_` (capital letters)
3. **Spaces in values** - No spaces before or after the values
4. **Wrong scope** - Make sure it's set to "Production" or "All scopes"
5. **Typo in email** - Make sure `VITE_ADMIN_EMAIL` matches your Firebase admin email exactly

---

## 📸 Where to Find Things in Netlify

- **Site configuration**: Click your site → "Site configuration" (top menu)
- **Environment variables**: Site configuration → "Environment variables" (left sidebar)
- **Deploys**: Click "Deploys" in the top menu
- **Trigger deploy**: Deploys page → "Trigger deploy" button (top right)

---

**After adding all variables and redeploying, your site should work perfectly!** 🎉












