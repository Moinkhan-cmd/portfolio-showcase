# Firestore Admin Configuration Setup

This guide explains how to set up the admin configuration document required for the Firestore security rules to work correctly.

## Overview

The Firestore security rules use a configuration document at `/config/admin` to determine who has admin access. This document must be created manually as part of the initial setup.

## Required Setup Steps

### Step 1: Create the Config Document

You need to create a document in Firestore with the following structure:

- **Collection**: `config`
- **Document ID**: `admin`
- **Fields**:
  - `adminEmail` (string): Your admin email address

### Option A: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database**
4. Click **Start collection** (if no collections exist) or **Add collection**
5. Enter `config` as the Collection ID
6. Enter `admin` as the Document ID
7. Add a field:
   - Field name: `adminEmail`
   - Type: `string`
   - Value: Your admin email (e.g., `admin@example.com`)
8. Click **Save**

### Option B: Using Firebase Admin SDK (Recommended for Production)

Create a setup script (requires Node.js and Firebase Admin SDK):

```javascript
// scripts/setup-admin.js
const admin = require('firebase-admin');

// Initialize with your service account
admin.initializeApp({
  credential: admin.credential.cert('./service-account-key.json'),
});

const db = admin.firestore();

async function setupAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'your-admin@email.com';
  
  await db.collection('config').doc('admin').set({
    adminEmail: adminEmail,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  console.log(`Admin config created for: ${adminEmail}`);
}

setupAdmin().catch(console.error);
```

Run with:
```bash
ADMIN_EMAIL=your-admin@email.com node scripts/setup-admin.js
```

### Option C: Using Firebase Custom Claims (Most Secure)

For enhanced security, you can use Firebase Custom Claims instead of or in addition to the config document:

```javascript
// Set custom claims for admin user
const admin = require('firebase-admin');

async function setAdminClaims(uid) {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log(`Admin claims set for user: ${uid}`);
}

// Get user UID from email
async function setAdminByEmail(email) {
  const user = await admin.auth().getUserByEmail(email);
  await setAdminClaims(user.uid);
}

setAdminByEmail('your-admin@email.com').catch(console.error);
```

## Security Architecture

The admin authorization works in layers:

1. **Client-Side (UI Only)**: The `AuthContext` checks if the current user's email matches `VITE_ADMIN_EMAIL`. This only controls UI navigation and is NOT a security boundary.

2. **Server-Side (Firestore Rules)**: The actual security is enforced by Firestore rules which:
   - Check for Firebase Custom Claims (`request.auth.token.admin == true`)
   - Check the `/config/admin` document for matching email
   
   Even if an attacker bypasses the client-side check, they cannot read/write protected data without passing the server-side rules.

## Troubleshooting

### "Permission Denied" Errors

1. Verify the `/config/admin` document exists
2. Check the `adminEmail` field matches your login email exactly (case-sensitive)
3. Ensure you're logged in with the correct Firebase account

### Admin Cannot Access Data

1. Check Firestore rules are deployed correctly
2. Verify the config document structure matches expected format
3. Try refreshing your ID token by logging out and back in

### Circular Dependency Issue

If you can't create the config document because admin access is required:

1. Temporarily modify Firestore rules to allow initial setup:
   ```javascript
   match /config/{configId} {
     allow read, write: if isAuthenticated();  // TEMPORARY
   }
   ```
2. Create the config document
3. Restore the original rules:
   ```javascript
   match /config/{configId} {
     allow read: if true;
     allow write: if isAdmin();
   }
   ```

## Environment Variables

Make sure your `.env` file includes:

```
VITE_ADMIN_EMAIL=your-admin@email.com
```

This is used for the client-side UI check. The same email should be in the Firestore config document.
