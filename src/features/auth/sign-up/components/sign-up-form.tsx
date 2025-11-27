import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { signUpUser, signUpWithGoogle } from '@/services/userService'
import { setUserDetails } from '@/store/slices/authSlice'
import { signInWithPopup } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  auth as googleAuthConfig,
  googleProvider,
} from '@/utils/firebaseConfig'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { RoleToggle } from '@/components/role-toggle'

const formSchema = z
  .object({
    name: z.string().min(5, 'Please enter your name'),
    email: z.email({
      error: (iss) => (!iss.input ? 'Please enter your email' : undefined),
    }),
    password: z
      .string()
      .min(1, 'Please enter your password')
      .min(7, 'Password must be at least 7 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['admin', 'user']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof formSchema>

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const mutationGoogle = useMutation({
    mutationFn: signUpWithGoogle,
    onSuccess: (data) => handleSuccessGoogle(data),
    onError: () => {},
  })
  const mutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => handleSuccess(data),
    onError: () => {},
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSuccessGoogle = (user: any) => {
    const userDetails = {
      token: user.token,
      user: user.user,
    }
    dispatch(setUserDetails(userDetails))
    toast.success('Signed up successfully!')
    navigate({ to: '/' })
  }

  const handleSuccess = (user: any) => {
    const userDetails = {
      token: user.token,
      user: user.user,
    }
    dispatch(setUserDetails(userDetails))
    toast.success('Signed up successfully!')
    navigate({ to: '/' })
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
    },
  })

  function onSubmit(data: FormValues) {
    mutation.mutate(data)
  }

  const handleSignUpGoogle = async () => {
    try {
      const result = await signInWithPopup(googleAuthConfig, googleProvider)
      const idToken = await result.user.getIdToken(true)
      mutationGoogle.mutate({ idToken, role: form.getValues('role') })
    } catch (error) {
      console.error('Google sign-up error:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder='John Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Register as</FormLabel>
              <FormControl>
                <RoleToggle value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={mutation.isPending}>
          Create Account
        </Button>

        <Button
          variant='outline'
          className='w-full'
          type='button'
          disabled={mutationGoogle.isPending || mutation.isPending}
          onClick={handleSignUpGoogle}
        >
          Sign up with Google
        </Button>
      </form>
    </Form>
  )
}
