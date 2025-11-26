/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  fullName?: string
  photoURL?: string
}

interface AuthState {
  user: User | null
  token: string | null
}

const initialState: AuthState = {
  token: null,
  user: null,
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const exchangeFirebaseToken = createAsyncThunk(
  'auth/exchangeFirebaseToken',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/google`,
        { idToken },
        { withCredentials: true }
      )
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Auth failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
    },
    setUserDetails(state, action: PayloadAction<AuthState>) {
      state = action.payload
      return state
    },
    updateUserDetails(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const { logout, setUserDetails, updateUserDetails } = authSlice.actions
export default authSlice.reducer
