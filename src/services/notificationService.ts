import { type NotificationUpdatePayload } from '@/types'
import { toast } from 'sonner'
import { api } from './api'

export const getNotifications = async () => {
  try {
    const response = await api.get('/api/v1/notifications')
    return response.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const updateNotification = async (
  payload: NotificationUpdatePayload
) => {
  try {
    const response = await api.post('/api/v1/notifications', payload)
    return response.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}
