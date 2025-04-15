import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import AdminLayout from './layout/AdminLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Users = lazy(() => import('./pages/Users'))
const Orders = lazy(() => import('./pages/Orders'))
const Inventory = lazy(() => import('./pages/Inventory'))
const Coupons = lazy(() => import('./pages/Coupons'))


const AppNavbar = () => <Navbar />
const AppFooter = () => <Footer />

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <AppNavbar />
        <div className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              {/* <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}> */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
              
                <Route path="/orders" element={<Orders />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/coupons" element={<Coupons />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* </Route> */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </div>
        <AppFooter />
      </div>
    </AuthProvider>
  )
}

export default App