import { useState } from 'react'
import {
  CheckCircle,
  Hourglass,
  CloudUpload,
  Play,
  Info,
  Pause,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type UploadFile = {
  id: string
  name: string
  status: string
  progress: number
  color: 'primary' | 'yellow' | 'green' | 'red'
  icon: React.ReactNode
  isPaused?: boolean
}

const UploadFilesDrawer = () => {
  const [uploads, setUploads] = useState<UploadFile[]>([
    {
      id: '1',
      name: 'project-alpha-final-render.mp4',
      status: 'Uploading... 78%',
      progress: 78,
      color: 'primary',
      icon: <Play className='text-blue-600' />,
    },
    {
      id: '2',
      name: 'team-meeting-recording-q3.mov',
      status: 'Uploading... 42%',
      progress: 42,
      color: 'primary',
      icon: <Play className='text-blue-600' />,
    },
    {
      id: '3',
      name: 'marketing-campaign-v2.avi',
      status: 'Processing...',
      progress: 100,
      color: 'yellow',
      icon: <Hourglass className='text-yellow-500' />,
    },
    {
      id: '4',
      name: 'onboarding-tutorial-final.mp4',
      status: 'Completed',
      progress: 100,
      color: 'green',
      icon: <CheckCircle className='text-green-500' />,
    },
    {
      id: '5',
      name: 'old_archive_file.zip',
      status: 'Upload failed',
      progress: 65,
      color: 'red',
      icon: <Info className='text-red-500' />,
    },
  ])

  const handlePause = (id: string) => {
    setUploads((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              isPaused: true,
              status: 'Paused',
              color: 'yellow',
            }
          : file
      )
    )
  }

  const handleResume = (id: string) => {
    setUploads((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              isPaused: false,
              status: `Uploading... ${file.progress}%`,
              color: 'primary',
            }
          : file
      )
    )
  }

  const handleRemove = (id: string) => {
    setUploads((prev) => prev.filter((file) => file.id !== id))
  }

  return null

  return (
    <>
      <Sheet>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='scale-95 rounded-full'
              >
                <CloudUpload className='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Uploading files</p>
          </TooltipContent>
        </Tooltip>

        <SheetContent side='right'>
          <SheetHeader>
            <SheetTitle>Uploading Files</SheetTitle>
          </SheetHeader>
          <div className='p-4'>
            <ul className='space-y-4'>
              {uploads.map((file) => (
                <li key={file.id}>
                  <div className='flex items-center gap-3'>
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                        file.color === 'primary' && 'bg-primary/10',
                        file.color === 'yellow' && 'bg-yellow-500/10',
                        file.color === 'green' && 'bg-green-500/10',
                        file.color === 'red' && 'bg-red-500/10'
                      )}
                    >
                      {file.icon}
                    </div>

                    {/* File Info */}
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <p className='text-foreground truncate text-sm font-medium'>
                          {file.name}
                        </p>

                        {/* Action buttons */}
                        <div className='flex items-center gap-2'>
                          {file.color === 'primary' &&
                            (file.isPaused ? (
                              <button
                                onClick={() => handleResume(file.id)}
                                className='text-muted-foreground hover:text-primary transition'
                                title='Resume'
                              >
                                <Play className='h-4 w-4' />
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePause(file.id)}
                                className='text-muted-foreground transition hover:text-yellow-600'
                                title='Pause'
                              >
                                <Pause className='h-4 w-4' />
                              </button>
                            ))}
                          <button
                            onClick={() => handleRemove(file.id)}
                            className='text-muted-foreground transition hover:text-red-600'
                            title='Remove'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        </div>
                      </div>

                      {/* Status */}
                      <p
                        className={cn(
                          'mt-0.5 text-xs',
                          file.color === 'primary' && 'text-muted-foreground',
                          file.color === 'yellow' &&
                            'text-yellow-600 dark:text-yellow-500',
                          file.color === 'green' &&
                            'text-green-600 dark:text-green-500',
                          file.color === 'red' &&
                            'text-red-600 dark:text-red-500'
                        )}
                      >
                        {file.status}
                      </p>

                      {/* Progress Bar */}
                      <div className='mt-1'>
                        <Progress
                          value={file.progress}
                          className={cn(
                            'h-[6px]',
                            file.color === 'primary' &&
                              '[&>[data-slot=progress-indicator]]:bg-blue-500',
                            file.color === 'yellow' &&
                              '[&>[data-slot=progress-indicator]]:bg-yellow-500',
                            file.color === 'green' &&
                              '[&>[data-slot=progress-indicator]]:bg-green-500',
                            file.color === 'red' &&
                              '[&>[data-slot=progress-indicator]]:bg-red-500',
                            file.isPaused && 'opacity-50'
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default UploadFilesDrawer
