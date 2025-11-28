import { type TaskPayload } from '@/types'
import { toast } from 'sonner'
import { api } from './api'

export const getTasksList = async (page: number) => {
  try {
    const response = await api.get(`/api/v1/tasks?page=${page}`)
    return response.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const createTaskService = async (payload: TaskPayload) => {
  try {
    const response = await api.post('/api/v1/tasks', payload)
    return response.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const updateTaskService = async (
  taskId: string,
  payload: TaskPayload
) => {
  try {
    const response = await api.patch(`/api/v1/tasks?taskId=${taskId}`, payload)
    return response.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const deleteTaskService = async (taskId: string) => {
  try {
    // const response = await api.delete(`/api/v1/admin/users?userId=${userId}`)

    const response = await api.delete(`/api/v1/tasks/${taskId}`)
    return response.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}
