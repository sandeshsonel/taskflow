import axios from 'axios'
import { store } from '@/store/index'

export const api = axios.create({
  baseURL: 'http://localhost:8000',
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
