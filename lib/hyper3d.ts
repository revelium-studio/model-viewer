import { fal } from '@fal-ai/client'

// Configure fal.ai client with API key
const FAL_KEY = process.env.FAL_KEY

if (!FAL_KEY) {
  console.warn('FAL_KEY is not set. API calls will fail.')
} else {
  fal.config({
    credentials: FAL_KEY,
  })
}

const MODEL_ID = 'fal-ai/hyper3d/rodin/v2'

export interface FalJobStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  requestId: string
  progress?: number
  error?: string
}

export interface FalJobResult {
  model_mesh: {
    url: string
    content_type?: string
    file_name?: string
  }
  textures: Array<{
    url: string
    content_type?: string
    file_name?: string
  }>
  seed: number
}

/**
 * Upload image to fal.ai storage and create a 3D generation job
 */
export async function createHyper3DJob(imageBuffer: Buffer, imageName: string): Promise<string> {
  if (!FAL_KEY) {
    throw new Error('FAL_KEY environment variable is not set')
  }

  try {
    // First, upload the image to fal.ai storage
    const imageFile = new File([imageBuffer], imageName, { type: 'image/jpeg' })
    const imageUrl = await fal.storage.upload(imageFile)

    // Submit job to fal.ai queue
    const { request_id } = await fal.queue.submit(MODEL_ID, {
      input: {
        input_image_urls: [imageUrl],
        geometry_file_format: 'glb',
        material: 'All',
        quality_mesh_option: '500K Triangle',
        preview_render: false,
      },
    })

    return request_id
  } catch (error) {
    console.error('Error creating fal.ai job:', error)
    if (error instanceof Error) {
      throw new Error(`fal.ai API error: ${error.message}`)
    }
    throw new Error('Failed to create generation job')
  }
}

/**
 * Get the status of a fal.ai job
 */
export async function getHyper3DJobStatus(requestId: string): Promise<FalJobStatus> {
  if (!FAL_KEY) {
    throw new Error('FAL_KEY environment variable is not set')
  }

  try {
    const status = await fal.queue.status(MODEL_ID, {
      requestId,
      logs: true,
    })

    // Map fal.ai status to our internal status format
    let mappedStatus: 'pending' | 'processing' | 'completed' | 'failed'
    
    switch (status.status) {
      case 'IN_QUEUE':
        mappedStatus = 'pending'
        break
      case 'IN_PROGRESS':
        mappedStatus = 'processing'
        break
      case 'COMPLETED':
        mappedStatus = 'completed'
        break
      case 'FAILED':
        mappedStatus = 'failed'
        break
      default:
        mappedStatus = 'pending'
    }

    return {
      status: mappedStatus,
      requestId: status.request_id || requestId,
      progress: status.status === 'IN_PROGRESS' ? undefined : undefined, // fal.ai doesn't provide progress percentage
      error: status.error?.message,
    }
  } catch (error) {
    console.error('Error checking fal.ai job status:', error)
    if (error instanceof Error) {
      throw new Error(`fal.ai API error: ${error.message}`)
    }
    throw new Error('Failed to check job status')
  }
}

/**
 * Get the result of a completed fal.ai job
 */
export async function getHyper3DJobResult(requestId: string): Promise<FalJobResult> {
  if (!FAL_KEY) {
    throw new Error('FAL_KEY environment variable is not set')
  }

  try {
    const result = await fal.queue.result(MODEL_ID, {
      requestId,
    })

    return result.data as FalJobResult
  } catch (error) {
    console.error('Error getting fal.ai job result:', error)
    if (error instanceof Error) {
      throw new Error(`fal.ai API error: ${error.message}`)
    }
    throw new Error('Failed to get job result')
  }
}

/**
 * Download model file from URL
 */
export async function downloadHyper3DModel(modelUrl: string): Promise<Buffer> {
  try {
    const response = await fetch(modelUrl)

    if (!response.ok) {
      throw new Error(`Failed to download model: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error('Error downloading model:', error)
    if (error instanceof Error) {
      throw new Error(`Download error: ${error.message}`)
    }
    throw new Error('Failed to download model')
  }
}
