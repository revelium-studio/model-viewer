# Deployment Guide

This guide will help you deploy the 3D Model Generator to GitHub and Vercel.

## Step 1: Push to GitHub

### Option A: Using Git CLI (Recommended)

1. **Initialize Git repository** (if not already initialized):
   ```bash
   git init
   ```

2. **Add all files**:
   ```bash
   git add .
   ```

3. **Create initial commit**:
   ```bash
   git commit -m "Initial commit: 3D Model Generator"
   ```

4. **Add remote repository**:
   ```bash
   git remote add origin https://github.com/revelium-studio/model-viewer.git
   ```

5. **Push to GitHub**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

   If you encounter authentication issues, you may need to:
   - Use a Personal Access Token instead of password
   - Or set up SSH keys

### Option B: Using GitHub CLI

If you have GitHub CLI installed:

```bash
gh repo create revelium-studio/model-viewer --public --source=. --remote=origin --push
```

### Option C: Manual Upload

1. Go to https://github.com/revelium-studio/model-viewer
2. Click "uploading an existing file"
3. Drag and drop all project files
4. Commit the changes

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

   When prompted:
   - Link to existing project? **No** (first time) or **Yes** (subsequent deployments)
   - Project name: **model-viewer**
   - Directory: **./** (current directory)
   - Override settings? **No**

4. **Set environment variables** (see Step 3 below)

### Option B: Using Vercel Dashboard

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com
   - Sign in with your account

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import from GitHub: Select `revelium-studio/model-viewer`
   - Click "Import"

3. **Configure Project**:
   - Framework Preset: **Next.js**
   - Root Directory: **./** (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Set Environment Variables** (see Step 3 below)

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

## Step 3: Configure Environment Variables

### In Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**

2. Add the following variables:

   ```
   HYPER3D_API_KEY=your_hyper3d_api_key_here
   HYPER3D_API_BASE_URL=https://api.hyper3d.ai
   R2_ACCOUNT_ID=your_r2_account_id
   R2_ACCESS_KEY_ID=your_r2_access_key_id
   R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
   R2_BUCKET_NAME=your_bucket_name
   R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
   R2_PUBLIC_BASE_URL=https://your-custom-domain.com
   ```

3. **Important**: 
   - Set each variable for **Production**, **Preview**, and **Development** environments
   - Click "Save" after adding each variable

4. **Redeploy** after adding environment variables:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Select "Redeploy"

### Using Vercel CLI:

```bash
vercel env add HYPER3D_API_KEY
vercel env add HYPER3D_API_BASE_URL
vercel env add R2_ACCOUNT_ID
vercel env add R2_ACCESS_KEY_ID
vercel env add R2_SECRET_ACCESS_KEY
vercel env add R2_BUCKET_NAME
vercel env add R2_ENDPOINT
vercel env add R2_PUBLIC_BASE_URL
```

For each variable, select the environments (Production, Preview, Development).

## Step 4: Verify Deployment

1. **Check deployment status**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Ensure deployment is successful (green checkmark)

2. **Test the application**:
   - Visit your Vercel deployment URL
   - Try uploading an image
   - Check browser console for any errors

3. **Check logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Check API route logs for any errors

## Troubleshooting

### "fetch failed" Error

This usually means:
1. **Missing environment variables** - Check Vercel environment variables are set
2. **Invalid API credentials** - Verify your Hyper3D API key is correct
3. **Network issues** - Check if the API endpoint is accessible

**To debug**:
1. Check Vercel Function logs: Dashboard → Project → Functions → View logs
2. Check browser console for detailed error messages
3. Verify environment variables are set correctly

### Build Errors

If you encounter build errors:
1. Check the build logs in Vercel Dashboard
2. Ensure all dependencies are in `package.json`
3. Run `npm install` locally to verify dependencies

### API Errors

If Hyper3D API calls fail:
1. Verify `HYPER3D_API_KEY` is set correctly
2. Check `HYPER3D_API_BASE_URL` matches your API provider's endpoint
3. Test API credentials using curl or Postman

## Continuous Deployment

Once connected to GitHub, Vercel will automatically deploy:
- **Production**: On push to `main` branch
- **Preview**: On push to other branches or pull requests

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `R2_PUBLIC_BASE_URL` if using a custom domain for R2

## Support

For issues:
- Check Vercel documentation: https://vercel.com/docs
- Check Next.js documentation: https://nextjs.org/docs
- Review project README.md for setup instructions
