interface Hyper3DJobResponse {
  jobId: string
  status: string
  message?: string
}

interface Hyper3DStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  modelUrl?: string
  error?: string
}

const API_BASE_URL = process.env.HYPER3D_API_BASE_URL || 'https://api.hyper3d.ai'
const API_KEY = process.env.HYPER3D_API_KEY!

if (!API_KEY) {
  console.warn('HYPER3D_API_KEY is not set. API calls will fail.')
}

export async function createHyper3DJob(imageBuffer: Buffer, imageName: string): Promise<string> {
  if (!API_KEY) {
    throw new Error('HYPER3D_API_KEY environment variable is not set')
  }

  try {
    // Use form-data for Node.js compatibility
    const FormData = (await import('form-data')).default
    const formData = new FormData()
    formData.append('image', imageBuffer, {
      filename: imageName,
      contentType: 'image/jpeg',
    })

    const headers = formData.getHeaders()
    const response = await fetch(`${API_BASE_URL}/v1/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        ...headers,
      },
      body: formData as any,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Hyper3D API error: ${response.status} - ${errorText}`)
    }

    const data: Hyper3DJobResponse = await response.json()
    return data.jobId
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch failed')) {
      throw new Error(`Network error: Unable to connect to Hyper3D API at ${API_BASE_URL}. Please check your internet connection and API endpoint.`)
    }
    throw error
  }
}

export async function getHyper3DJobStatus(jobId: string): Promise<Hyper3DStatusResponse> {
  if (!API_KEY) {
    throw new Error('HYPER3D_API_KEY environment variable is not set')
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Hyper3D API error: ${response.status} - ${errorText}`)
    }

    const data: Hyper3DStatusResponse = await response.json()
    return data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch failed')) {
      throw new Error(`Network error: Unable to connect to Hyper3D API at ${API_BASE_URL}. Please check your internet connection and API endpoint.`)
    }
    throw error
  }
}

export async function downloadHyper3DModel(modelUrl: string): Promise<Buffer> {
  const response = await fetch(modelUrl, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to download model: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
