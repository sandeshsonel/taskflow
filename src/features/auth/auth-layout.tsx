import { CircleCheckBig } from 'lucide-react'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='relative'>
      <div className='absolute top-4 left-3 mb-2 ml-2 flex items-center space-x-2'>
        <div className='flex h-8 w-8 items-center justify-center rounded-sm bg-black dark:bg-white'>
          <CircleCheckBig size={18} className='text-white dark:text-black' />
        </div>
        <div className='font-medium'>TaskFlow</div>
      </div>
      <div className='container grid h-svh max-w-none items-center justify-center'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          {children}
        </div>
      </div>
    </div>
  )
}
