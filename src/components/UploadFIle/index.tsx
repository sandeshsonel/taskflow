import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AlertCircle, Upload, CheckCircle2 } from 'lucide-react'
import { io } from 'socket.io-client'
import { useUploadQueue } from '@/hooks/useUploadQueue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UploadItem } from './UploadItem'
import { UploadList } from '../uploading-file-list'

export default function UploadPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCountRef = useRef(0)

  const {
    uploads,
    addFiles,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    removeUpload,
    startUploads,
    clear,
  } = useUploadQueue()

  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [uploadStarted, setUploadStarted] = useState(false)

  useEffect(() => {
    // Connect to Socket.io for real-time updates
    const socket = io()

    socket.on('upload:progress', (data) => {
      console.log('Upload progress:', data)
    })

    return () => {
      socket.disconnect()
    }
  }, [navigate])

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles: File[] = []

    for (const file of fileArray) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError(`${file.name} is not a valid video file`)
        continue
      }

      // Validate file size (500MB max)
      if (file.size > 20 * 1024 * 1024) {
        setError(`${file.name} exceeds 500MB limit`)
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      addFiles(validFiles)
      setError('')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCountRef.current++
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCountRef.current--
    if (dragCountRef.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCountRef.current = 0
    setIsDragging(false)

    handleFileSelect(e.dataTransfer.files)
  }

  const handleStartUploads = async () => {
    if (uploads.length === 0) {
      setError('Please select at least one file')
      return
    }

    setUploadStarted(true)
    setError('')

    try {
      await startUploads()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  const completedCount = uploads.filter((u) => u.status === 'completed').length
  const failedCount = uploads.filter((u) => u.status === 'failed').length
  const allCompleted =
    uploads.length > 0 && completedCount + failedCount === uploads.length

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-2xl px-4'>
        {allCompleted ? (
          <Card className='border-green-200 bg-green-50'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <CheckCircle2 className='h-8 w-8 text-green-600' />
                <div>
                  <CardTitle className='text-green-900'>
                    Uploads Complete
                  </CardTitle>
                  <CardDescription className='text-green-800'>
                    {completedCount} file{completedCount !== 1 ? 's' : ''}{' '}
                    uploaded successfully
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-3'>
                <Button
                  className='flex-1 gap-2'
                  onClick={() => navigate({ to: '/library' })}
                >
                  Go to Videos
                </Button>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={() => {
                    clear()
                    setUploadStarted(false)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                >
                  Upload More Files
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div>
              {error && (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Drag and Drop Area */}
              {uploads.length === 0 && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition ${
                    isDragging
                      ? 'border-black bg-black'
                      : 'border-gray-300 hover:border-black hover:bg-gray-50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className='mx-auto mb-3 h-12 w-12 text-gray-400' />
                  <h3 className='mb-1 font-medium text-gray-900'>
                    Drop videos here
                  </h3>
                  <p className='mb-4 text-sm text-gray-600'>
                    or click to browse
                  </p>
                  <p className='text-xs text-gray-500'>
                    Supported formats: MP4, MOV, AVI, MPG (Max 20MB each)
                  </p>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='video/*'
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className='hidden'
                    multiple
                  />
                </div>
              )}

              {/* Upload List */}
              {uploads.length > 0 && (
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-medium text-gray-900'>
                      {uploads.length} file{uploads.length !== 1 ? 's' : ''}{' '}
                      selected
                    </h3>
                    {!uploadStarted && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                          clear()
                          if (fileInputRef.current)
                            fileInputRef.current.value = ''
                        }}
                        className='text-gray-600 hover:text-gray-700'
                      >
                        Clear All
                      </Button>
                    )}
                  </div>

                  {uploads.map((upload) => (
                    <UploadItem
                      key={upload.id}
                      upload={upload}
                      onPause={() => pauseUpload(upload.id)}
                      onResume={() => resumeUpload(upload.id)}
                      onCancel={() => cancelUpload(upload.id)}
                      onRemove={() => removeUpload(upload.id)}
                    />
                  ))}
                </div>
              )}

              {/* Start Upload Button */}
              {uploads.length > 0 && !uploadStarted && (
                <Button
                  size='lg'
                  className='mt-4 w-full gap-2 bg-blue-600 hover:bg-blue-700'
                  onClick={handleStartUploads}
                >
                  <Upload className='h-5 w-5' />
                  Start Uploading ({uploads.length} file
                  {uploads.length !== 1 ? 's' : ''})
                </Button>
              )}

              {/* Upload More Button */}
              {uploadStarted && uploads.length > 0 && (
                <Button
                  variant='outline'
                  className='mt-4 w-full gap-2'
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Upload className='h-5 w-5' />
                  Add More Files
                </Button>
              )}

            </div>
          </>
        )}
      <UploadList />
      </div>
    </div>
  )
}
