import AddEditTask from '@/components/add-task'
import { useTasks } from './tasks-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow } = useTasks()
  return (
    <>
      {(open === 'create' || open === 'update') && (
        <AddEditTask open={open} setOpen={setOpen} currentRow={currentRow} />
      )}
    </>
  )
}
