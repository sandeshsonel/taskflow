import { TasksDialogs } from './components/tasks-dialogs'
import { TasksProvider } from './components/tasks-provider'
import { TasksTable } from './components/tasks-table'
import { tasks } from './data/tasks'

export function Tasks() {
  return (
    <TasksProvider>
      <TasksTable data={tasks} />
      <TasksDialogs />
    </TasksProvider>
  )
}
