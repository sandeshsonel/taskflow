import { useMutation, useQuery } from '@tanstack/react-query'
import {
  getNotifications,
  updateNotification,
} from '@/services/notificationService'
import { Bell, BellDot } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Spinner } from './ui/spinner'

const Notification = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 1,
  })
  const { mutate, isPending } = useMutation({
    mutationFn: updateNotification,
    onSuccess: () => {
      refetch()
    },
  })

  const handleNotificationStateUpdate = (
    e: React.MouseEvent<HTMLButtonElement>,
    notification: any
  ) => {
    e.preventDefault()
    const payload = {
      notificationId: notification._id,
      actionType: notification.actionType,
      actionData: notification.actionData,
    }
    mutate(payload)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild onClick={() => refetch()}>
        <Button variant='ghost' size='icon' className='scale-95 rounded-full'>
          {data && data.length > 0 ? (
            <BellDot className='size-[1.2rem] scale-100' />
          ) : (
            <Bell className='size-[1.2rem] scale-100' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='min-h-[300px] w-full min-w-[350px] overflow-y-auto'
      >
        {isLoading ? (
          <div className='flex items-center justify-center py-4'>
            <Spinner />
          </div>
        ) : data && data.length > 0 ? (
          <>
            {data.map((notification: any) => (
              <DropdownMenuItem key={notification._id} className='w-full p-2'>
                <div className='flex w-full flex-col'>
                  <p className='text-muted-foreground text-sm leading-snug'>
                    {notification.message}
                  </p>

                  <div className='flex justify-end gap-2 pt-2'>
                    <Button
                      disabled={isPending}
                      size='sm'
                      onClick={(e) =>
                        handleNotificationStateUpdate(e, notification)
                      }
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <DropdownMenuItem className='justify-center'>
            No new notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Notification
