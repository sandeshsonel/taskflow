import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { createWorkspace } from '@/services/workspaceService'

// Zod validation schema
const createWorkspaceSchema = z.object({
  name: z.string()
    .min(1, 'Workspace name is required')
    .min(3, 'Workspace name must be at least 3 characters')
    .max(50, 'Workspace name must be less than 50 characters'),
  description: z.string()
    .min(1, 'Workspace description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  users: z.array(z.string().email('Invalid email format')).optional(),
})

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>

type PropsType = {
  handleClose: () => void
}

const CreateWorkspace = (props: PropsType) => {
  const { handleClose } = props
  const [inviteValue, setInviteValue] = useState("")
  const [users, setMembers] = useState<string[]>([])
  const [emailError, setEmailError] = useState<string>("")

   const mutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => handleSuccess(data),
    onError: () => {},
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      users: [],
    }
  })

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailSchema = z.string().email()
    const validationResult = emailSchema.safeParse(email)
    return validationResult.success
  }

  const addMember = () => {
    const email = inviteValue.trim()
    setEmailError("")

    if (!email) {
      setEmailError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    if (users.includes(email)) {
      setEmailError("This email is already added")
      return
    }

    if (users.length >= 10) {
      setEmailError("Maximum 10 users allowed")
      return
    }

    // Add member to the list
    const updatedMembers = [...users, email]
    setMembers(updatedMembers)
    setValue('users', updatedMembers, { shouldValidate: true })
    setInviteValue("")
  }

  const removeMember = (email: string) => {
    const updatedMembers = users.filter((m) => m !== email)
    setMembers(updatedMembers)
    setValue('users', updatedMembers, { shouldValidate: true })
  }

  const handleInviteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addMember()
    }
  }

  const onSubmit = async (data: CreateWorkspaceFormData) => {
    if(mutation.isPending) return
    try {
      // Prepare the form data with users
      const formData = {
        ...data,
        users,
      }

      console.log('Form submitted:', formData)
      
   await mutation.mutate(formData)
    } catch (error) {
      console.error('Error creating workspace:', error)
    }
  }

  const handleSuccess  = (data: any) => {
    console.log("success", {data})
    // toast.success()
    reset()
      setMembers([])
      setEmailError("")
      handleClose()
  }
 
  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create new Workspace</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4">
            {/* Workspace Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="name">Workspace Name *</Label>
              <Input 
                id="name"
                placeholder='e.g. Marketing Campaign'
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Workspace Description Field */}
            <div className="grid gap-2">
              <Label htmlFor="description">Workspace Description *</Label>
              <Textarea 
                id="description"
                className={`resize-none ${errors.description ? 'border-red-500' : ''}`}
                placeholder='Describe the purpose of this workspace.'
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Invite Members Field */}
            <div className="grid gap-2">
              <Label htmlFor="invite">
                Invite Members 
                <span className="text-sm text-gray-500 ml-1">
                  (Optional, max 10)
                </span>
              </Label>
              
              <div className="flex gap-2">
                <Input
                  id="invite"
                  type="email"
                  placeholder="Enter email address"
                  value={inviteValue}
                  onChange={(e) => {
                    setInviteValue(e.target.value)
                    setEmailError("") // Clear error when user types
                  }}
                  onKeyDown={handleInviteKeyDown}
                  className={emailError ? 'border-red-500' : ''}
                />
                <Button 
                  type="button" 
                  onClick={addMember}
                  variant="outline"
                  disabled={!inviteValue.trim()}
                >
                  Add
                </Button>
              </div>

              {/* Email validation error */}
              {emailError && (
                <p className="text-sm text-red-600 mt-1">{emailError}</p>
              )}

              {/* Members counter */}
              {users.length > 0 && (
                <p className="text-sm text-gray-500">
                  {users.length} member{users.length !== 1 ? 's' : ''} added
                  {users.length >= 10 && ' (Maximum reached)'}
                </p>
              )}

              {/* Members List */}
              {users.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md bg-gray-50">
                  {users.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-1 rounded-full bg-[#EEF3FF] px-3 py-1 text-sm text-blue-600"
                    >
                      {email}
                      <button 
                        type="button"
                        onClick={() => removeMember(email)}
                        aria-label={`Remove ${email}`}
                        className="hover:bg-blue-100 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3 text-blue-500 hover:text-blue-700" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Form-level users validation error */}
              {errors.users && (
                <p className="text-sm text-red-600 mt-1">{errors.users.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  reset()
                  setMembers([])
                  setEmailError("")
                  handleClose()
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Creating...' : 'Create Workspace'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspace