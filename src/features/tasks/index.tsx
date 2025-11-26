import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import UploadFilesDrawer from '@/components/uploading-files-drawer'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksProvider } from './components/tasks-provider'
import { TasksTable } from './components/tasks-table'

export function Tasks() {
  return (
    <TasksProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <UploadFilesDrawer />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Library</h2>
          <TasksPrimaryButtons />
        </div>
        <TasksTable />
      </Main>
    </TasksProvider>
  )
}
