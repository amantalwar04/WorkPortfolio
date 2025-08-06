# 🚀 Firebase Quick Setup Guide

## Error Fix: `auth/api-key-not-valid`

This error occurs because the app is using placeholder Firebase credentials. Follow these steps to fix it:

## 🎯 Quick Setup (5 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name: `portfolio-generator-[your-name]`
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication
1. In Firebase Console → "Authentication" 
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click "Google" → Enable → Save
5. Click "Email/Password" → Enable → Save

### Step 3: Get Web App Config
1. Click "Project Settings" (gear icon)
2. Scroll to "Your apps" → Click Web icon `</>`
3. App nickname: `portfolio-web-app`
4. Check "Firebase Hosting" (optional)
5. Click "Register app"
6. **COPY the config object** (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 4: Update Environment Variables
Create a `.env` file in your project root with your real config:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Step 5: Add Authorized Domains
1. In Firebase Console → Authentication → Settings → Authorized domains
2. Add: `amantalwar04.github.io`
3. Add: `localhost` (for development)

## 🎯 Alternative: Disable Firebase (Quick Fix)

If you want to use demo mode only: