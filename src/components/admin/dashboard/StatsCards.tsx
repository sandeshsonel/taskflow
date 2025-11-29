import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatItem {
  label: string
  value: string | number
  change: string
  positive?: boolean
}

export function StatsCards({
  stats,
  loading,
}: {
  stats: StatItem[]
  loading: boolean
}) {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              {s.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className='h-6 w-20' />
                <Skeleton className='mt-3 h-4 w-12' />
              </>
            ) : (
              <>
                <p className='text-2xl font-bold'>{s.value}</p>
                <p
                  className={`text-sm ${
                    s.positive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {s.change}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
