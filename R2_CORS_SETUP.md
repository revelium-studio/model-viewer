# Fix R2 CORS Issue - "Failed to fetch" Error

## Problem
The GLB file is uploaded to R2 successfully, but the browser can't load it due to CORS (Cross-Origin Resource Sharing) restrictions.

## Solution

You need to configure CORS on your Cloudflare R2 bucket to allow your Vercel domain to access the files.

### Step 1: Configure CORS in Cloudflare R2

1. **Go to Cloudflare Dashboard**:
   - Visit: https://dash.cloudflare.com
   - Navigate to **R2** → Your bucket (`model-viewer`)

2. **Set up CORS**:
   - Click on your bucket name
   - Go to **Settings** tab
   - Scroll to **CORS Policy** section
   - Click **"Edit CORS Policy"** or **"Add CORS Policy"**

3. **Add CORS Configuration**:

   Use this JSON configuration:

   ```json
   [
     {
       "AllowedOrigins": [
         "*"
       ],
       "AllowedMethods": [
         "GET",
         "HEAD"
       ],
       "AllowedHeaders": [
         "*"
       ],
       "ExposeHeaders": [
         "ETag",
         "Content-Length",
         "Content-Type"
       ],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

   **OR** for more security (only allow your Vercel domain):

   ```json
   [
     {
       "AllowedOrigins": [
         "https://model-viewer-*.vercel.app",
         "https://*.vercel.app",
         "https://revelium-studios.vercel.app"
       ],
       "AllowedMethods": [
         "GET",
         "HEAD"
       ],
       "AllowedHeaders": [
         "*"
       ],
       "ExposeHeaders": [
         "ETag",
         "Content-Length",
         "Content-Type"
       ],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

4. **Save the CORS policy**

### Step 2: Verify Public Access

1. **Check Bucket Settings**:
   - In your R2 bucket settings
   - Ensure **Public Access** is enabled
   - Or verify your custom domain (`pub-4799e35d13ec4295845e692b32aee7b7.r2.dev`) is configured

2. **Test the URL**:
   - Try accessing a file directly: `https://pub-4799e35d13ec4295845e692b32aee7b7.r2.dev/models/[your-file].glb`
   - Should return the file, not an error

### Step 3: Alternative - Use Custom Domain

If you have a custom domain for R2:

1. **Configure Custom Domain** in R2 settings
2. Update `R2_PUBLIC_BASE_URL` in Vercel to use your custom domain
3. Custom domains often have better CORS support

## Quick Fix: Fallback to fal.ai URL

The code has been updated to automatically fallback to fal.ai URLs if R2 fails. However, R2 is preferred for permanent storage.

## Verify Fix

After configuring CORS:

1. **Clear browser cache** (or use incognito mode)
2. **Try uploading a new image**
3. **Check browser console** - should not see CORS errors
4. **Model should load** in the 3D viewer

## Troubleshooting

### Still getting CORS errors?

1. **Check CORS policy is saved** in Cloudflare R2
2. **Verify your Vercel domain** is in the AllowedOrigins list
3. **Try using `*` for AllowedOrigins** (less secure but works for testing)
4. **Check browser console** for specific CORS error messages

### File not found (404)?

1. **Verify file was uploaded** - Check R2 bucket contents
2. **Check URL format** - Should be: `https://pub-4799e35d13ec4295845e692b32aee7b7.r2.dev/models/[filename].glb`
3. **Verify public access** is enabled on the bucket

### Still not working?

The app will automatically fallback to fal.ai URLs if R2 fails. Check Vercel Function logs to see if R2 upload is succeeding.

---

**Status**: Code updated - **Configure CORS in Cloudflare R2** to fix the issue
