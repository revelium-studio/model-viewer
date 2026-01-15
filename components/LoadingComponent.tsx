'use client'

interface LoadingComponentProps {
  jobId: string | null
  progress: number
  statusMessage: string
}

export default function LoadingComponent({ jobId, progress, statusMessage }: LoadingComponentProps) {

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-8">
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Generating 3D Model</h2>
          <p className="text-gray-600">{statusMessage}</p>
          {jobId && (
            <p className="text-xs text-gray-400 mt-2">Job ID: {jobId}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>This may take a few minutes...</p>
          <p className="mt-1">Please keep this page open</p>
        </div>
      </div>
    </div>
  )
}
