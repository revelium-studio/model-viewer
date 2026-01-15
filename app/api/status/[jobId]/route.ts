import { NextRequest, NextResponse } from 'next/server'
import { getHyper3DJobStatus, getHyper3DJobResult, downloadHyper3DModel } from '@/lib/hyper3d'
import { uploadToR2 } from '@/lib/r2'

export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds max for status check

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Get job status from fal.ai
    const status = await getHyper3DJobStatus(jobId)

    // If job is completed, get result, download model and upload to R2
    if (status.status === 'completed') {
      try {
        // Get the job result from fal.ai
        const result = await getHyper3DJobResult(jobId)
        const modelUrl = result.model_mesh.url

        // Download model from fal.ai
        const modelBuffer = await downloadHyper3DModel(modelUrl)

        // Determine file extension and content type
        const contentType = result.model_mesh.content_type || 'model/gltf-binary'
        const fileName = result.model_mesh.file_name || 'model.glb'

        // Upload to R2 (if configured)
        let finalModelUrl = modelUrl // Default to fal.ai URL
        
        try {
          if (process.env.R2_BUCKET_NAME && process.env.R2_ACCESS_KEY_ID) {
            const r2Url = await uploadToR2(modelBuffer, fileName, contentType)
            finalModelUrl = r2Url
            console.log('Model uploaded to R2:', r2Url)
          } else {
            console.log('R2 not configured, using fal.ai URL')
          }
        } catch (r2Error) {
          console.error('R2 upload failed, using fal.ai URL as fallback:', r2Error)
          // Continue with fal.ai URL - it's already set as finalModelUrl
        }

        return NextResponse.json({
          status: 'completed',
          modelUrl: finalModelUrl,
        })
      } catch (uploadError) {
        console.error('Error processing completed job:', uploadError)
        // Try to get result anyway and return the fal.ai URL as fallback
        try {
          const result = await getHyper3DJobResult(jobId)
          return NextResponse.json({
            status: 'completed',
            modelUrl: result.model_mesh.url,
            warning: 'Failed to upload to R2, using fal.ai URL',
          })
        } catch (resultError) {
          throw uploadError
        }
      }
    }

    // Return current status
    return NextResponse.json({
      status: status.status,
      progress: status.progress,
      error: status.error,
    })
  } catch (error) {
    console.error('Error checking job status:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to check job status',
        status: 'error',
      },
      { status: 500 }
    )
  }
}
