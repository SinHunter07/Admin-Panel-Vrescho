import { useState, useEffect } from 'react'
import { userService, User } from '../services/userService'
import { Trash2, UserX, UserCheck, Loader2 } from 'lucide-react'

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isBlocking, setIsBlocking] = useState<string | null>(null)

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true)
      const response = await userService.getUsers()
      setUsers(response.data.users)
      setTotalPages(Math.ceil(response.data.total / 10) || 1)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(1)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setIsDeleting(id)
        await userService.deleteUser(id)
        setUsers(users.filter(user => user.id !== id))
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Failed to delete user')
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const handleToggleBlock = async (id: string, currentStatus: string) => {
    try {
      setIsBlocking(id)
      if (currentStatus === 'active') {
        await userService.blockUser(id)
      } else {
        await userService.unblockUser(id)
      }
      setUsers(users.map(user => 
        user.id === id 
          ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' } 
          : user
      ))
    } catch (error) {
      console.error('Error toggling user block status:', error)
      alert('Failed to update user status')
    } finally {
      setIsBlocking(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <form onSubmit={handleSearch} className="mt-4 sm:mt-0 flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="rounded-l-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="rounded-r-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Search
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Created</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-indigo-600" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleBlock(user.id, user.status)}
                          disabled={isBlocking === user.id}
                          className={`rounded-md p-1.5 ${
                            user.status === 'active'
                              ? 'text-yellow-600 hover:bg-yellow-100'
                              : 'text-green-600 hover:bg-green-100'
                          }`}
                          title={user.status === 'active' ? 'Block user' : 'Unblock user'}
                        >
                          {isBlocking === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : user.status === 'active' ? (
                            <UserX size={18} />
                          ) : (
                            <UserCheck size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={isDeleting === user.id}
                          className="text-red-600 hover:bg-red-100 rounded-md p-1.5"
                          title="Delete user"
                        >
                          {isDeleting === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center border-t px-4 py-3 bg-gray-50 text-sm text-gray-700">
            <p>
              Page <span className="font-semibold">{currentPage}</span> of {totalPages}
            </p>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchUsers(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users
