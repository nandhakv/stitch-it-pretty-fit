# Firebase Phone Authentication Setup Guide

This guide will help you set up Firebase Phone Authentication properly for both development and production environments.

## Prerequisites

1. A Firebase project (you already have one: tailor-app-71fe2)
2. Admin access to the Firebase Console

## Step 1: Enable Phone Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (tailor-app-71fe2)
3. Navigate to **Authentication** → **Sign-in methods**
4. Find "Phone" in the list and click on it
5. Toggle the switch to **Enable**
6. Save the changes

## Step 2: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings**
2. Under "Authorized domains", add:
   - `localhost`
   - Any other domains where you'll deploy your app

## Step 3: Set Up Test Phone Numbers

For development testing:

1. In Firebase Console, go to **Authentication** → **Phone**
2. Add your phone number to the test phone numbers list
3. This will allow you to receive verification codes during development without incurring charges

## Step 4: Create a New Web App in Firebase

The reCAPTCHA issues you're experiencing might be due to using an incorrect or outdated Firebase configuration.

1. In Firebase Console, go to **Project Overview**
2. Click "Add app" and select the Web platform (</> icon)
3. Register the app with a name like "Stitch-It-Pretty-Fit Web"
4. Copy the provided Firebase configuration (apiKey, authDomain, etc.)
5. Replace your current Firebase configuration in `firebase.ts` with this new one

## Step 5: Set Up reCAPTCHA Verification

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create a new reCAPTCHA v2 site
3. Add both `localhost` and your production domains to the list of allowed domains
4. Get the Site Key and Secret Key
5. In your Firebase project settings, add the reCAPTCHA keys

## Step 6: Update Firebase Security Rules

1. In Firebase Console, go to **Authentication** → **Usage and billing**
2. Make sure you have a billing account set up (required for Phone Authentication)
3. Set appropriate quotas to avoid unexpected charges

## Troubleshooting

If you continue to experience issues with Phone Authentication in development:

1. **Use Firebase Local Emulator**: Set up the Firebase Local Emulator Suite for testing authentication locally
2. **Deploy to Firebase Hosting**: Even a temporary deployment can help test if the issue is specific to localhost
3. **Check Browser Console**: Look for specific error messages beyond the ones you've already seen
4. **Verify API Key**: Ensure your Firebase API key is not restricted by API restrictions in Google Cloud Console

## Alternative Authentication Methods

If Phone Authentication proves difficult to set up in development:

1. **Email/Password Authentication**: Easier to set up and test locally
2. **Google Authentication**: Works well in development environments
3. **Anonymous Authentication**: For testing user flows without real authentication

## Production Considerations

Before deploying to production:

1. Set up proper Firebase Security Rules
2. Configure proper error handling for authentication failures
3. Implement rate limiting to prevent abuse
4. Set up monitoring for authentication attempts
