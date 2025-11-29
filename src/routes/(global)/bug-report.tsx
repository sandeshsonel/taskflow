import { createFileRoute } from '@tanstack/react-router'
import BugReportForm from '@/components/bug-report-form'

export const Route = createFileRoute('/(global)/bug-report')({
  component: BugReportForm,
})
