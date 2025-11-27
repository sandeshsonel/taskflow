'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { deleteUserService } from '@/services/adminUser'
import { AlertTriangle } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const router = useRouter()
  const { queryClient } = router.options.context
  const { mutate, isPending } = useMutation({
    mutationFn: deleteUserService,
    onSuccess: () => {
      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })

  const handleDelete = async () => {
    mutate(currentRow._id)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={isPending}
      isLoading={isPending}
      title={
        <span className='text-destructive flex items-center'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Delete User
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>
              {currentRow.firstName + ' ' + currentRow.lastName}&nbsp;
            </span>
            ?
          </p>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
