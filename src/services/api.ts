import axios from 'axios'
import { store } from '@/store/index'
import { toast } from 'sonner'

const URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL_PROD
  : import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: URL.replace('/api/v1', ''),
  headers: { 'Content-Type': 'application/json' },
})

const pendingRequests: Record<string, NodeJS.Timeout> = {}

// ✅ REQUEST INTERCEPTOR — add token from Redux
api.interceptors.request.use(
  async (config) => {
    const token = store.getState().auth.token
    const requestId = config.url || Math.random().toString()

    pendingRequests[requestId] = setTimeout(() => {
      toast.warning(
        'Server was inactive and is spinning up now. Loading might take a moment.'
      )
    }, 5000)
    ;(config as any)._requestId = requestId

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ✅ RESPONSE INTERCEPTOR (optional global error handling)
api.interceptors.response.use(
  (response) => {
    const requestId = (response.config as any)._requestId
    clearTimeout(pendingRequests[requestId])
    delete pendingRequests[requestId]
    return response
  },
  (error) => {
    const requestId = (error.config as any)?._requestId
    if (requestId) {
      clearTimeout(pendingRequests[requestId])
      delete pendingRequests[requestId]
    }
    if (error.response?.status === 401) {
      console.warn('Unauthorized - Token expired?')
      // Optionally dispatch logout
      // store.dispatch(clearToken());
    }

    return Promise.reject(error)
  }
)
