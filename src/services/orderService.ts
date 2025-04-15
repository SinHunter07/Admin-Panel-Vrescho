import { api } from './api'

export interface Order {
  id: string
  userId: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  createdAt: string
  updatedAt: string
}

export const orderService = {
  getOrders: async () => {
    return api.get(`/`)
  },
  
  
  updateOrderStatus: async (id: string, status: Order['status']) => {
    return api.patch(`/${id}/status`, { status })
  }
}
