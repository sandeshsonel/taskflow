import { createFileRoute } from '@tanstack/react-router'
import BugReportForm from '@/components/bug-report-form'

export const Route = createFileRoute('/(globalPage)/bug-report')({
  component: BugReportForm,
})
