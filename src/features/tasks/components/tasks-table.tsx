import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteVideoById, getAllVideos } from '@/services/videoService'
import { Loader, Loader2, Trash2, VideoOff } from 'lucide-react'
import moment from 'moment'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { VideoDialog } from '@/components/video-dialog'

// const statusStyles = {
//   safe: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
//   flagged: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
//   processing:
//     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
//   completed:
//     'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
// } as const

export function TasksTable() {
  // Local UI-only states
  const queryClient = useQueryClient()
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['all-videos'], // unique key for caching
    queryFn: getAllVideos, // function that fetches the data
    retry: 1, // optional: retry once on failure
    enabled: false,
  })
  const mutation = useMutation({
    mutationFn: deleteVideoById,
    onSuccess: (data, id) => handleSuccess(data, id),
    onError: (_, id) => {
      toast.error('Error deleting video')
      setDeletingIds((prev) => {
        const updated = new Set(prev)
        updated.delete(id)
        return updated
      })
    },
  })
  const [currentOpenVideo, setCurrentOpenVideo] = useState<any | null>(null)
  const [deletingIds, setDeletingIds] = useState(new Set())

  const handleSuccess = (data: any, deleteVideoId: string) => {
    queryClient.setQueryData(['all-videos'], (oldData: any) => {
      return {
        ...oldData,
        videos: data.videos,
      }
    })
    setDeletingIds((prev) => {
      const updated = new Set(prev)
      updated.delete(deleteVideoId)
      return updated
    })
  }

  const handleDeleteVideo = async (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation()
    if (mutation.isPending) return
    setDeletingIds((prev) => new Set(prev).add(videoId))
    mutation.mutate(videoId)
  }

  useEffect(() => {
    refetch()
  }, [])

  return (
    <>
      <div
        className={cn(
          'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
          'flex flex-1 flex-col gap-4'
        )}
      >
        {isFetching ? (
          <div className='flex items-center justify-center'>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            <p>Loading videos...</p>
          </div>
        ) : !isFetching && !data?.videos?.length ? (
           <div className="flex flex-col items-center justify-center py-16 text-center">
      <VideoOff className="w-10 h-10 text-muted-foreground" />
      <p className="mt-4 text-base font-medium">No videos found</p>
    </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {data?.videos?.map((video: any, idx: number) => (
              <Card
                key={idx}
                className='flex flex-col overflow-hidden py-0 transition-shadow hover:shadow-md'
                onClick={() => setCurrentOpenVideo(video)}
              >
                <AspectRatio ratio={16 / 9} className='bg-muted'>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className='h-full w-full object-cover'
                  />
                </AspectRatio>

                <CardContent className='flex flex-1 flex-col p-4'>
                  <CardTitle className='mb-1.5 flex-1 text-base'>
                    {video.originalName}
                  </CardTitle>
                  <p className='text-muted-foreground mb-3 text-sm'>
                    {video.createdAt
                      ? moment(video.createdAt).format('MMMM Do, YYYY')
                      : '-'}
                  </p>
                  <div className='flex items-center justify-between'>
                    <Badge
                      className={cn(
                        'flex items-center gap-1 self-start rounded-full px-2.5 py-1 text-xs font-medium'
                        // video.status && statusStyles[video.status]
                      )}
                    >
                      {video.status === 'safe' && '✔️ Safe'}
                      {video.status === 'flagged' && '🚩 Flagged'}
                      {video.status === 'processing' && '⏳ Processing'}
                      {video.status === 'completed' && '✅ Completed'}
                    </Badge>

                    <Button
                      variant='outline'
                      size='sm'
                      onClick={(e) => handleDeleteVideo(e, video._id)}
                      disabled={deletingIds.has(video.id)}
                    >
                      {deletingIds.has(video.id) ? <Loader /> : <Trash2 />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {currentOpenVideo && (
        <VideoDialog
          videoId={currentOpenVideo._id}
          mimeType={currentOpenVideo.mimeType}
          title={currentOpenVideo?.originalName ?? ''}
          open={!!currentOpenVideo}
          source={currentOpenVideo}
          onOpenChange={() => setCurrentOpenVideo(null)}
        />
      )}
    </>
  )
}
