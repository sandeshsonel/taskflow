import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getDashboardStats } from '@/services/adminUser'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RecentActivity } from '@/components/admin/dashboard/RecentActivity'
import { StatsCards } from '@/components/admin/dashboard/StatsCards'
import { TasksCompletedChart } from '@/components/admin/dashboard/TasksCompletedChart'
import BugReport from '@/components/bug-report'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import Notification from '@/components/notification'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export function Dashboard() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  })

  const stats = useMemo(() => {
    return [
      {
        label: 'Total Users',
        value: String(data?.totalUsers ?? 0),
        change: `${data?.totalUsersChange ?? 0}%`,
        positive: (data?.totalUsersChange ?? 0) >= 0,
      },
      {
        label: 'Active Tasks',
        value: data?.activeTasks ?? 0,
        change: `${data?.activeTasksChange ?? 0}%`,
        positive: (data?.activeTasksChange ?? 0) >= 0,
      },
      {
        label: 'Completed This Week',
        value: data?.completedThisWeek ?? 0,
        change: `${data?.completedThisWeekChange ?? 0}%`,
        positive: (data?.completedThisWeekChange ?? 0) >= 0,
      },
      {
        label: 'New Sign-ups',
        value: data?.newSignups ?? 0,
        change: `${data?.newSignupsChange ?? 0}%`,
        positive: (data?.newSignupsChange ?? 0) >= 0,
      },
    ]
  }, [data])

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <BugReport />
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
            <h1 className='text-2xl font-bold tracking-tight'>
              Welcome back, Admin!
            </h1>
            <p>Here's a summary of your application's activity.</p>
          </div>
          <Button onClick={() => navigate({ to: '/admin/tasks' })}>
            <Plus className='h-4 w-4' />
            <span>Create New Task</span>
          </Button>
        </div>
        <div className='space-y-6'>
          {/* Stats Row */}
          <StatsCards stats={stats} loading={isLoading} />

          {/* Chart + Activity Grid */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            <div className='lg:col-span-2'>
              <TasksCompletedChart />
            </div>
            <RecentActivity />
          </div>
        </div>
      </Main>
    </>
  )
}
