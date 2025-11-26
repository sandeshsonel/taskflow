import {
  Pause,
  Play,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader,
  File,
} from 'lucide-react'
import { type UploadFile } from '@/hooks/useUploadQueue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface UploadItemProps {
  upload: UploadFile
  onPause: () => void
  onResume: () => void
  onCancel: () => void
  onRemove: () => void
}

export function UploadItem({
  upload,
  onPause,
  onResume,
  onCancel,
  onRemove,
}: UploadItemProps) {
  const isUploading = upload.status === 'uploading'
  const isPaused = upload.status === 'paused'
  const isCompleted = upload.status === 'completed'
  const isFailed = upload.status === 'failed'
  const isCancelled = upload.status === 'cancelled'
  const isQueued = upload.status === 'queued'

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className='rounded-lg border border-gray-200 p-4 transition hover:shadow-sm'>
      <div className='mb-3 flex items-start gap-3'>
        <div className='mt-1 flex-shrink-0'>
          {isCompleted && <CheckCircle className='h-5 w-5 text-green-600' />}
          {isFailed && <AlertCircle className='h-5 w-5 text-red-600' />}
          {(isUploading || isPaused || isQueued) && (
            <Loader className='h-5 w-5 animate-spin text-blue-600' />
          )}
          {isCancelled && <File className='h-5 w-5 text-gray-400' />}
        </div>

        <div className='min-w-0 flex-1'>
          <p className='truncate font-medium text-gray-900'>
            {upload.file.name}
          </p>
          <p className='text-sm text-gray-600'>
            {formatFileSize(upload.file.size)}
          </p>
        </div>

        <div className='flex-shrink-0 text-right'>
          <p className='text-sm font-medium text-gray-900'>
            {upload.progress}%
          </p>
          <p className='text-xs text-gray-600 capitalize'>{upload.status}</p>
        </div>
      </div>

      {/* Progress Bar */}
      {(isUploading || isPaused || isQueued || isCompleted) && (
        <div className='mb-3'>
          <Progress value={upload.progress} className='h-2' />
        </div>
      )}

      {/* Error Message */}
      {(isFailed || upload.error) && (
        <Alert variant='destructive' className='mb-3'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='text-sm'>
            {upload.error || 'Upload failed'}
          </AlertDescription>
        </Alert>
      )}

      {/* Controls */}
      <div className='flex gap-2'>
        {isUploading && (
          <Button
            size='sm'
            variant='outline'
            onClick={onPause}
            className='flex-1 gap-2'
          >
            <Pause className='h-4 w-4' />
            Pause
          </Button>
        )}

        {isPaused && (
          <Button
            size='sm'
            variant='outline'
            onClick={onResume}
            className='flex-1 gap-2'
          >
            <Play className='h-4 w-4' />
            Resume
          </Button>
        )}

        {(isUploading || isPaused || isQueued) && (
          <Button
            size='sm'
            variant='ghost'
            onClick={onCancel}
            className='text-red-600 hover:bg-red-50 hover:text-red-700'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        )}

        {(isCompleted || isFailed || isCancelled) && (
          <Button
            size='sm'
            variant='ghost'
            onClick={onRemove}
            className='text-gray-600 hover:text-gray-700'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
