import { Link, Outlet } from '@tanstack/react-router'
import { CircleCheckBig } from 'lucide-react'
// import Notification from '../notification'
import { ProfileDropdown } from '../profile-dropdown'
import { ThemeSwitch } from '../theme-switch'
import { UserHeader } from '../user/header'

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <UserHeader fixed>
        <Link to='/' className='flex items-center space-x-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-sm bg-black dark:bg-white'>
            <CircleCheckBig size={18} className='text-white dark:text-black' />
          </div>
          <div className='font-medium'>TaskFlow</div>
        </Link>
        <div className='ms-auto flex items-center space-x-4'>
          {/* <Notification /> */}
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </UserHeader>
      <div className='px-4 py-4'>{children ?? <Outlet />}</div>
    </>
  )
}

export default UserLayout
