# Netlify Deployment Troubleshooting Guide

## Issue: Git Clone Failure - "Could not resolve host"

This error occurs when Netlify cannot access your GitHub repository during the build process.

### Error Symptoms
```
Failed during stage 'preparing repo': fatal: unable to access 
'https://github.com/Moinkhan-cmd/portfolio-showcase/': Could not resolve host
```

### Quick Fix Steps (Try in Order)

#### 1. **Retry the Deployment** ⚡
- Go to Netlify Dashboard → Your Site → Deploys
- Click "Trigger deploy" → "Deploy site"
- Many DNS/network issues are transient and resolve on retry

#### 2. **Verify Repository Accessibility** 🔍
- Open your repo in browser: https://github.com/Moinkhan-cmd/portfolio-showcase
- Confirm the repository exists and is accessible
- Check if the repository is **public** or **private**

#### 3. **Check Netlify ↔ GitHub Connection** 🔗
1. Go to Netlify Dashboard → Your Site
2. Navigate to **Site settings** → **Build & deploy** → **Continuous Deployment**
3. Verify:
   - Repository is correctly linked: `Moinkhan-cmd/portfolio-showcase`
   - Connection status shows as "Connected" or "Active"
   - Branch is set to `main` (or your default branch)

#### 4. **Reconnect Git Provider** (If Private Repo or Permissions Changed) 🔐
If your repo is **private** or you changed GitHub permissions:

1. In Netlify: **Site settings** → **Build & deploy** → **Continuous Deployment**
2. Click **"Edit settings"** next to the repository
3. Click **"Link repository"** or **"Disconnect"** then reconnect
4. Re-authorize Netlify GitHub App if prompted
5. Select your repository: `Moinkhan-cmd/portfolio-showcase`
6. Select branch: `main`
7. Save and trigger a new deploy

#### 5. **Check Service Status** 📊
- **GitHub Status**: https://www.githubstatus.com
- **Netlify Status**: https://www.netlify.com/status/
- If either service shows outages, wait for resolution

#### 6. **Verify GitHub App Installation** (For Private Repos) 🛠️
If your repository is private:

1. Go to GitHub → **Settings** → **Applications** → **Installed GitHub Apps**
2. Find **Netlify** in the list
3. Ensure it has access to your repository
4. If missing, install/re-authorize the Netlify GitHub App

### Common Causes

| Cause | Solution |
|-------|----------|
| Temporary DNS/network outage | Retry deployment (Step 1) |
| Repository made private | Reconnect Git provider (Step 4) |
| Netlify lost GitHub authorization | Re-authorize Netlify app (Step 4) |
| Incorrect repository URL | Update in Netlify settings (Step 3) |
| GitHub service outage | Check status page (Step 5) |

### Verification Checklist

After following the steps above, verify:

- [ ] Repository is accessible in browser
- [ ] Netlify shows repository as "Connected"
- [ ] Branch name matches your default branch (`main`)
- [ ] If private repo: Netlify GitHub App is installed and authorized
- [ ] New deployment triggered successfully
- [ ] Build log shows successful Git clone (no "Could not resolve host" error)

### If Problem Persists

1. **Gather fresh build log** from Netlify
2. **Contact Netlify Support** with:
   - Site name/URL
   - Build log showing clone failure
   - Steps you've already tried
   - Repository visibility (public/private)

### Notes

- This is a **network/connectivity issue**, not a code problem
- Your `netlify.toml` configuration is correct
- Changing Node versions won't fix this issue
- The error occurs **before** the build starts, so build configuration is not the problem

---

**Last Updated**: Based on error from deployment attempt



