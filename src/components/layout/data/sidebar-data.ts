import { LayoutDashboard, ListChecks, Settings, Users } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/admin/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/admin/tasks',
          icon: ListChecks,
        },
        {
          title: 'Users',
          url: '/admin/users',
          icon: Users,
        },
        {
          title: 'Settings',
          url: '/admin/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
