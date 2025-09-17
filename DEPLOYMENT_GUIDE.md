# 🚀 Wedding Gallery Deployment Guide

This guide will help you deploy your wedding photo gallery to Firebase with full backend functionality.

## 📋 Prerequisites

- Node.js installed (v18 or higher)
- A Google account
- Firebase CLI installed (already done)

## 🔧 Step 1: Create Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Enter project name**: `danial-syahirah-wedding` (or your choice)
4. **Disable Google Analytics** (optional for wedding gallery)
5. **Click "Create project"**

## 🔑 Step 2: Get Firebase Configuration

1. **In Firebase Console, click the gear icon** → Project Settings
2. **Scroll down to "Your apps"**
3. **Click the web icon** `</>`
4. **Register your app**: Enter "Wedding Gallery" as nickname
5. **Copy the configuration object** - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 📝 Step 3: Create Environment File

Create a `.env.local` file in your project root:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🔥 Step 4: Enable Firebase Services

### Enable Firestore Database
1. **In Firebase Console** → Build → Firestore Database
2. **Click "Create database"**
3. **Choose "Start in test mode"** (we'll deploy security rules later)
4. **Select location** closest to your wedding location

### Enable Storage
1. **In Firebase Console** → Build → Storage
2. **Click "Get started"**
3. **Choose "Start in test mode"**
4. **Select same location** as Firestore

### Enable Hosting
1. **In Firebase Console** → Build → Hosting
2. **Click "Get started"**
3. **Follow the setup steps** (we'll handle this via CLI)

## 🚀 Step 5: Deploy Your App

### Login to Firebase
```bash
npm run firebase:login
```

### Initialize Firebase in your project
```bash
npm run firebase:init
```

**Select these options:**
- ✅ Firestore: Configure security rules and indexes
- ✅ Storage: Configure security rules  
- ✅ Hosting: Configure files for Firebase Hosting
- **Use existing project**: Select your wedding project
- **Firestore rules file**: `firestore.rules` (already created)
- **Firestore indexes file**: `firestore.indexes.json` (already created)
- **Storage rules file**: `storage.rules` (already created)
- **Public directory**: `dist`
- **Configure as SPA**: Yes
- **Automatic builds**: No

### Deploy everything
```bash
npm run deploy
```

This will:
1. Build your React app
2. Deploy hosting, database rules, and storage rules
3. Give you a live URL!

## 📱 Step 6: Mobile Optimization Features

Your app is now mobile-optimized with:

### 🔄 **Large File Upload Support**
- **50MB file size limit** per photo
- **Progress tracking** during uploads
- **Resumable uploads** (Firebase handles this automatically)
- **Compression recommendations** for mobile users

### 📱 **Mobile-Friendly Features**
- **Responsive design** works on all screen sizes
- **Touch-friendly** interface with proper tap targets
- **Fast loading** with image optimization
- **Offline support** (Firebase provides caching)

### ⚡ **Performance Optimizations**
- **CDN delivery** for all images worldwide
- **Automatic image optimization** by Firebase
- **Lazy loading** for gallery images
- **Infinite scroll** for large photo collections

## 🔒 Step 7: Security Features

### **Database Security**
- ✅ Public read access for wedding guests
- ✅ Validated writes with size limits
- ✅ No unauthorized deletions/updates

### **Storage Security**  
- ✅ 50MB file size limit
- ✅ Image file type validation
- ✅ Public read access for sharing

## 🎯 Step 8: Share Your Gallery

After deployment, you'll get a URL like:
```
https://your-project-id.web.app
```

**Share this URL with your wedding guests!**

## 📊 Step 9: Monitor Usage

### **Firebase Console Analytics**
- **Storage usage**: Monitor photo storage
- **Database reads/writes**: Track guest activity  
- **Hosting bandwidth**: See traffic stats

### **Useful Commands**
```bash
# Deploy only hosting (after code changes)
npm run deploy:hosting

# Deploy only database/storage rules
npm run deploy:rules

# View logs
firebase functions:log
```

## 🛠️ Troubleshooting

### **Common Issues:**

1. **"Permission denied" errors**
   - Check your `.env.local` file has correct Firebase config
   - Ensure Firebase services are enabled in console

2. **Large uploads failing**
   - Check file size (50MB limit)
   - Verify stable internet connection
   - Try uploading fewer photos at once

3. **Photos not appearing**
   - Check browser console for errors
   - Verify Firestore security rules are deployed
   - Ensure Storage is properly configured

### **Get Help:**
- Check Firebase Console for error logs
- Verify all environment variables are set
- Test with small files first

## 🎉 You're Live!

Your wedding gallery is now:
- ✅ **Hosted on Firebase** with global CDN
- ✅ **Mobile-optimized** for all devices  
- ✅ **Handling large uploads** up to 50MB
- ✅ **Real-time updates** when guests add photos
- ✅ **Secure and scalable** for your big day

**Congratulations! Your guests can now share their beautiful wedding memories! 💕📸** 