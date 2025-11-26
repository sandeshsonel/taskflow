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
