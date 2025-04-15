import { api } from './api'

export interface Coupon {
  id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase?: number
  maxUses?: number
  currentUses: number
  startsAt: string
  expiresAt: string
  status: 'active' | 'expired' | 'disabled'
  createdAt: string
  updatedAt: string
}

export const couponService = {
  getCoupons: async () => {
    return api.get(`/`)
  },
  
  getCouponById: async (id: string) => {
    return api.get(`/${id}`)
  },
  
  createCoupon: async (data: Omit<Coupon, 'id' | 'currentUses' | 'createdAt' | 'updatedAt'>) => {
    return api.post('/', data)
  },
  
  updateCoupon: async (id: string, data: Partial<Coupon>) => {
    return api.patch(`/${id}`, data)
  },
  
  deleteCoupon: async (id: string) => {
    return api.delete(`/${id}`)
  }
}


