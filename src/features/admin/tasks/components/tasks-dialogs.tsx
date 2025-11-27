import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { SelectDropdown } from '@/components/select-dropdown'
import { useTasks } from './tasks-provider'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(50),
  description: z.string().min(1, 'Description is required.').max(200),

  status: z.enum(['pending', 'in-progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  assignTo: z.string().min(1, 'Please select a user to assign the task to.'),
  createdAt: z.string(),
  isEdit: z.boolean(),
})

type UserForm = z.infer<typeof formSchema>

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()

  const isEdit = open === 'update'

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
          status:
            currentRow?.status === 'pending' ||
            currentRow?.status === 'in-progress' ||
            currentRow?.status === 'completed'
              ? currentRow.status
              : 'pending',
          priority:
            currentRow?.priority === 'low' ||
            currentRow?.priority === 'medium' ||
            currentRow?.priority === 'high'
              ? currentRow.priority
              : 'low',
          createdAt:
            typeof currentRow?.createdAt === 'string'
              ? currentRow.createdAt
              : currentRow?.createdAt
                ? format(new Date(currentRow.createdAt), 'MMMM dd, yyyy')
                : format(new Date(), 'MMMM dd, yyyy'),
        }
      : {
          isEdit,
          title: '',
          description: '',
          status: 'pending',
          priority: 'low',
          assignTo: '',
          createdAt: format(new Date(), 'MMMM dd, yyyy'),
        },
  })

  const onSubmit = (values: UserForm) => {
    form.reset()
    showSubmittedData(values)
    setOpen(null)
  }

  return (
    <>
      {(open === 'create' || open === 'update') && (
        <Dialog
          open={!!open}
          onOpenChange={() => {
            // form.reset()
            setOpen(null)
          }}
        >
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader className='text-start'>
              <DialogTitle>{isEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            </DialogHeader>
            <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
              <Form {...form}>
                <form
                  id='user-form'
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4 px-0.5'
                >
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g. Design the new dashboard'
                            autoComplete='off'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className='resize-none'
                            placeholder='Provide a brief description of the task'
                            autoComplete='off'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='grid grid-cols-2 items-start gap-3'>
                    <FormField
                      control={form.control}
                      name='status'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <SelectDropdown
                            className='w-full'
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder='Select dropdown'
                            items={[
                              { label: 'Pending', value: 'pending' },
                              { label: 'In Progress', value: 'in-progress' },
                              { label: 'Completed', value: 'completed' },
                            ]}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='priority'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <SelectDropdown
                            className='w-full'
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder='Select dropdown'
                            items={[
                              { label: 'Low', value: 'low' },
                              { label: 'Medium', value: 'medium' },
                              { label: 'High', value: 'high' },
                            ]}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid w-full grid-cols-2 items-start gap-3'>
                    <FormField
                      control={form.control}
                      name='assignTo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assign To</FormLabel>
                          <SelectDropdown
                            className='w-full'
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder='Select dropdown'
                            items={[]}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='createdAt'
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormLabel>
                            {isEdit ? 'Created On' : 'Date Created'}
                          </FormLabel>
                          <Input
                            disabled
                            className='w-full border border-gray-300 bg-gray-200'
                            {...field}
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
            <DialogFooter>
              <Button type='submit' form='user-form'>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {currentRow && (
        <>
          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                'The following task has been deleted:'
              )
            }}
            className='max-w-md'
            title={`Delete this task: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
