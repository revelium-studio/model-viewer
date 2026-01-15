'use client'

import { useRef, useState } from 'react'

interface UploadComponentProps {
  onUpload: (file: File) => void
}

const LOGO_URL = 'https://pub-31178c53271846bd9cb48918a4fdd72e.r2.dev/wordmark.svg'
const UPLOAD_ICON_URL = 'https://pub-31178c53271846bd9cb48918a4fdd72e.r2.dev/upload.svg'
const FONT_FAMILY = "'HK Guise', sans-serif"

export default function UploadComponent({ onUpload }: UploadComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [hoverActive, setHoverActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validate file type - support JPG, PNG, WebP, AVIF
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, WebP, or AVIF image')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-start pt-[37px]">
      <div className="w-full max-w-[780px] mx-auto px-[12px]">
        {/* Logo/Wordmark and Title at top */}
        <div className="flex flex-col items-center gap-[29px] mb-[180px]">
          <div className="h-[34.313px] w-[310.82px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={LOGO_URL} 
              alt="Revelium Studio" 
              className="h-full w-full object-contain"
            />
          </div>
          
          {/* Title: "3D Model Generator" */}
          <p 
            className="text-[#2f2f2f] text-[23.54px] font-semibold tracking-[-0.2354px] text-center leading-[0.75]"
            style={{ fontFamily: FONT_FAMILY, fontWeight: 600 }}
          >
            3D Model Generator
          </p>
        </div>

        {/* Main white container */}
        <div 
          className={`relative bg-white rounded-[30px] w-full max-w-[756px] h-[456px] flex flex-col items-center justify-center transition-all ${
            dragActive 
              ? 'border-2 border-dashed border-[#2f2f2f] scale-[1.02]' 
              : hoverActive 
                ? 'border-2 border-dashed border-[#2f2f2f]' 
                : 'border-2 border-transparent'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onMouseEnter={() => !preview && setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
            onChange={handleFileInput}
            className="hidden"
          />

          {preview ? (
            <div className="space-y-6 px-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <p 
                className="text-sm text-[#2f2f2f] text-center"
                style={{ fontFamily: FONT_FAMILY, fontWeight: 600 }}
              >
                {selectedFile?.name}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setPreview(null)
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="px-4 py-2 text-[#2f2f2f] hover:text-[#000] transition-colors"
                  style={{ fontFamily: FONT_FAMILY, fontWeight: 600 }}
                >
                  Change Image
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#2f2f2f] text-white rounded-lg hover:bg-[#000] transition-colors"
                  style={{ fontFamily: FONT_FAMILY, fontWeight: 600 }}
                >
                  Generate 3D Model
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6 relative">
              {/* Upload Icon with gray background circle */}
              <div className="relative flex items-center justify-center">
                {/* Gray background circle */}
                <div className="absolute w-[147px] h-[147px] rounded-full bg-[#ededed]"></div>
                {/* Upload Icon - 2x smaller (73.5px) */}
                <div className="relative w-[73.5px] h-[73.5px] flex items-center justify-center z-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={UPLOAD_ICON_URL} 
                    alt="Upload" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Text: "or drop your image here" */}
              <p 
                className="text-[#2f2f2f] text-[23.54px] font-semibold tracking-[-0.7062px] text-center leading-[0.75] mb-2"
                style={{ fontFamily: FONT_FAMILY, fontWeight: 600 }}
              >
                or drop your image here
              </p>

              {/* Supported formats text */}
              <p 
                className="text-[#2f2f2f] text-[12.54px] font-semibold tracking-[0.1254px] text-center leading-[0.75]"
                style={{ fontFamily: FONT_FAMILY, fontWeight: 600 }}
              >
                JPG, PNG, WebP, AVIF supported – max 10mb
              </p>

              {/* Hidden click area - clicking anywhere in the container triggers file input */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload image"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
