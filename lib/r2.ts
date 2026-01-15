import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

// Note: R2 doesn't support ACL in the same way as S3
// CORS must be configured in Cloudflare R2 bucket settings

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME!
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL || process.env.R2_ENDPOINT

  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const key = `models/${timestamp}-${randomString}-${fileName}`

  // Upload file
  // Note: R2 doesn't support ACL parameter like S3
  // Public access and CORS must be configured in Cloudflare R2 bucket settings
  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      // Cache control for better performance
      CacheControl: 'public, max-age=31536000, immutable',
    },
  })

  await upload.done()

  // Return public URL
  // If using custom domain, use that; otherwise construct from endpoint
  if (publicBaseUrl) {
    const baseUrl = publicBaseUrl.replace(/\/$/, '')
    return `${baseUrl}/${key}`
  }

  // Fallback: construct URL from endpoint
  const endpoint = process.env.R2_ENDPOINT!.replace(/\/$/, '')
  return `${endpoint}/${bucketName}/${key}`
}
