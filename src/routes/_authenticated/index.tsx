import UserHome from '@/features/user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: UserHome,
})
