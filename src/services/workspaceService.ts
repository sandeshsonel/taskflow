import { toast } from 'sonner'
import { type CreateWorkspaceFormData } from '@/components/create-workspace'
import { api } from './api'

export const getWorkspaceList = async () => {
  try {
    const response = await api.get('/api/v1/workspace')
    return response?.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const createWorkspace = async (data: CreateWorkspaceFormData) => {
  try {
    const response = await api.post('/api/v1/workspace', data)
    return response?.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const switchWorkspace = async (workspaceId: string) => {
  try {
    const response = await api.post(`/api/v1/workspace/switch/${workspaceId}`)
    return response?.data?.data ?? []
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}
