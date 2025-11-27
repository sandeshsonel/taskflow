import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { signInUser, signInWithGoogle } from '@/services/userService'
import { setUserDetails } from '@/store/slices/authSlice'
import { signInWithPopup } from 'firebase/auth'
import { Loader2, LogIn } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  auth as googleAuthConfig,
  googleProvider,
} from '@/utils/firebaseConfig'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
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

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const mutationGoogle = useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: (data) => handleSuccessGoogle(data),
    onError: () => {},
  })
  const mutation = useMutation({
    mutationFn: signInUser,
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

    console.log({ userDetails })
    dispatch(setUserDetails(userDetails))
    toast.success('Signed up successfully!')
    navigate({ to: user.role === 'admin' ? '/admin/dashboard' : '/' })
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutation.mutate(data)
  }

  const handleSignInGoogle = async () => {
    try {
      const result = await signInWithPopup(googleAuthConfig, googleProvider)
      const idToken = await result.user.getIdToken(true)
      await mutationGoogle.mutate(idToken)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to sign in with Google.')
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
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className='animate-spin' />
          ) : (
            <LogIn />
          )}
          Sign in
        </Button>

        <Button
          variant='outline'
          className='w-full'
          type='button'
          disabled={mutation.isPending || mutationGoogle.isPending}
          onClick={handleSignInGoogle}
        >
          Sign in with Google
        </Button>

        <CardFooter>
          <p className='text-muted-foreground mx-auto px-8 text-center text-sm text-balance'>
            Don't have an account?&nbsp;
            <Link
              to='/sign-up'
              className='hover:text-primary underline underline-offset-4'
            >
              Sign up
            </Link>
            .
          </p>
        </CardFooter>
      </form>
    </Form>
  )
}
