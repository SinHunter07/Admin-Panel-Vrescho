import { api } from './api'

export interface ProductSize {
  size: string
  quantity: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  fakePrice?: number
  category: 'shoes' | 'slippers' | 'sandals' | 'other'
  images: string[]
  sizes: ProductSize[]
  isAvailable: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
}

export interface InventoryUpdate {
    quantity: number
    operation: 'add' | 'subtract' | 'set'
  }

export const inventoryService = {
  getProducts: async (params?: { page?: number; limit?: number; search?: string }) => {
    return api.get<ProductsResponse>('/products/', { params })
  },

  getProductById: async (id: string) => {
    return api.get<Product>(`/products/${id}`)
  },

  createProduct: async (data: Omit<Product, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    return api.post<Product>('/products/', data)
  },

  updateProduct: async (id: string, data: Partial<Omit<Product, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>>) => {
    return api.patch<Product>(`/products/${id}`, data)
  },

  deleteProduct: async (id: string) => {
    return api.delete(`/products/${id}`)
  },

  updateInventory: async (productId: string, data: InventoryUpdate) => {
    return api.patch(`/products/admin/${productId}/inventory`, data)
  }
}