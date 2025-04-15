import { api } from './api'

export interface User {
  id: string
  name: string
  email: string
  status: 'active' | 'blocked'
  createdAt: string
  updatedAt: string
}

export const userService = {
  getUsers: async () => {
    return api.get(`/admin`)
  },
  
  blockUser: async (id: string) => {
    return api.patch(`/admin/${id}/block`)
  },
  
  deleteUser: async (id: string) => {
    return api.delete(`/admin/${id}`)
  }
}
