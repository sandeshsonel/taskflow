import { type AdminUserUpdatePayload, type AdminUserPayload } from '@/types'
import { toast } from 'sonner'
import { api } from './api'

export const getAdminUsers = async () => {
  try {
    const response = await api.get('/api/v1/admin/users')
    return response.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/api/v1/admin/stats')
    return response.data?.data ?? {}
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const createUserService = async (payload: AdminUserPayload) => {
  try {
    const response = await api.post('/api/v1/admin/users', payload)
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const updateUserService = async (
  userId: string,
  payload: AdminUserUpdatePayload
) => {
  try {
    const response = await api.patch(
      `/api/v1/admin/users?userId=${userId}`,
      payload
    )
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}
export const deleteUserService = async (userId: string) => {
  try {
    const response = await api.delete(`/api/v1/admin/users?userId=${userId}`)
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}
