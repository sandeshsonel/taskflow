import { useQuery } from '@tanstack/react-query'
import { useLocation } from '@tanstack/react-router'
import { getTasksList } from '@/services/taskService'
import { TasksDialogs } from '../../admin/tasks/components/tasks-dialogs'
import { TasksProvider } from '../../admin/tasks/components/tasks-provider'
import { TasksTable } from '../../admin/tasks/components/tasks-table'

export function Tasks() {
  const { search } = useLocation()

  const page = Number(search?.page ?? '1')
  const { data } = useQuery({
    queryKey: ['tasks', page],
    queryFn: () => getTasksList(page),
  })
  return (
    <TasksProvider>
      <TasksTable data={data} />
      <TasksDialogs />
    </TasksProvider>
  )
}
