import { useMemo } from 'react'
import z from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { getAdminUsers } from '@/services/adminUser'
import { createTaskService, updateTaskService } from '@/services/taskService'
import { type RootState } from '@/store'
import { type TaskPayload } from '@/types'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { type Task } from '@/features/admin/tasks/data/schema'
import { SelectDropdown } from './select-dropdown'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Spinner } from './ui/spinner'
import { Textarea } from './ui/textarea'

const formSchema = z
  .object({
    title: z.string().min(1, 'Title is required.').max(50),
    description: z.string().min(1, 'Description is required.').max(200),
    status: z.enum(['pending', 'in-progress', 'completed']),
    priority: z.enum(['low', 'medium', 'high']),
    assignTo: z.string(),
    createdAt: z.string(),
    isEdit: z.boolean(),
    isAdmin: z.boolean(),
  })
  .refine(
    ({ isAdmin, assignTo }) => {
      if (!isAdmin) return true
      return assignTo.length > 0
    },
    {
      message: 'Please select a user to assign the task to.',
      path: ['assignTo'],
    }
  )

type UserForm = z.infer<typeof formSchema>

type PropTypes = {
  open: 'create' | 'update'
  setOpen: (str: 'create' | 'update' | 'delete' | 'import' | null) => void
  currentRow: Task | null
}

type MutationInput =
  | { isEdit: true; taskId: string; adminId?: string; payload: TaskPayload }
  | { isEdit: false; user: boolean; payload: TaskPayload }

const AddEditTask = ({ open, setOpen, currentRow }: PropTypes) => {
  const router = useRouter()
  const userDetails = useSelector((state: RootState) => state.auth?.user)
  const isEdit = open === 'update'
  const isAdmin = userDetails?.role === 'admin'

  const { queryClient } = router.options.context

  const mutation = useMutation({
    mutationFn: async (input: MutationInput) => {
      if (input.isEdit) {
        return updateTaskService(input.taskId, input.payload, input.adminId)
      }
      return createTaskService(input.payload, input.user)
    },
    onSuccess: () => handleSuccess(),
    onError: () => {},
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAdminUsers,
  })

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
          isAdmin,
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
              ? format(new Date(currentRow.createdAt), 'MMMM dd, yyyy')
              : format(new Date(), 'MMMM dd, yyyy'),
        }
      : {
          isEdit,
          isAdmin,
          title: '',
          description: '',
          status: 'pending',
          priority: 'low',
          assignTo: '',
          createdAt: format(new Date(), 'MMMM dd, yyyy'),
        },
  })

  const onSubmit = (values: UserForm) => {
    if (!mutation.isPending) {
      const { isEdit, ...rest } = values
      const updatePayload: TaskPayload = _.omit(rest, [
        'isEdit',
        'createdAt',
      ]) as TaskPayload
      if (isEdit) {
        mutation.mutate({
          isEdit,
          taskId: currentRow!._id,
          adminId: currentRow?.assignBy?._id,
          payload: updatePayload,
        })
      } else {
        mutation.mutate({
          isEdit: false,
          user: !isAdmin ? true : false,
          payload: updatePayload,
        })
      }
    }
  }

  const handleSuccess = () => {
    form.reset()
    setOpen(null)
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }

  const assignToOptions = useMemo(() => {
    return (
      data?.map?.((user: any) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.userId,
      })) ?? []
    )
  }, [data])

  return (
    <Dialog
      open={!!open}
      onOpenChange={() => {
        form.reset()
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
                {isAdmin && (
                  <FormField
                    control={form.control}
                    name='assignTo'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign To</FormLabel>
                        <SelectDropdown
                          disabled={isLoading}
                          className='w-full'
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Select dropdown'
                          items={assignToOptions}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
          <Button
            type='button'
            onClick={() => {
              form.reset()
              setOpen(null)
            }}
            variant='outline'
          >
            Cancel
          </Button>
          <Button disabled={mutation.isPending} type='submit' form='user-form'>
            {mutation.isPending && <Spinner />}
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditTask
