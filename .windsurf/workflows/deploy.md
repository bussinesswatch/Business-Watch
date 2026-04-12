---
description: How to deploy the Business Watch application to production
tags: [deployment, vercel, github]
---

# Deploy Business Watch Application

## Prerequisites
- GitHub repository access
- Vercel project connected to GitHub repo
- All code changes committed and pushed

## Deployment Steps

### 1. Commit and Push Changes
```bash
git add .
git commit -m "feat: describe your changes"
git push origin main
```

### 2. Verify Build (Local - Optional)
```bash
npm run build
```
// turbo

### 3. Monitor Vercel Deployment
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the Business Watch project
3. Watch the deployment progress
4. Check for any build errors

### 4. Verify Deployment
1. Visit the production URL: `https://businesswatch.vercel.app`
2. Test the specific features you changed
3. Check browser console for errors

## Troubleshooting

### Build Failures
- Check for JSX syntax errors (unescaped `<` characters)
- Verify all imports are correct
- Ensure no unused variables

### Environment Variables
- Verify all env vars are set in Vercel project settings
- Required vars: Firebase config, API keys

### Rollback
If needed, rollback to previous deployment in Vercel dashboard under "Deployments" tab.
