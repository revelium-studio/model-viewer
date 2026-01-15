# Vercel Environment Variables Setup

## ✅ Deployment Complete!

Your app has been deployed to Vercel:
- **Production URL**: https://model-viewer-bo28bp19p-revelium-studios.vercel.app
- **Inspect**: https://vercel.com/revelium-studios/model-viewer/9dC1oFvSEP4HWawrMqn5G8PGnYXx

## 🔑 Add Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables (select **Production**, **Preview**, and **Development** for each):

### fal.ai API Key (Required)
```
Name: FAL_KEY
Value: a18e4a98-229e-4a28-8491-fca0293cc8d8:20d319ace603ec4fcadac80b4fdc4d1e
```

### Cloudflare R2 Configuration (Optional - for permanent storage)
```
Name: R2_ACCOUNT_ID
Value: 1b1c80d1a786cfe7cbcd54b2f109390a

Name: R2_ACCESS_KEY_ID
Value: 6d7304c75493d023923c290a9480d328

Name: R2_SECRET_ACCESS_KEY
Value: 23381655a9a95d8349696e5fffce6af4d83f52d2afcf95d25c31e7ddecb4ac1e

Name: R2_BUCKET_NAME
Value: model-viewer

Name: R2_ENDPOINT
Value: https://1b1c80d1a786cfe7cbcd54b2f109390a.r2.cloudflarestorage.com

Name: R2_PUBLIC_BASE_URL
Value: https://pub-4799e35d13ec4295845e692b32aee7b7.r2.dev
```

## 📋 Steps to Add Variables

1. Go to: https://vercel.com/revelium-studios/model-viewer/settings/environment-variables
2. Click "Add New"
3. Enter the **Name** and **Value** for each variable above
4. Select environments: ✅ Production, ✅ Preview, ✅ Development
5. Click "Save"
6. **Important**: After adding all variables, go to **Deployments** tab
7. Click the three dots (⋯) on the latest deployment
8. Select **"Redeploy"** to apply the new environment variables

## ✅ Verification

After redeploying with environment variables:

1. Visit your production URL
2. Try uploading an image
3. Check browser console for any errors
4. Check Vercel Function logs if issues occur

## 🔍 Troubleshooting

### "fetch failed" Error
- Verify `FAL_KEY` is set correctly
- Check fal.ai account has credits
- Review Vercel Function logs

### Model Not Generating
- Check fal.ai dashboard for job status
- Verify API key is valid
- Check Vercel Function logs for detailed errors

### R2 Upload Fails
- Verify all R2 variables are set
- Check R2 bucket permissions (public read)
- Models will fallback to fal.ai URLs if R2 fails

## 📚 Resources

- **Vercel Dashboard**: https://vercel.com/revelium-studios/model-viewer
- **fal.ai Dashboard**: https://fal.ai/dashboard
- **Cloudflare R2**: https://dash.cloudflare.com

---

**Status**: ✅ Deployed - Add environment variables and redeploy
