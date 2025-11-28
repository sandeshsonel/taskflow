import axios from 'axios'
import { store } from '@/store/index'

const URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL_PROD
  : import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: URL.replace('/api/v1', ''),
  headers: { 'Content-Type': 'application/json' },
})

// ✅ REQUEST INTERCEPTOR — add token from Redux
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ✅ RESPONSE INTERCEPTOR (optional global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized - Token expired?')
      // Optionally dispatch logout
      // store.dispatch(clearToken());
    }

    return Promise.reject(error)
  }
)
