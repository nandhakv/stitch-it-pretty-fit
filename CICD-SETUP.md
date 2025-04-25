# CI/CD Pipeline for Firebase Hosting

This document explains how to use the CI/CD pipeline set up for deploying the Stitch-It-Pretty-Fit app to Firebase Hosting.

## Setup Overview

The CI/CD pipeline uses GitHub Actions to automatically build and deploy your application to Firebase Hosting whenever changes are pushed to the main branch.

## How It Works

1. When you push code to the main branch, GitHub Actions will automatically:
   - Check out your code
   - Install dependencies
   - Build the application
   - Deploy to Firebase Hosting

2. Pull requests to the main branch will create preview deployments, allowing you to test changes before merging.

## Required GitHub Secrets

For the CI/CD pipeline to work, you need to set up the following secrets in your GitHub repository:

1. `FIREBASE_SERVICE_ACCOUNT`: A Firebase service account token for deployment
2. Environment variables for Firebase configuration:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`

## Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add each of the required secrets listed above

## Getting a Firebase Service Account Token

To get the `FIREBASE_SERVICE_ACCOUNT` value:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save the JSON file
6. Encode the entire JSON file content as a base64 string:
   ```
   cat path/to/your-service-account.json | base64
   ```
7. Copy the output and paste it as the value for the `FIREBASE_SERVICE_ACCOUNT` secret

## Local Development

For local development, create a `.env.local` file based on the `.env.example` template and fill in your Firebase configuration values.

## Manual Deployment

If you need to deploy manually:

1. Install Firebase CLI (if not already installed):
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Build your application:
   ```
   npm run build
   ```

4. Deploy to Firebase:
   ```
   firebase deploy
   ```

## Troubleshooting

If deployments fail, check:

1. GitHub Actions logs for specific error messages
2. Ensure all required secrets are correctly set up
3. Verify that your Firebase project has Hosting enabled
4. Check that your build process completes successfully
