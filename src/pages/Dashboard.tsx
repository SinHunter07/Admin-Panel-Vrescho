import { useEffect, useState } from 'react'
import { userService } from '../services/userService'
import { orderService } from '../services/orderService'
import { Users, ShoppingCart, CreditCard, Tag, Package } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          userService.getUsers(),
          orderService.getOrders(),
        ])

        setStats({
          totalUsers: usersRes.data.total || 0,
          totalOrders: ordersRes.data.total || 0,
          totalRevenue: ordersRes.data.revenue || 0,
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      icon: CreditCard,
      color: 'bg-yellow-500',
    },
  ]

  const adminCards = [
    {
      title: 'Users',
      description: 'Manage user accounts and permissions',
      icon: Users,
      color: 'bg-blue-500',
      path: '/users',
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      icon: ShoppingCart,
      color: 'bg-green-500',
      path: '/orders',
    },
    {
      title: 'Inventory',
      description: 'Manage product inventory and stock',
      icon: Package,
      color: 'bg-purple-500',
      path: '/inventory',
    },
    {
      title: 'Coupons',
      description: 'Create and manage discount coupons',
      icon: Tag,
      color: 'bg-red-500',
      path: '/coupons',
    },
  ]

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-10 h-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-blue mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center p-5">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${stat.color} shadow-inner`}>
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-300">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-blue mb-4">Admin Functionality</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card, index) => (
          <Link 
            to={card.path} 
            key={index}
            className="rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color} shadow-inner`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">{card.title}</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-300">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
