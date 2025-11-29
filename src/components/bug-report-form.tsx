// components/BugReportForm.tsx
'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Textarea } from '@/components/ui/textarea'

// components/BugReportForm.tsx

// components/BugReportForm.tsx

// components/BugReportForm.tsx

const bugReportSchema = z.object({
  title: z.string().min(3, 'Bug title is required'),
  description: z.string().min(10, 'Description is required'),
  attachment: z
    .instanceof(File)
    .optional()
    .refine(
      (file) =>
        !file ||
        ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'].includes(
          file.type
        ),
      'File must be PNG, JPG, GIF, or MP4'
    )
    .refine(
      (file) => !file || file.size <= 10 * 1024 * 1024,
      'File is too large (max 10MB)'
    ),
})

type BugReportValues = z.infer<typeof bugReportSchema>

export default function BugReportForm() {
  const form = useForm<BugReportValues>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const onSubmit = (values: BugReportValues) => {
    console.log('Submitted bug report:', values)
  }

  return (
    <div className='mx-auto max-w-xl py-10'>
      <h1 className='mb-2 text-center text-3xl font-semibold'>Found a Bug?</h1>
      <p className='text-muted-foreground mb-8 text-center'>
        Let us know. We appreciate your help in making our app better!
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6 rounded-xl border bg-white p-6 shadow-sm'
        >
          {/* Bug Title */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bug Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 'Submit button is not working on the login page'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Please describe the issue in detail. What did you do? What did you expect to happen? What actually happened?'
                    className='min-h-[120px]'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Attachment */}
          <FormField
            control={form.control}
            name='attachment'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attachment (optional)</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='.png,.jpg,.jpeg,.gif,.mp4'
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <p className='text-muted-foreground text-sm'>
                  PNG, JPG, GIF or MP4 (MAX. 10MB)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button type='submit' className='text-md h-12 w-full'>
            Submit Bug
          </Button>
        </form>
      </Form>
    </div>
  )
}
