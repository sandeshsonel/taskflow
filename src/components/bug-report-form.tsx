'use client'

import { useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createBugReport } from '@/services/bugReportService'
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
import { Spinner } from './ui/spinner'

const bugReportSchema = z
  .object({
    fullName: z.string().optional(),
    email: z.string().optional(),
    title: z
      .string()
      .nonempty('Bug title is required.')
      .min(3, 'Bug title must be at least 3 characters.'),

    description: z
      .string()
      .nonempty('Bug description is required.')
      .min(10, 'Bug description must contain at least 10 characters.'),
    attachments: z
      .array(
        z
          .instanceof(File)
          .refine(
            (file) =>
              ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(
                file.type
              ),
            'File must be PNG, JPG, or WEBP'
          )
          .refine(
            (file) => file.size <= 1 * 1024 * 1024,
            'File too large (max 1MB)'
          )
      )
      .max(5, 'You can upload a maximum of 5 files.')
      .optional(),
  })
  .refine(
    ({ fullName }) => {
      if (fullName && fullName?.length > 0) {
        return /^[a-zA-Z\s]+$/.test(fullName)
      }
      return true
    },
    {
      message: 'Please enter a valid name.',
      path: ['fullName'],
    }
  )
  .refine(
    ({ email }) => {
      if (email && email?.length > 0) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      }
      return true
    },
    {
      message: 'Please enter a valid email.',
      path: ['email'],
    }
  )

type BugReportValues = z.infer<typeof bugReportSchema>

export default function BugReportForm() {
  const { mutate, isPending } = useMutation({
    mutationFn: createBugReport,
    onSuccess: () => handleSuccess(),
  })

  const form = useForm<BugReportValues>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      fullName: '',
      email: '',
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
    if (isPending) return

    const formData = new FormData()

    Object.keys(values).forEach((key) => {
      if (key === 'attachments') {
        ;(values.attachments ?? []).forEach((file) => {
          formData.append('files', file)
        })
      } else {
        formData.append(key, (values as Record<string, any>)[key])
      }
    })

    mutate(formData)
  }

  const handleSuccess = () => {
    form.reset()
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
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name (optional)</FormLabel>
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
                <FormLabel>Email (optional)</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='johndoe@example.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    accept='.png,.jpg,.jpeg,.webp'
                    multiple
                    onChange={handleFilesSelected}
                    className='cursor-pointer'
                    max={5}
                  />
                </FormControl>

                <p className='text-muted-foreground text-xs'>
                  PNG, JPG, JPEG or WEBP – Max 1MB each
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
          <div className='ml-auto flex items-end justify-end'>
            <Button type='submit' size='sm' disabled={isPending}>
              {isPending && <Spinner />}
              Submit Bug
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
