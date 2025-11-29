import { store } from '@/store'
import { logout } from '@/store/slices/authSlice'
import { toast } from 'sonner'
import type { SignInUserPayload, SignUpUserPayload } from '../types'
import { api } from './api'

export const getProfileDetails = async () => {
  try {
    const response = await api.get('/api/v1/profile-details')
    return response.data
  } catch (error: any) {
    if (error.response.status === 401) {
      setTimeout(() => {
        store.dispatch(logout())
        localStorage.clear()
        const currentPath = location.href
        window.location.href = `/sign-in?redirect=${currentPath}`
      }, 1200)
    }
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const signUpUser = async (data: SignUpUserPayload) => {
  try {
    const response = await api.post('/api/v1/signup', data)
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const signInUser = async (data: SignInUserPayload) => {
  try {
    const response = await api.post('/api/v1/signin', data)
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

export const signUpWithGoogle = async ({
  idToken,
  role,
}: {
  idToken: string
  role: string
}) => {
  try {
    const response = await api.post('/api/v1/signup/google', { idToken, role })
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.error)
    throw new Error(error.response.data.error)
  }
}

export const signInWithGoogle = async (idToken: string) => {
  try {
    const response = await api.post('/api/v1/signin/google', { idToken })
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.error)
    throw new Error(error.response.data.error)
  }
}
