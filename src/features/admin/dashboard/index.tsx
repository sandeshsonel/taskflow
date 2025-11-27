import { Plus } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import Notification from '@/components/notification'
import { Button } from '@/components/ui/button'
import { StatsCards } from '@/components/admin/dashboard/StatsCards'
import { TasksCompletedChart } from '@/components/admin/dashboard/TasksCompletedChart'
import { RecentActivity } from '@/components/admin/dashboard/RecentActivity'

export function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <Notification />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='flex items-start justify-between'>
        <div className='mb-4 space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>Welcome back, Admin!</h1>
          <p>Here's a summary of your application's activity.</p>
        </div>
        <Button size="sm">
          <Plus className='h-4 w-4' />
          <span>Add New User</span>
        </Button>

        </div>
       <div className="space-y-6">

      {/* Stats Row */}
      <StatsCards />

      {/* Chart + Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TasksCompletedChart/>
        </div>
        <RecentActivity />
      </div>
    </div>
      </Main>
    </>
  )
}
