import { Database, Play, Plus, Shell, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import UploadFilesDrawer from '@/components/uploading-files-drawer'
import Notification from '@/components/notification'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <Notification />
          <UploadFilesDrawer />
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
        <div className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Videos
                </CardTitle>
                <Play size={16} />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>0</div>
                <p className='text-muted-foreground text-xs'>
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Storage Used
                </CardTitle>
                <Database size={16} />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>75.8 GB</div>
                <p className='text-muted-foreground text-xs'>
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Active Users
                </CardTitle>
                <Users size={16} />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>214</div>
                <p className='text-muted-foreground text-xs'>
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Sensitivity Alerts
                </CardTitle>
                <Shell size={16} />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>32</div>
                <p className='text-muted-foreground text-xs'>
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}
