import AddEditTask from '@/components/add-task'
import { useTasks } from './tasks-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow } = useTasks()
  const normalizedRow = currentRow
    ? {
        ...currentRow,
        createdAt:
          currentRow.createdAt instanceof Date
            ? currentRow.createdAt.toISOString()
            : currentRow.createdAt,
      }
    : null
  return (
    <>
      {(open === 'create' || open === 'update') && (
        <AddEditTask open={open} setOpen={setOpen} currentRow={normalizedRow} />
      )}
    </>
  )
}
