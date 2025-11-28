import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { deleteTaskService } from '@/services/taskService'
import AddEditTask from '@/components/add-task'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useTasks } from './tasks-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()

  const router = useRouter()
  const { queryClient } = router.options.context
  const { mutate, isPending } = useMutation({
    mutationFn: deleteTaskService,
    onSuccess: () => {
      setOpen(null)
      setCurrentRow(null)
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })

  const handleDelete = async () => {
    if (currentRow) {
      mutate(currentRow._id)
    }
  }

  return (
    <>
      {(open === 'create' || open === 'update') && (
        <AddEditTask open={open} setOpen={setOpen} currentRow={currentRow} />
      )}

      {currentRow && (
        <>
          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              handleDelete()
            }}
            className='max-w-md'
            title={`Delete this task: ${currentRow._id} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow._id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
            disabled={isPending}
          />
        </>
      )}
    </>
  )
}
