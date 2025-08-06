# Firebase Authentication Setup Checklist

## ✅ Firebase Console Configuration

### 1. Enable Authentication Methods
In your Firebase Console:

1. **Go to Authentication → Sign-in method**
2. **Enable Google Provider:**
   - Click "Google" 
   - Toggle "Enable"
   - The email will auto-fill from your Google account
   - Click "Save"

3. **Enable Email/Password Provider:**
   - Click "Email/Password"
   - Toggle "Enable" 
   - Click "Save"

### 2. Add Authorized Domains
In Firebase Console → Authentication → Settings → Authorized domains:

**Add these domains:**
- `localhost` (for development)
- `amantalwar04.github.io` (for your deployed app)

### 3. Web App Configuration
Make sure you have:
- ✅ Created a web app in Firebase Console
- ✅ Copied the config object
- ✅ Added config to .env.local file

## 🔧 Environment File Format

Your `.env.local` should look like this:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

## 🚀 Testing Steps

After setup:
1. Restart your development server
2. Check browser console for "Firebase initialized successfully"
3. Try Google sign-in
4. Check for any error messages

## 🔍 Troubleshooting

**Common Issues:**
- **API Key Error:** Double-check the API key is copied correctly
- **Domain Error:** Make sure your domain is in authorized domains
- **Permission Error:** Ensure Google auth is enabled in Firebase Console