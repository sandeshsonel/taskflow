import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Timer,
  HelpCircle,
} from 'lucide-react'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    label: 'Pending',
    value: 'pending' as const,
    icon: HelpCircle,
  },
  {
    label: 'In Progress',
    value: 'in-progress' as const,
    icon: Timer,
  },
  {
    label: 'Completed',
    value: 'completed' as const,
    icon: CheckCircle,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low' as const,
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium' as const,
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: 'high' as const,
    icon: ArrowUp,
  },
]
