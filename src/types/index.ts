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

export interface AdminUserUpdatePayload {
  firstName: string
  lastName: string
  role: string
}

export interface NotificationUpdatePayload {
  notificationId: string
  actionType: string
  actionData: any
}

export interface TaskPayload {
  title: string
  description: string
  status: string
  priority: string
  assignTo: string
}
