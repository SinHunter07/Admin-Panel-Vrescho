import { api } from './api'

export interface Coupon {
  id: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderValue?: number
  maxDiscountAmount?: number
  startDate: string
  endDate: string
  isActive: boolean
  usageLimit: number
  usedCount: number
  specificUser?: string
  usedBy?: Array<{
    user: string
    usedAt: string
  }>
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CouponsResponse {
  coupons: Coupon[];
  total: number;
}

export const couponService = {
  getCoupons: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<CouponsResponse>('/coupons/', { params })
    return response.data
  },
  
  getCouponById: async (id: string) => {
    return api.get<Coupon>(`/coupons/${id}`)
  },
  
  createCoupon: async (data: Omit<Coupon, 'id' | 'usedCount' | 'usedBy' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    return api.post<Coupon>('/coupons/', data)
  },
  
  updateCoupon: async (id: string, data: Partial<Omit<Coupon, 'id' | 'usedCount' | 'usedBy' | 'createdBy' | 'createdAt' | 'updatedAt'>>) => {
    return api.patch<Coupon>(`/coupons/${id}`, data)
  },
  
  deleteCoupon: async (id: string) => {
    return api.delete(`/coupons/${id}`)
  }
}


