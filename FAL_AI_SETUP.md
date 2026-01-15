# fal.ai Setup Guide

This app uses **fal.ai** as a middleman to access Hyper3D/Rodin v2 API, which is more cost-effective than a direct Hyper3D business account.

## Why fal.ai?

- ✅ No expensive business account required
- ✅ Pay-as-you-go pricing
- ✅ Easy API integration
- ✅ Automatic file handling and storage
- ✅ Queue management for long-running jobs

## Step 1: Get fal.ai API Key

1. **Sign up for fal.ai**:
   - Go to https://fal.ai
   - Click "Sign up" or "Log in"
   - Create an account (free tier available)

2. **Get your API Key**:
   - Go to your dashboard: https://fal.ai/dashboard
   - Navigate to "API Keys" or "Settings"
   - Copy your API key (starts with something like `fal-...`)

## Step 2: Set Environment Variable

### For Local Development

Create or update `.env.local`:

```env
FAL_KEY=your_fal_ai_api_key_here
```

### For Vercel Deployment

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name**: `FAL_KEY`
   - **Value**: Your fal.ai API key
   - **Environment**: Production, Preview, Development (select all)
3. Click "Save"
4. **Redeploy** your project

## Step 3: Verify Setup

After setting the environment variable:

1. **Restart your local dev server** (if running locally):
   ```bash
   npm run dev
   ```

2. **Test the API**:
   - Upload an image in the app
   - Check the browser console for any errors
   - Check Vercel Function logs if deployed

## How It Works

1. **Image Upload**: User uploads an image
2. **fal.ai Storage**: Image is automatically uploaded to fal.ai storage
3. **Job Submission**: Job is submitted to `fal-ai/hyper3d/rodin/v2` model
4. **Queue Polling**: App polls job status until completion
5. **Model Download**: When complete, model is downloaded from fal.ai
6. **R2 Upload**: Model is uploaded to Cloudflare R2 for permanent storage
7. **Display**: Model is shown in the 3D viewer

## API Model Details

- **Model**: `fal-ai/hyper3d/rodin/v2`
- **Input**: Image URL (automatically uploaded)
- **Output**: GLB file with textures
- **Format**: GLB (default)
- **Quality**: 500K Triangle (high quality)

## Pricing

fal.ai uses a pay-as-you-go model:
- Check current pricing at: https://fal.ai/pricing
- Monitor usage in your dashboard: https://fal.ai/dashboard

## Troubleshooting

### "FAL_KEY is not set" Error

- Verify environment variable is set correctly
- For Vercel: Ensure variable is added and project is redeployed
- For local: Check `.env.local` file exists and has correct format

### "fal.ai API error" Messages

- Verify your API key is correct
- Check your fal.ai account has credits/balance
- Review fal.ai dashboard for any account issues

### Job Status Not Updating

- fal.ai jobs can take several minutes
- Check Vercel Function logs for detailed errors
- Verify network connectivity

## Resources

- **fal.ai Documentation**: https://fal.ai/docs
- **Hyper3D/Rodin Model**: https://fal.ai/models/fal-ai/hyper3d/rodin/v2
- **API Reference**: https://fal.ai/models/fal-ai/hyper3d/rodin/v2/api
