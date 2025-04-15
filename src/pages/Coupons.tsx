import { useState, useEffect, Fragment } from 'react'
import { couponService, Coupon } from '../services/couponService'
import { Trash2, Plus, Edit } from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minPurchase: 0,
    maxUses: 0,
    startsAt: new Date().toISOString().split('T')[0],
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active'
  })

  const fetchCoupons = async (page = 1) => {
    try {
      setLoading(true)
      const response = await couponService.getCoupons()
      setCoupons(response.data.coupons)
      setTotalPages(Math.ceil(response.data.total / 10) || 1)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCoupons(1)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        setIsDeleting(id)
        await couponService.deleteCoupon(id)
        setCoupons(coupons.filter(coupon => coupon.id !== id))
      } catch (error) {
        console.error('Error deleting coupon:', error)
        alert('Failed to delete coupon')
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const openCreateModal = () => {
    setEditingCoupon(null)
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      minPurchase: 0,
      maxUses: 0,
      startsAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active'
    })
    setIsModalOpen(true)
  }

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase || 0,
      maxUses: coupon.maxUses || 0,
      startsAt: new Date(coupon.startsAt).toISOString().split('T')[0],
      expiresAt: new Date(coupon.expiresAt).toISOString().split('T')[0],
      status: coupon.status
    })
    setIsModalOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSaving(true)
      const payload = {
        ...formData,
        discountType: formData.discountType as 'percentage' | 'fixed',
        status: formData.status as 'active' | 'expired' | 'disabled',
        minPurchase: formData.minPurchase || undefined,
        maxUses: formData.maxUses || undefined
      }
      if (editingCoupon) {
        await couponService.updateCoupon(editingCoupon.id, payload)
      } else {
        await couponService.createCoupon(payload)
      }
      await fetchCoupons(currentPage)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving coupon:', error)
      alert(`Failed to ${editingCoupon ? 'update' : 'create'} coupon`)
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString()

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">

      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search coupons..."
              className="block w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-r-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
            >
              Search
            </button>
          </form>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Coupon
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Code', 'Discount', 'Validity', 'Status', 'Uses', 'Actions'].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No coupons found
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : `$${coupon.discountValue.toFixed(2)}`}
                    {coupon.minPurchase && ` (Min: $${coupon.minPurchase.toFixed(2)})`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(coupon.startsAt)} - {formatDate(coupon.expiresAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        coupon.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : coupon.status === 'expired'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.currentUses} {coupon.maxUses ? `/ ${coupon.maxUses}` : ''}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => openEditModal(coupon)}
                      className="mr-2 text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      disabled={isDeleting === coupon.id}
                      className="text-red-600 hover:text-red-900"
                    >
                      {isDeleting === coupon.id ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"></span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

     
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog className="relative z-10" onClose={setIsModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {[
                    { label: 'Code', name: 'code', type: 'text' },
                    { label: 'Discount Value', name: 'discountValue', type: 'number' },
                    { label: 'Min Purchase', name: 'minPurchase', type: 'number' },
                    { label: 'Max Uses', name: 'maxUses', type: 'number' },
                    { label: 'Starts At', name: 'startsAt', type: 'date' },
                    { label: 'Expires At', name: 'expiresAt', type: 'date' }
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name as keyof typeof formData]}
                        onChange={handleInputChange}
                        required={name === 'code' || name === 'discountValue'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
                    >
                      {isSaving ? 'Saving...' : editingCoupon ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default Coupons
