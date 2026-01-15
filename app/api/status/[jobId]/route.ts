import { NextRequest, NextResponse } from 'next/server'
import { getHyper3DJobStatus, downloadHyper3DModel } from '@/lib/hyper3d'
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

    // Get job status from Hyper3D
    const status = await getHyper3DJobStatus(jobId)

    // If job is completed, download model and upload to R2
    if (status.status === 'completed' && status.modelUrl) {
      try {
        // Download model from Hyper3D
        const modelBuffer = await downloadHyper3DModel(status.modelUrl)

        // Determine file extension and content type
        const isGlb = status.modelUrl.toLowerCase().endsWith('.glb')
        const fileName = isGlb ? 'model.glb' : 'model.gltf'
        const contentType = isGlb ? 'model/gltf-binary' : 'model/gltf+json'

        // Upload to R2
        const r2Url = await uploadToR2(modelBuffer, fileName, contentType)

        return NextResponse.json({
          status: 'completed',
          modelUrl: r2Url,
        })
      } catch (uploadError) {
        console.error('Error uploading to R2:', uploadError)
        // Return the original modelUrl as fallback
        return NextResponse.json({
          status: 'completed',
          modelUrl: status.modelUrl,
          warning: 'Failed to upload to R2, using temporary URL',
        })
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
