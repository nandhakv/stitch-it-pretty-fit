# QA Environment Setup Guide

This document explains how to use and manage the QA environment for the Stitch-It-Pretty-Fit application.

## Overview

The QA environment is a separate deployment channel that allows testing of new features in an environment that closely resembles production, but without affecting end users. Our setup uses Firebase Hosting channels to maintain separate environments (production, QA, development) within the same Firebase project.

## Environment Structure

Our application supports three environments:

1. **Production** (`main` branch)
   - Live user-facing environment
   - Deployed to the `live` channel on Firebase Hosting
   - URL: https://tailor-app-71fe2.web.app

2. **QA** (`qa` branch)
   - Testing environment for features ready for QA
   - Deployed to the `qa` channel on Firebase Hosting
   - URL: https://qa-tailor-app-71fe2.web.app

3. **Development** (`dev` branch)
   - Environment for ongoing development work
   - Deployed to the `dev` channel on Firebase Hosting
   - URL: https://dev-tailor-app-71fe2.web.app

## How It Works

Our CI/CD pipeline automatically detects which branch you're working on and deploys to the appropriate environment:

- Push to `main` → Production deployment
- Push to `qa` → QA deployment
- Push to `dev` → Development deployment
- Pull requests → Preview deployments

## Using the QA Environment

### Deploying to QA

To deploy code to the QA environment:

1. Create a branch from `main` for your feature work
2. Complete development and testing on your feature branch
3. Create a pull request to merge your feature branch into the `qa` branch
4. After review, merge the PR to deploy to the QA environment

### Manual QA Deployment

If you need to manually deploy to QA:

```bash
# Switch to the qa branch
git checkout qa

# Build for QA environment
npm run build:qa

# Deploy to QA channel
firebase hosting:channel:deploy qa
```

### Testing in QA

1. Access the QA environment at: https://qa-tailor-app-71fe2.web.app
2. Verify that your features work as expected
3. Report any issues in the issue tracker with the "QA" label

## Environment-specific Configuration

Each environment has its own configuration file:

- `.env.production` - Production settings
- `.env.qa` - QA environment settings
- `.env.development` - Development settings

These files contain environment-specific variables like API endpoints and feature flags.

## Using Environment Variables in Code

You can detect which environment your code is running in using the utility functions in `src/utils/environment.ts`:

```typescript
import { isQA, isProduction, isDevelopment } from '../utils/environment';

// Example of environment-specific logic
if (isQA()) {
  // QA-specific code
} else if (isProduction()) {
  // Production-specific code
} else {
  // Development-specific code
}
```

## Feature Flags

The QA environment has feature flags enabled, allowing you to test features that aren't ready for production:

```typescript
import { areFeatureFlagsEnabled } from '../utils/environment';

if (areFeatureFlagsEnabled() && someSpecificFlag) {
  // Show new feature
}
```

## Promoting QA to Production

Once testing is complete in the QA environment:

1. Create a pull request from `qa` to `main`
2. After final review, merge the PR to deploy to production

## Troubleshooting

If you encounter issues with the QA environment:

1. Check the Firebase Hosting console for deployment status
2. Verify that the correct environment variables are being used
3. Check browser console for any JavaScript errors
4. Verify that the API endpoints for QA are correctly configured and accessible

## Best Practices

1. Always test features in the QA environment before merging to production
2. Use feature flags for features that are still in development
3. Keep the QA environment as close to production as possible
4. Document any environment-specific configurations or behaviors

## QA Environment URLs

- **Application:** https://qa-tailor-app-71fe2.web.app
- **Firebase Console:** https://console.firebase.google.com/project/tailor-app-71fe2/hosting/sites
- **GitHub Actions:** https://github.com/nandhakv/stitch-it-pretty-fit/actions
