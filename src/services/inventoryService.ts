import { api } from './api'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  size: number
  category: string
  images: string[]
  status: 'active' | 'inactive'
  createdAt: string
  inventory?: number 
}

export interface InventoryUpdate {
    quantity: number
    operation: 'add' | 'subtract' | 'set'
  }

export const inventoryService = {
  
  
  
  createProduct: async (data: Omit<Product, 'id' | 'createdAt'>) => {
    return api.post('/admin/add', data)
  },

  updateInventory: async (productId: string, data: InventoryUpdate) => {
    return api.patch(`/admin/${productId}/inventory`, data)
  },
  

  updateProduct: async (id: string, data: Partial<Product>) => {
    return api.patch(`/admin/${id}`, data)
  },
  
  deleteProduct: async (id: string) => {
    return api.delete(`/admin/${id}`)
  }
  


  
}