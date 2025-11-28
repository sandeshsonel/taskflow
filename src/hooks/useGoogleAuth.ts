import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

const API = import.meta.env.VITE_API_URL

interface AuthResponse {
  user: {
    id: string
    email: string
    displayName?: string
    photoURL?: string
  }
  token: string
}

export const useGoogleAuth = () =>
  useMutation({
    mutationFn: async ({
      idToken,
      mode,
    }: {
      idToken: string
      mode: 'signup' | 'signin'
    }) => {
      const res = await axios.post<AuthResponse>(`${API}/${mode}/google`, {
        idToken,
        mode,
      })
      return res.data
    },
    onSuccess: (data) => {
      console.log('xoxo-success', data)
    },
    onError: (error) => {
      console.log('xoxo-error', error)
    },
  })
