# Environment Setup Guide

This document explains how to use and manage the different environments for the Stitch-It-Pretty-Fit application.

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
   - Uses the same backend API as local environment

3. **Local** (local development)
   - Environment for local development work
   - Runs on your local machine
   - URL: http://localhost:8080
   - Uses the same backend API as QA environment

## CI/CD Pipeline

Our CI/CD pipeline automatically detects which branch you're working on and deploys to the appropriate environment:

- Push to `main` → Production deployment
- Push to `qa` → QA deployment
- Pull requests → Preview deployments

## Environment Configuration

Each environment has its own configuration file:

- `.env.production` - Production settings
- `.env.qa` - QA environment settings
- `.env.local` - Local development settings (not committed to Git)

You should create a `.env.local` file based on the `.env.example` template for local development.

## Using the Environments

### Local Development

For local development:

```bash
# Start the development server
npm run dev

# Build for local testing
npm run build:local
```

### QA Environment

To deploy code to the QA environment:

1. Create a branch from `main` for your feature work
2. Complete development and testing on your feature branch
3. Create a pull request to merge your feature branch into the `qa` branch
4. After review, merge the PR to deploy to the QA environment

For manual QA deployment:

```bash
# Switch to the qa branch
git checkout qa

# Build for QA environment
npm run build:qa

# Deploy to QA channel
firebase hosting:channel:deploy qa
```

### Production Environment

To deploy to production:

1. After testing in QA, create a pull request from `qa` to `main`
2. After final review, merge the PR to deploy to production

For manual production deployment:

```bash
# Switch to the main branch
git checkout main

# Build for production
npm run build:production

# Deploy to production
firebase deploy
```

## Environment Detection in Code

You can detect which environment your code is running in using the utility functions in `src/utils/environment.ts`:

```typescript
import { isLocal, isQA, isProduction } from '../utils/environment';

// Example of environment-specific logic
if (isQA()) {
  // QA-specific code
} else if (isProduction()) {
  // Production-specific code
} else {
  // Local development code
}
```

## Environment-Specific Features

### QA Environment Features

- Feature flags enabled
- Debug information visible
- QA banner displayed
- Uses local backend API (http://localhost:3001)

### Production Environment Features

- Feature flags disabled
- No debug information
- Optimized for performance

### Local Environment Features

- Mock API enabled (when needed)
- All feature flags enabled
- Hot module reloading
- Uses local backend API (http://localhost:3001)

## Best Practices

1. Always test features in the QA environment before merging to production
2. Use feature flags for features that are still in development
3. Keep the QA environment as close to production as possible
4. Use environment-specific configuration for API endpoints and other variables
5. Don't commit sensitive information in environment files

## Environment URLs

- **Production:** https://tailor-app-71fe2.web.app (Frontend), Production API (Backend)
- **QA:** https://qa-tailor-app-71fe2.web.app (Frontend), http://localhost:3001 (Backend)
- **Local:** http://localhost:8080 (Frontend), http://localhost:3001 (Backend)
- **Firebase Console:** https://console.firebase.google.com/project/tailor-app-71fe2/hosting/sites
- **GitHub Actions:** https://github.com/nandhakv/stitch-it-pretty-fit/actions

## Troubleshooting

If you encounter issues with any environment:

1. Check the Firebase Hosting console for deployment status
2. Verify that the correct environment variables are being used
3. Check browser console for any JavaScript errors
4. Verify that the API endpoints are correctly configured and accessible
