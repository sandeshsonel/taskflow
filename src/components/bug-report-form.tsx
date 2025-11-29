'use client'

import { useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
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

const bugReportSchema = z.object({
  title: z.string().min(3, 'Bug title is required'),
  description: z.string().min(10, 'Description is required'),
  attachments: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) =>
            ['image/png', 'image/jpeg', 'image/gif'].includes(file.type),
          'File must be PNG, JPG, GIF'
        )
        .refine(
          (file) => file.size <= 1 * 1024 * 1024,
          'File too large (max 1MB)'
        )
    )
    .optional(),
})

type BugReportValues = z.infer<typeof bugReportSchema>

export default function BugReportForm() {
  const form = useForm<BugReportValues>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      title: '',
      description: '',
      attachments: [],
    },
  })

  const attachments = form.watch('attachments') || []
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : []

    const updated = [...attachments, ...selectedFiles]
    form.setValue('attachments', updated, { shouldValidate: true })

    // ✅ Reset file input so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    const updated = attachments.filter((_, i) => i !== index)
    form.setValue('attachments', updated, { shouldValidate: true })
  }

  const onSubmit = (values: BugReportValues) => {
    toast.success('Bug report submitted successfully!')
    form.reset()
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
          className='space-y-6 rounded-xl border p-6 shadow-sm'
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
                    placeholder="e.g., 'Submit button not working on login'"
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
                    placeholder='Describe what happened...'
                    className='min-h-[120px]'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Attachments */}
          <FormField
            control={form.control}
            name='attachments'
            render={() => (
              <FormItem>
                <FormLabel>Attachments (optional)</FormLabel>
                <FormControl>
                  <Input
                    ref={fileInputRef}
                    type='file'
                    accept='.png,.jpg,.jpeg,.gif'
                    multiple
                    onChange={handleFilesSelected}
                    className='cursor-pointer'
                  />
                </FormControl>

                <p className='text-muted-foreground text-xs'>
                  PNG, JPG, GIF – Max 1MB each
                </p>

                {/* File List */}
                {attachments.length > 0 && (
                  <ul className='mt-3 space-y-2 text-sm'>
                    {attachments.map((file, idx) => (
                      <li
                        key={idx}
                        className='flex items-center justify-between rounded border p-2'
                      >
                        {file.name}
                        <Button
                          type='button'
                          size='sm'
                          variant='ghost'
                          className='text-xs text-red-500 hover:underline'
                          onClick={() => removeFile(idx)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type='submit' className='ml-auto flow-root' size='sm'>
            Submit Bug
          </Button>
        </form>
      </Form>
    </div>
  )
}
