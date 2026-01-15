# 3D Model Generator

A production-ready Next.js web application that transforms 2D images into 3D models using Hyper3D/Rodin API, with automatic storage to Cloudflare R2.

## Features

- 🖼️ **Image Upload**: Drag-and-drop or browse to upload JPG/PNG images
- ⏳ **Real-time Progress**: Live progress updates with status messages during generation
- 🎨 **3D Viewer**: Interactive 3D model viewer with orbit controls
- ☁️ **Persistent Storage**: Generated models automatically uploaded to Cloudflare R2
- 🔄 **Error Handling**: Comprehensive error handling with retry functionality
- 🚀 **Vercel Ready**: Optimized for deployment on Vercel

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **3D Rendering**: Three.js + React Three Fiber + Drei
- **Storage**: Cloudflare R2 (S3-compatible)
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- fal.ai API key (sign up at https://fal.ai - free tier available)
- Cloudflare R2 bucket and credentials (optional, for permanent storage)

## Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd 3d-model-gesture
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # fal.ai API Configuration (used as middleman for Hyper3D/Rodin)
   FAL_KEY=your_fal_ai_api_key_here

   # Cloudflare R2 Configuration (optional, for permanent storage)
   R2_ACCOUNT_ID=your_r2_account_id
   R2_ACCESS_KEY_ID=your_r2_access_key_id
   R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
   R2_BUCKET_NAME=your_bucket_name
   R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
   R2_PUBLIC_BASE_URL=https://your-custom-domain.com
   ```

   **Note**: 
   - `FAL_KEY` is **required** - Get it from https://fal.ai/dashboard
   - R2 variables are **optional** - If not set, models will use fal.ai URLs (temporary)
   - `R2_PUBLIC_BASE_URL` is optional. If you have a custom domain for your R2 bucket, use it here.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

1. **Push your code to GitHub**

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**

   In the Vercel project settings, add all the environment variables from your `.env.local`:

   - `FAL_KEY` (required - get from https://fal.ai/dashboard)
   - `R2_ACCOUNT_ID` (optional)
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
   - `R2_ENDPOINT`
   - `R2_PUBLIC_BASE_URL` (optional, for custom domain)

4. **Deploy**
   - Vercel will automatically deploy on every push to your main branch
   - Or click "Deploy" to deploy immediately

## Cloudflare R2 Setup

1. **Create an R2 Bucket**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to R2 → Create bucket
   - Name your bucket (e.g., `3d-models`)

2. **Get R2 Credentials**
   - Go to R2 → Manage R2 API Tokens
   - Create API token with read/write permissions
   - Save the Access Key ID and Secret Access Key

3. **Configure Public Access (Optional)**
   - If you want public URLs, configure a custom domain or public bucket
   - Set `R2_PUBLIC_BASE_URL` to your custom domain

## fal.ai Setup

This app uses **fal.ai** to access Hyper3D/Rodin v2, which is more cost-effective than direct Hyper3D business accounts.

1. **Get fal.ai API Key**
   - Sign up at [fal.ai](https://fal.ai) (free tier available)
   - Go to [Dashboard](https://fal.ai/dashboard) → API Keys
   - Copy your API key

2. **Set Environment Variable**
   - Add `FAL_KEY=your_api_key` to `.env.local` (local) or Vercel environment variables

For detailed setup instructions, see [FAL_AI_SETUP.md](./FAL_AI_SETUP.md)

## Project Structure

```
3d-model-gesture/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts          # Create generation job
│   │   └── status/
│   │       └── [jobId]/
│   │           └── route.ts     # Poll job status & upload to R2
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page with state management
├── components/
│   ├── UploadComponent.tsx      # Image upload UI
│   ├── LoadingComponent.tsx     # Progress/loading UI
│   └── ViewerComponent.tsx      # 3D model viewer
├── lib/
│   ├── hyper3d.ts               # Hyper3D API integration
│   └── r2.ts                    # Cloudflare R2 upload
└── README.md
```

## API Routes

### `POST /api/generate`
Creates a new 3D generation job from an uploaded image.

**Request**: FormData with `image` field (JPG/PNG, max 10MB)

**Response**:
```json
{
  "jobId": "job_123456"
}
```

### `GET /api/status/[jobId]`
Polls the status of a generation job.

**Response** (pending/processing):
```json
{
  "status": "processing",
  "progress": 45
}
```

**Response** (completed):
```json
{
  "status": "completed",
  "modelUrl": "https://your-domain.com/models/model.glb"
}
```

## Error Handling

The app handles various error scenarios:

- **Invalid file type**: Only JPG/PNG accepted
- **File too large**: Max 10MB
- **API failures**: Network errors, API errors
- **Generation failures**: Job failures from Hyper3D
- **Timeout**: 10-minute timeout for generation
- **Model loading errors**: Failed to load GLB/GLTF in viewer

All errors show user-friendly messages with retry options.

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## License

MIT

## Quick Deployment

### GitHub + Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/revelium-studio/model-viewer.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Import project from GitHub: `revelium-studio/model-viewer`
   - Add environment variables (see below)
   - Deploy

3. **Set Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Redeploy after adding variables

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Support

For issues or questions:
- Check the [fal.ai documentation](https://fal.ai/docs)
- Review [Hyper3D/Rodin model page](https://fal.ai/models/fal-ai/hyper3d/rodin/v2)
- Review [Cloudflare R2 documentation](https://developers.cloudflare.com/r2/)
- See [FAL_AI_SETUP.md](./FAL_AI_SETUP.md) for fal.ai setup help
- Open an issue on GitHub
