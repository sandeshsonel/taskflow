export interface SignUpUserPayload {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface SignInUserPayload {
  email: string
  password: string
}

export interface AdminUserPayload {
  firstName: string
  lastName: string
  email: string
  role: string
  password: string
  confirmPassword: string
}
