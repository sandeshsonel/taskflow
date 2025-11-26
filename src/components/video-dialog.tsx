'use client'

import * as React from 'react'
import { api } from '@/services/api'
import clsx from 'clsx'
import { toast } from 'sonner'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type VideoSource =
  | { type: 'file'; src: string; poster?: string }
  | { type: 'youtube'; id: string; title?: string } // privacy-enhanced youtube
  | { type: 'vimeo'; id: string; title?: string }

interface VideoDialogProps {
  triggerLabel?: string
  className?: string
  source: VideoSource
  mimeType?: string
  title?: string
  open: boolean
  videoId?: string
  onOpenChange?: () => void
}

/**
 * VideoDialog
 * - Auto-pauses <video> on close
 * - Responsive (16:9 by default)
 * - Accessible (focus trap, ESC to close)
 */
export function VideoDialog({
  title = 'Video',
  open = false,
  videoId = '',
  onOpenChange = () => {},
}: VideoDialogProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const loadVideo = async () => {
    try {
      const res = await api.get(`/api/v1/videos/${videoId}/stream`, {
        responseType: 'blob', // ✅ Important: get video as BLOB
      })

      const blobUrl = URL.createObjectURL(res.data)

      if (videoRef.current) {
        videoRef.current.src = blobUrl
      }
    } catch (err) {
      console.error(err)
      setError('Could not load the video.')
    }
  }

  // Pause HTML5 video when dialog closes
  React.useEffect(() => {
    if (!open && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause()
    }

    loadVideo()
  }, [open, videoId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-w-[92vw] overflow-hidden p-0 sm:max-w-3xl'
        aria-describedby={undefined} // we don't need a long description region
      >
        <DialogHeader className='px-4 pt-4'>
          <DialogTitle className='text-base sm:text-lg'>{title}</DialogTitle>
        </DialogHeader>

        <div className='px-4 pb-4'>
          <AspectRatio
            ratio={16 / 9}
            className='overflow-hidden rounded-md bg-black'
          >
            <div className='relative h-full w-full'>
              <video
                ref={videoRef}
                controls
                playsInline
                preload='metadata'
                className={clsx('h-full w-full', error && 'opacity-50')}
                controlsList='nodownload noplaybackrate'
                disablePictureInPicture
                crossOrigin='use-credentials'
                onError={() => {
                  // We can’t read HTTP status directly from <video>,
                  // so show a generic “couldn’t load” message.
                  toast.error(
                    'Could not load the video. It may be missing, protected, or your session expired.'
                  )
                  setError(
                    'Could not load the video. It may be missing, protected, or your session expired.'
                  )
                }}
              ></video>

              {error && (
                <div className='pointer-events-none absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-white/90'>
                  {error}
                </div>
              )}
            </div>
          </AspectRatio>
        </div>
      </DialogContent>
    </Dialog>
  )
}
