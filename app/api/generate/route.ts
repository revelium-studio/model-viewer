import { NextRequest, NextResponse } from 'next/server'
import { createHyper3DJob } from '@/lib/hyper3d'

export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds max for job creation

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!imageFile.type.match(/^image\/(jpeg|jpg|png)$/)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPG or PNG image.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await imageFile.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)

    // Create Hyper3D job
    const jobId = await createHyper3DJob(imageBuffer, imageFile.name)

    return NextResponse.json({ jobId })
  } catch (error) {
    console.error('Error creating generation job:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create generation job',
      },
      { status: 500 }
    )
  }
}
