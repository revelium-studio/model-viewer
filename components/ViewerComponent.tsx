'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { ErrorBoundary } from 'react-error-boundary'
import * as THREE from 'three'

interface ViewerComponentProps {
  modelUrl: string
  onReset: () => void
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url, true)
  
  // Auto-scale model to fit in view
  if (scene) {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const scale = 2 / maxDim
      scene.scale.setScalar(scale)
    }
  }
  
  return <primitive object={scene} />
}

function ViewerError({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold text-red-800 mb-2">
        Failed to Load Model
      </h2>
      <p className="text-red-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Loading 3D model...</p>
      </div>
    </div>
  )
}

export default function ViewerComponent({ modelUrl, onReset }: ViewerComponentProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your 3D Model</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Generate Another
        </button>
      </div>

      <ErrorBoundary
        FallbackComponent={ViewerError}
        onReset={onReset}
      >
        <Suspense fallback={<LoadingFallback />}>
          <div className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              gl={{ antialias: true }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />
              <Model url={modelUrl} />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={2}
                maxDistance={20}
              />
              <Environment preset="sunset" />
            </Canvas>
          </div>
        </Suspense>
      </ErrorBoundary>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Click and drag to rotate, scroll to zoom, right-click and drag to pan
        </p>
      </div>
    </div>
  )
}
