import { toast } from 'sonner'
import { api } from './api'

export const getAllVideos = async () => {
  try {
    const response = await api.get('/api/v1/videos')
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const deleteVideoById = async (videoId: string) => {
  try {
    const response = await api.delete(`/api/v1/videos/${videoId}`)
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}
