import { useNavigate } from '@tanstack/react-router'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TasksPrimaryButtons() {
  const navigate = useNavigate()
  return (
    <div className='flex gap-2'>
      <Button
        className='space-x-1'
        onClick={() => navigate({ to: '/upload-video' })}
      >
        <Upload size={18} />
        <span>Upload Video</span>
      </Button>
    </div>
  )
}
