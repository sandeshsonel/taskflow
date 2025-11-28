import { store } from '@/store'
import { type TaskPayload } from '@/types'
import { toast } from 'sonner'
import { api } from './api'

export const getTasksList = async (page: number) => {
  const isAdmin = store.getState().auth.user?.role === 'admin'
  try {
    const response = await api.get(
      `/api/v1/tasks?page=${page}&isAdmin=${isAdmin}`
    )
    return response.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const createTaskService = async (
  payload: TaskPayload,
  user: boolean
) => {
  try {
    const params = new URLSearchParams()
    if (user) params.append('adminUser', user.toString())

    const response = await api.post(
      `/api/v1/tasks?${params.toString()}`,
      payload
    )
    return response.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const updateTaskService = async (
  taskId: string,
  payload: TaskPayload,
  adminId?: string
) => {
  try {
    const params = new URLSearchParams()

    if (taskId) params.append('taskId', taskId)
    if (adminId) params.append('adminId', adminId)
    const response = await api.patch(
      `/api/v1/tasks?${params.toString()}`,
      payload
    )
    return response.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const deleteTaskService = async (taskId: string) => {
  try {
    const response = await api.delete(`/api/v1/tasks?taskId=${taskId}`)
    return response.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}
