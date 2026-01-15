'use client'

import { useState } from 'react'
import UploadComponent from '@/components/UploadComponent'
import LoadingComponent from '@/components/LoadingComponent'
import ViewerComponent from '@/components/ViewerComponent'

type AppState = 'upload' | 'loading' | 'viewer' | 'error'

export default function Home() {
  const [state, setState] = useState<AppState>('upload')
  const [jobId, setJobId] = useState<string | null>(null)
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('Initializing...')

  const handleUpload = async (file: File) => {
    try {
      setState('loading')
      setError(null)
      
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start generation')
      }

      const data = await response.json()
      setJobId(data.jobId)
      
      // Start polling
      pollJobStatus(data.jobId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setState('error')
    }
  }

  const pollJobStatus = async (id: string) => {
    const maxAttempts = 120 // 10 minutes max (5s intervals)
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/status/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to check job status')
        }

        const data = await response.json()

        if (data.status === 'completed' && data.modelUrl) {
          setModelUrl(data.modelUrl)
          setProgress(100)
          setState('viewer')
        } else if (data.status === 'failed') {
          throw new Error(data.error || 'Generation failed')
        } else if (attempts >= maxAttempts) {
          throw new Error('Generation timeout - please try again')
        } else {
          attempts++
          // Update progress based on status
          if (data.progress !== undefined) {
            setProgress(data.progress)
          } else {
            // Estimate progress based on attempts
            const estimatedProgress = Math.min(90, (attempts / maxAttempts) * 90)
            setProgress(estimatedProgress)
          }
          
          // Update status message
          if (data.status === 'pending') {
            setStatusMessage('Job queued, waiting to start...')
          } else if (data.status === 'processing') {
            setStatusMessage('Generating 3D model...')
          }
          
          setTimeout(poll, 5000) // Poll every 5 seconds
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setState('error')
      }
    }

    poll()
  }

  const handleRetry = () => {
    setState('upload')
    setJobId(null)
    setModelUrl(null)
    setError(null)
    setProgress(0)
    setStatusMessage('Initializing...')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          3D Model Generator
        </h1>

        {state === 'upload' && (
          <UploadComponent onUpload={handleUpload} />
        )}

        {state === 'loading' && (
          <LoadingComponent jobId={jobId} progress={progress} statusMessage={statusMessage} />
        )}

        {state === 'viewer' && modelUrl && (
          <ViewerComponent modelUrl={modelUrl} onReset={handleRetry} />
        )}

        {state === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Error
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
