import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-800 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link to="/dashboard" className="text-gray-400 hover:text-white">
              Dashboard
            </Link>
            <Link to="/users" className="text-gray-400 hover:text-white">
              Users
            </Link>
            <Link to="/orders" className="text-gray-400 hover:text-white">
              Orders
            </Link>
            <Link to="/inventory" className="text-gray-400 hover:text-white">
              Inventory
            </Link>
            <Link to="/coupons" className="text-gray-400 hover:text-white">
              Coupons
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-sm text-gray-400">
              &copy; {currentYear} TechserveNexus. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer