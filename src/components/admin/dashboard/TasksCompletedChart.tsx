import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const values = [20, 35, 45, 15, 30, 38, 50]

export function TasksCompletedChart() {
  const maxValue = Math.max(...values)

  return null

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='text-lg'>Tasks Completed Over Time</CardTitle>
        <p className='text-muted-foreground text-sm'>Last 30 Days</p>
      </CardHeader>

      <CardContent>
        <div className='flex h-48 items-end gap-3'>
          {values.map((v, i) => (
            <div key={i} className='flex flex-1 justify-center'>
              <div
                className={`w-6 rounded-md ${
                  i === 2 || i === 6 ? 'bg-blue-600' : 'bg-blue-300'
                }`}
                style={{ height: `${(v / maxValue) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
