import { toast } from 'sonner'
import { api } from './api'

export const createBugReport = async (formData: FormData) => {
  try {
    const response = await api.post('/api/v1/bug-report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}
