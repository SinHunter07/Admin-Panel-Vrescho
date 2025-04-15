
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Users, ShoppingCart, Package, Tag, LogOut, User } from 'lucide-react'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  
  
  const navigation = [
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Coupons', href: '/coupons', icon: Tag },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0">
              <span className="text-xl font-bold">Admin Panel</span>
            </NavLink>
            
            
            <div className="ml-10">
              <div className="flex space-x-4">
                {isAuthenticated && navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                      isActive(item.href)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="mr-2 bg-gray-700 p-1 rounded-full">
                  <User className="h-6 w-6 text-gray-300" />
                </div>
                <span className="text-sm text-gray-300 mr-4 hidden md:block">
                  {user?.name || 'Admin'}
                </span>
                <button
                  onClick={logout}
                  className="bg-gray-700 p-2 rounded-md text-gray-300 hover:bg-gray-600 flex items-center"
                >
                  <LogOut className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:block text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar