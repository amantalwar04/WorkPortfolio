# Firebase Google Authentication Setup Guide

## Quick Start (Demo Mode)
The application will work in demo mode without Firebase setup, but for real Google authentication, follow these steps:

## 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name (e.g., "portfolio-generator")
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Google Authentication
1. In Firebase Console, go to "Authentication" > "Sign-in method"
2. Click on "Google" provider
3. Click "Enable"
4. Add your email to "Authorized domains" 
5. Add your production domain (e.g., `amantalwar04.github.io`)
6. Save

## 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon to add web app
4. Register app name
5. Copy the config object

## 4. Set Environment Variables
Create a `.env` file in the project root with your Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## 5. Test Authentication
1. Restart your development server
2. Try Google sign-in
3. Check browser console for any errors

## Features Enabled
With proper Firebase setup, Google sign-in will provide:
- ✅ Real Google profile data (name, email, photo)
- ✅ User verification status
- ✅ Persistent authentication state
- ✅ Secure sign-out
- ✅ Additional profile fields (first/last name, locale)

## Demo Mode
Without Firebase setup, the app uses demo data:
- Demo email: demo@gmail.com
- Demo name: Demo User
- Mock profile photo
- Local storage persistence