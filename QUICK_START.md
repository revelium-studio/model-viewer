# Quick Start Guide

## Fix "fetch failed" Error

The "fetch failed" error typically occurs when:
1. Environment variables are not set
2. API credentials are invalid
3. Network connectivity issues

### Immediate Fix:

1. **Check Environment Variables**:
   - Create `.env.local` file in the root directory
   - Add all required variables (see README.md)

2. **For Local Development**:
   ```bash
   npm install
   npm run dev
   ```

3. **For Vercel Deployment**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required environment variables
   - Redeploy the project

## Push to GitHub

### Quick Method:

```bash
# Run the setup script
./scripts/setup-github.sh

# Then push
git push -u origin main
```

### Manual Method:

```bash
# Initialize git
git init

# Add remote
git remote add origin https://github.com/revelium-studio/model-viewer.git

# Add and commit files
git add .
git commit -m "Initial commit: 3D Model Generator"

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: You'll need to authenticate with GitHub. Use:
- Personal Access Token (recommended)
- SSH keys
- GitHub CLI

## Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Sign in / Sign up
3. Click "Add New..." → "Project"
4. Import from GitHub: `revelium-studio/model-viewer`
5. Configure:
   - Framework: Next.js
   - Root Directory: `./`
6. **Add Environment Variables** (IMPORTANT!):
   - Go to Settings → Environment Variables
   - Add all variables from your `.env.local`
7. Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Then add environment variables via CLI or Dashboard.

## Required Environment Variables

Make sure these are set in Vercel:

```
HYPER3D_API_KEY=your_key_here
HYPER3D_API_BASE_URL=https://api.hyper3d.ai
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
R2_PUBLIC_BASE_URL=https://your-custom-domain.com
```

## Verify Deployment

1. Check Vercel Dashboard → Deployments (should show ✅)
2. Visit your deployment URL
3. Try uploading an image
4. Check browser console for errors
5. Check Vercel Function logs if errors occur

## Troubleshooting

### "fetch failed" persists:

1. **Check Vercel Function Logs**:
   - Dashboard → Project → Functions → View logs
   - Look for specific error messages

2. **Verify API Credentials**:
   - Test Hyper3D API key separately
   - Verify API endpoint URL is correct

3. **Check Network**:
   - Ensure Vercel can reach the API endpoint
   - Check if API requires IP whitelisting

4. **Environment Variables**:
   - Ensure all variables are set for Production environment
   - Redeploy after adding variables

### Build Fails:

1. Check build logs in Vercel
2. Ensure all dependencies are in `package.json`
3. Run `npm install` locally to verify

### Model Not Loading:

1. Check R2 bucket permissions (public read)
2. Verify `R2_PUBLIC_BASE_URL` is correct
3. Check CORS settings on R2 bucket

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Vercel
3. ✅ Set environment variables
4. ✅ Test the application
5. ✅ Monitor logs for any issues

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
