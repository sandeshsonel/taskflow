import { Link, Outlet } from "@tanstack/react-router"
import { CircleCheckBig } from "lucide-react"

import { UserHeader } from "../user/header"
import { ThemeSwitch } from "../theme-switch"
import { ProfileDropdown } from "../profile-dropdown"

const UserLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
        <UserHeader fixed className="px-4">
              <Link to='/' className='flex items-center space-x-2'>
          <div className='flex items-center justify-center w-8 h-8 rounded-sm dark:bg-white bg-black'>
            <CircleCheckBig  size={18} className='dark:text-black text-white'/>
          </div>
          <div className='font-medium'>TaskFlow</div>
        </Link>
                    <div className='ms-auto flex items-center space-x-4'>
                      <ThemeSwitch />
                      <ProfileDropdown />
                    </div>
        </UserHeader>
        <div className="px-8 py-4">
                   {children ?? <Outlet />}

        </div>
       
    </>
  )
}

export default UserLayout