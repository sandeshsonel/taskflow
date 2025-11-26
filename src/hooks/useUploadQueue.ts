import { useState, useCallback, useRef } from 'react'
import { type RootState } from '@/store'
import { useSelector } from 'react-redux'

export interface UploadFile {
  id: string
  file: File
  progress: number
  status:
    | 'queued'
    | 'uploading'
    | 'paused'
    | 'completed'
    | 'failed'
    | 'cancelled'
  error?: string
  videoId?: string
}

interface UploadQueueOptions {
  maxConcurrent?: number
  onProgress?: (id: string, progress: number) => void
  onStatusChange?: (id: string, status: UploadFile['status']) => void
}

const API_URL = import.meta.env.VITE_API_URL

export function useUploadQueue(options: UploadQueueOptions = {}) {
  const { maxConcurrent = 3, onProgress, onStatusChange } = options
  const [uploads, setUploads] = useState<UploadFile[]>([])
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())
  const token = useSelector((state: RootState) => state.auth?.token)

  const addFiles = useCallback((files: File[]) => {
    const newUploads = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      progress: 0,
      status: 'queued' as const,
    }))

    setUploads((prev) => [...prev, ...newUploads])
    return newUploads
  }, [])

  const updateUpload = useCallback(
    (id: string, updates: Partial<UploadFile>) => {
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
      )
    },
    []
  )

  const uploadFile = useCallback(
    async (uploadFile: UploadFile) => {
      const { id, file } = uploadFile

      try {
        updateUpload(id, { status: 'uploading' })
        onStatusChange?.(id, 'uploading')

        const formData = new FormData()
        formData.append('files', file)
        formData.append('id', id)

        const abortController = new AbortController()
        abortControllersRef.current.set(id, abortController)

        const xhr = new XMLHttpRequest()

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            updateUpload(id, { progress })
            onProgress?.(id, progress)
          }
        })

        // Handle completion
        await new Promise<void>((resolve, reject) => {
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText)
              console.log('dodo', response)
              updateUpload(id, {
                status: 'completed',
                progress: 100,
                videoId: id,
              })
              onStatusChange?.(id, 'completed')
              resolve()
            } else {
              const error = 'Upload failed'
              updateUpload(id, { status: 'failed', error })
              onStatusChange?.(id, 'failed')
              reject(new Error(error))
            }
          })

          xhr.addEventListener('error', () => {
            const error = 'Network error'
            updateUpload(id, { status: 'failed', error })
            onStatusChange?.(id, 'failed')
            reject(new Error(error))
          })

          xhr.addEventListener('abort', () => {
            updateUpload(id, { status: 'cancelled' })
            onStatusChange?.(id, 'cancelled')
            resolve()
          })

          const URL = `${API_URL}/videos/upload/${id}`
          xhr.open('POST', URL)
          xhr.setRequestHeader('Authorization', `Bearer ${token}`)
          xhr.send(formData)
        })

        abortControllersRef.current.delete(id)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed'
        updateUpload(id, { status: 'failed', error: errorMessage })
        onStatusChange?.(id, 'failed')
      }
    },
    [updateUpload, onProgress, onStatusChange, token]
  )

  const pauseUpload = useCallback(
    async (id: string) => {
      const controller = abortControllersRef.current.get(id)
      if (controller) {
        controller.abort()
      }

      const URL = `${API_URL}/uploads/${id}/pause`

      await fetch(URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      // TODO: Call pause endpoint on server
      updateUpload(id, { status: 'paused' })
    },
    [updateUpload, token, uploads]
  )

  const resumeUpload = useCallback(
    async (id: string) => {
      const upload = uploads.find((u) => u.id === id)
      if (!upload) return

      const URL = `${API_URL}/uploads/${id}/resume`

      await fetch(URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      // TODO: Call resume endpoint on server
      // For now, restart the upload
      await uploadFile(upload)
    },
    [uploads, uploadFile, token]
  )

  const cancelUpload = useCallback(
    async (id: string) => {
      const controller = abortControllersRef.current.get(id)
      if (controller) {
        controller.abort()
      }

      const upload = uploads.find((u) => u.id === id)
      if (upload?.videoId) {
        try {
          const URL = `${API_URL}/uploads/${id}/cancel`

          await fetch(URL, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          })
        } catch (error) {
          console.error('Failed to cancel upload on server:', error)
        }
      }

      updateUpload(id, { status: 'cancelled' })
      abortControllersRef.current.delete(id)
    },
    [uploads, updateUpload, token]
  )

  const removeUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
    abortControllersRef.current.delete(id)
  }, [])

  const startUploads = useCallback(async () => {
    const queuedUploads = uploads.filter((u) => u.status === 'queued')

    for (let i = 0; i < queuedUploads.length; i += maxConcurrent) {
      const batch = queuedUploads.slice(i, i + maxConcurrent)
      await Promise.all(batch.map((u) => uploadFile(u)))
    }
  }, [uploads, maxConcurrent, uploadFile])

  const clear = useCallback(() => {
    setUploads([])
    abortControllersRef.current.clear()
  }, [])

  return {
    uploads,
    addFiles,
    uploadFile,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    removeUpload,
    startUploads,
    updateUpload,
    clear,
  }
}
