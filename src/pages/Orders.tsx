import { useState, useEffect } from 'react'
import { orderService, Order } from '../services/orderService'
import { Check, Truck, Package, Clock, XCircle, Loader2 } from 'lucide-react'

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true)
      const response = await orderService.getOrders()
      setOrders(response.data.orders)
      setTotalPages(Math.ceil(response.data.total / 10) || 1)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrders()
  }

  const handleUpdateStatus = async (id: string, status: Order['status']) => {
    try {
      setUpdatingOrderId(id)
      await orderService.updateOrderStatus(id, status)
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order))
      )
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const getStatusBadge = (status: Order['status']) => {
    const statusMap = {
      pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Processing', icon: Package, color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Shipped', icon: Truck, color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Delivered', icon: Check, color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800' },
    }

    const { label, icon: Icon, color } = statusMap[status]
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    )
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <form onSubmit={handleSearch} className="flex w-full max-w-sm rounded-md shadow-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID or User ID"
            className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="rounded-r-md bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Status', 'Total', 'Date', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-indigo-500" />
                    <p className="text-sm text-gray-500">Loading orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      #{order.id.substring(0, 8)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.userId}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">{getStatusBadge(order.status)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      {updatingOrderId === order.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      ) : (
                        <select
                          className="rounded-md border border-gray-300 bg-white py-1 px-2 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                          disabled={['delivered', 'cancelled'].includes(order.status)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
            <p className="text-sm text-gray-600">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchOrders(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-md border bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() => fetchOrders(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-md border bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
