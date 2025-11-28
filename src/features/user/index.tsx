import { Main } from '@/components/layout/main'
import UserLayout from '@/components/layout/user-layout'
import { TasksPrimaryButtons } from '../admin/tasks/components/tasks-primary-buttons'
import { TasksProvider } from '../admin/tasks/components/tasks-provider'
import { Tasks } from './tasks'

const UserHome = () => {
  return (
    <UserLayout>
      <TasksProvider>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Tasks Management
              </h2>
            </div>
            <TasksPrimaryButtons />
          </div>
          <Tasks />
        </Main>
      </TasksProvider>
    </UserLayout>
  )
}

export default UserHome
