import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <Link to='/' className='flex items-center space-x-2 ml-2 mb-2'>
          <div className='flex items-center justify-center w-8 h-8 rounded-md dark:bg-white bg-black'>
          <Play size={18} className='dark:text-black text-white' />
          </div>
          <div className='font-medium'>Video Platform</div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
