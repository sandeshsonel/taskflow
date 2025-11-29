import { BellOff } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function RecentActivity() {
  return null
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className='text-muted-foreground flex flex-col items-center justify-center py-10'>
        <BellOff className='mb-2 h-10 w-10' />
        <p>No new activity</p>
        <p className='text-muted-foreground mt-1 text-xs'>
          Recent user actions will appear here.
        </p>
      </CardContent>
    </Card>
  )
}
