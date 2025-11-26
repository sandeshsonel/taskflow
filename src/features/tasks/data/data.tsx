import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AlertCircle,
  ShieldCheck,
  Flag,
  LoaderCircle,
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
    label: 'Safe',
    value: 'safe' as const,
    icon: ShieldCheck,
  },
  {
    label: 'Flaged',
    value: 'flaged' as const,
    icon: Flag,
  },
  {
    label: 'Processing',
    value: 'processing' as const,
    icon: LoaderCircle,
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
  {
    label: 'Critical',
    value: 'critical' as const,
    icon: AlertCircle,
  },
]
