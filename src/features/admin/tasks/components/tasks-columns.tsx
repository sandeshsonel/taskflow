import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { priorities, statuses } from '../data/data'
import { type Task } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getTaskColumns = (options?: {
  isAdmin?: boolean
}): ColumnDef<Task>[] => {
  return [
    {
      meta: { className: 'pl-4' },
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Task' />
      ),
      cell: ({ row }) => (
        <div className='w-[80px]'>{row.getValue('title')}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Description' />
      ),
      cell: ({ row }) => (
        <div className='w-[120px] overflow-hidden text-ellipsis whitespace-nowrap'>
          {row.getValue('description')}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: options?.isAdmin ? 'assignTo' : 'assignBy',
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={`Assignee ${options?.isAdmin ? 'To' : 'By'}`}
          />
        )
      },
      cell: ({ row }) => {
        const assignTo = (row.original as any)?.assignToDetails

        if (assignTo) {
          return <span>{assignTo.firstName + ' ' + assignTo.lastName}</span>
        }
        const assignBy = row.getValue('assignBy') as any
        if (row.getValue('assignBy')) {
          return <span>{assignBy.fullName}</span>
        }
        return '-'
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue('status')
        )

        if (!status) {
          return null
        }

        return (
          <div className='flex w-[100px] items-center gap-2'>
            {status.icon && (
              <status.icon className='text-muted-foreground size-4' />
            )}
            <span>{status.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Priority' />
      ),
      cell: ({ row }) => {
        const priority = priorities.find(
          (priority) => priority.value === row.getValue('priority')
        )

        if (!priority) {
          return null
        }

        return (
          <div className='flex items-center gap-2'>
            {priority.icon && (
              <priority.icon className='text-muted-foreground size-4' />
            )}
            <span>{priority.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ row }) => (
        <div className='w-[120px] overflow-hidden text-ellipsis whitespace-nowrap'>
          {format(row.getValue('createdAt'), 'MMM d, yyyy')}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
