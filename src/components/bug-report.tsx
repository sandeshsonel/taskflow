import { useLocation, useNavigate } from '@tanstack/react-router'
import { Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const BugReport = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (
    <>
      {pathname !== '/bug-report' && import.meta.env.PROD && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size='sm'
              variant='ghost'
              className='rounded-full'
              onClick={() => navigate({ to: '/bug-report' })}
            >
              <Bug />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Report a bug</p>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  )
}

export default BugReport
