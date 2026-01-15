import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * Proxy endpoint to serve R2 files with proper CORS headers
 * This is a temporary workaround until CORS is configured in Cloudflare R2
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const modelUrl = searchParams.get('url')

    if (!modelUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Validate URL is from R2
    if (!modelUrl.includes('r2.dev') && !modelUrl.includes('r2.cloudflarestorage.com')) {
      return NextResponse.json(
        { error: 'Invalid URL - must be from R2' },
        { status: 400 }
      )
    }

    // Fetch the model from R2
    const response = await fetch(modelUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch model: ${response.status}` },
        { status: response.status }
      )
    }

    const modelBuffer = await response.arrayBuffer()

    // Return with proper CORS headers
    return new NextResponse(modelBuffer, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'model/gltf-binary',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error proxying model:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to proxy model',
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
