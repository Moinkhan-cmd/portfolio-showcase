# 🔧 Fix Netlify Git Clone Error - Step-by-Step Guide

## Error: "Could not resolve host" - Git Clone Failure

Netlify cannot clone your GitHub repository during the build process. This is typically a connection/authorization issue.

---

## ✅ Solution Steps (Follow in Order)

### Step 1: Quick Retry (30 seconds) ⚡

**Often this is just a temporary network issue:**

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site (`portfolio-showcase`)
3. Go to **Deploys** tab
4. Click **"Trigger deploy"** → **"Deploy site"**
5. Wait for the build to complete

**If it works, you're done!** ✅  
**If it still fails, continue to Step 2.**

---

### Step 2: Verify Repository is Accessible (1 minute) 🔍

1. Open your repository in a browser:
   - https://github.com/Moinkhan-cmd/portfolio-showcase

2. **Check:**
   - ✅ Repository exists and loads correctly
   - ✅ You can see the code/files
   - ✅ Note if it's **Public** or **Private**

3. **If repository is not accessible:**
   - Check if it was deleted or renamed
   - Verify you have access to it
   - If it's private, ensure you're logged into the correct GitHub account

---

### Step 3: Check Netlify ↔ GitHub Connection (2 minutes) 🔗

1. **Go to Netlify Dashboard:**
   - https://app.netlify.com/
   - Select your site

2. **Navigate to:**
   - **Site settings** (or **Site configuration**)
   - **Build & deploy**
   - **Continuous Deployment**

3. **Verify these settings:**
   - ✅ **Repository**: Should show `Moinkhan-cmd/portfolio-showcase`
   - ✅ **Branch**: Should be `main` (or your default branch)
   - ✅ **Connection status**: Should show "Connected" or "Active"

4. **If repository is wrong or missing:**
   - Continue to Step 4

---

### Step 4: Reconnect GitHub Repository (3-5 minutes) 🔐

**This is the most common fix!**

#### Option A: If Repository is NOT Connected

1. In **Site settings** → **Build & deploy** → **Continuous Deployment**
2. Click **"Link repository"** or **"Connect to Git provider"**
3. Select **GitHub** (you may need to authorize Netlify)
4. Search for: `portfolio-showcase`
5. Select: `Moinkhan-cmd/portfolio-showcase`
6. Select branch: `main`
7. Click **"Save"** or **"Connect"**

#### Option B: If Repository IS Connected but Failing

1. In **Site settings** → **Build & deploy** → **Continuous Deployment**
2. Click **"Edit settings"** (or the pencil icon) next to the repository
3. Click **"Disconnect repository"** (or **"Unlink"**)
4. Confirm the disconnection
5. Click **"Link repository"** again
6. Select **GitHub** → Search for `portfolio-showcase`
7. Select: `Moinkhan-cmd/portfolio-showcase`
8. Select branch: `main`
9. Click **"Save"**

#### Option C: For Private Repositories

If your repository is **private**, you need to authorize Netlify:

1. When clicking **"Link repository"**, you'll see GitHub authorization
2. Click **"Authorize Netlify"** or **"Install Netlify GitHub App"**
3. Select the repository access:
   - **All repositories** (easier)
   - **Only select repositories** → Choose `portfolio-showcase`
4. Complete the GitHub authorization
5. Return to Netlify and link the repository

---

### Step 5: Trigger New Deploy (1 minute) 🚀

After reconnecting the repository:

1. Go to **Deploys** tab
2. Click **"Trigger deploy"**
3. Select **"Clear cache and deploy site"** (recommended)
4. Wait for the build to complete (2-3 minutes)

---

### Step 6: Check Service Status (If Still Failing) 📊

If the error persists, check for service outages:

1. **GitHub Status**: https://www.githubstatus.com
   - Check if GitHub shows any incidents
   
2. **Netlify Status**: https://www.netlify.com/status/
   - Check if Netlify shows any incidents

3. **If there's an outage:**
   - Wait 15-30 minutes
   - Try deploying again after the outage is resolved

---

### Step 7: Verify GitHub App Installation (For Organizations) 🛠️

If your repository is under a GitHub Organization:

1. Go to your GitHub Organization settings
2. Navigate to **Settings** → **Applications** → **Installed GitHub Apps**
3. Look for **Netlify**
4. Ensure it has access to your repository:
   - Click on **Netlify**
   - Check repository access
   - If missing, grant access or reinstall

---

## 🎯 Common Issues & Solutions

### Issue: "Repository not found"
**Solution**: Repository might be private or Netlify lost access. Reconnect in Step 4.

### Issue: "Permission denied"
**Solution**: Re-authorize Netlify GitHub App (Step 4, Option C).

### Issue: "Branch not found"
**Solution**: Check if your default branch is `main` or `master`. Update branch in Netlify settings.

### Issue: Repository was renamed
**Solution**: Update repository name in Netlify settings to match new name.

---

## 📝 Checklist

Before contacting support, verify:

- [ ] Repository is accessible in browser
- [ ] Repository is correctly linked in Netlify
- [ ] Netlify GitHub App is authorized (for private repos)
- [ ] Branch name is correct (`main` or `master`)
- [ ] Tried disconnecting and reconnecting repository
- [ ] Tried "Clear cache and deploy"
- [ ] Checked GitHub and Netlify status pages
- [ ] Waited 15 minutes and tried again (for transient issues)

---

## 🆘 Still Not Working?

If none of the above steps work:

1. **Gather information:**
   - Take a screenshot of Netlify deploy logs (showing the error)
   - Note the exact error message
   - Check which step you're stuck on

2. **Contact Netlify Support:**
   - Go to: https://www.netlify.com/support/
   - Provide the error logs and steps you've tried

3. **Alternative: Manual Deploy**
   - Build locally: `npm run build`
   - Drag and drop the `dist` folder to Netlify's deploy area
   - Note: This won't auto-deploy on Git pushes

---

## ✅ Success Indicators

You'll know it's fixed when:

- ✅ Build starts successfully (no clone error)
- ✅ You see "Building site" in the deploy log
- ✅ Build completes without errors
- ✅ Site deploys and is accessible

---

**Last Updated**: This guide covers the most common fixes for Netlify Git clone failures. If your specific error differs, refer to Netlify's official documentation or support.
