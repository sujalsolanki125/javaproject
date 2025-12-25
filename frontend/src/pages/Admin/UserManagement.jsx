import { useState, useEffect } from 'react';
import api from '../../services/api';
import UserModal from '../../components/admin/UserModal';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const roleLabel = (role) => {
    const normalized = (role || '').toUpperCase();
    switch (normalized) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN_USER':
        return 'Admin';
      case 'PREMIUM_USER':
        return 'Premium';
      case 'STANDARD_USER':
      default:
        return 'User';
    }
  };

  const normalizeStatus = (status) => (status || 'ACTIVE').toLowerCase();
  const normalizeRole = (role) => (role || 'STANDARD_USER').toUpperCase();
  const toPayload = (data) => ({
    userFullDisplayName: data.name,
    userPrimaryEmailAddress: data.email,
    userAccountRoleType: normalizeRole(data.role),
    userProfileStatus: normalizeStatus(data.status).toUpperCase()
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const mapAdminProfile = (u) => ({
    id: u.adminUserProfileId || u.id,
    name: u.userFullDisplayName || u.fullName || u.name || u.userPrimaryEmailAddress || 'User',
    email: u.userPrimaryEmailAddress || u.email || 'N/A',
    role: normalizeRole(u.userAccountRoleType || u.role),
    status: normalizeStatus(u.userProfileStatus || u.status),
    joinDate: u.userRegistrationTimestamp || u.profileCreatedTimestamp || u.createdDate || u.joinDate || '',
    lastActive: u.lastActivityTimestamp || u.lastLoginDate || u.lastActive || '',
    totalOrders: u.totalOrdersPlacedCount ?? u.totalOrders ?? u.orderCount ?? 0,
    totalSpent: u.lifetimeSpendingAmount ?? u.totalSpent ?? u.totalSpending ?? 0
  });

  const mapCoreUser = (u) => ({
    id: u.id,
    name: u.firstName || u.lastName ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : (u.username || 'User'),
    email: u.email || 'N/A',
    role: 'STANDARD_USER',
    status: 'active',
    joinDate: u.createdAt || '',
    lastActive: u.updatedAt || '',
    totalOrders: u.totalOrders || 0,
    totalSpent: u.totalSpent || 0
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/admin/users');
      const fetched = response.data || [];

      if (fetched.length > 0) {
        setUsers(fetched.map(mapAdminProfile));
      } else {
        const fallback = await api.get('/api/users');
        const coreUsers = fallback.data || [];
        setUsers(coreUsers.map(mapCoreUser));
      }
    } catch (error) {
      console.error('Failed to fetch users:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data
      });
      if (error?.response?.status === 0 || !error?.response) {
        setError('Backend not reachable. Is the server running on port 8080?');
      } else {
        setError(`Failed to load users (status ${error?.response?.status || 'unknown'}). Check backend logs.`);
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/admin/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
        setError('Failed to delete user.');
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await api.patch(`/api/admin/users/${userId}/status`, null, {
        params: { status: nextStatus.toUpperCase() }
      });

      setUsers(users.map(u =>
        u.id === userId
          ? { ...u, status: nextStatus }
          : u
      ));
    } catch (error) {
      console.error('Failed to update user status:', error);
      setError('Failed to update user status.');
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        await api.put(`/api/admin/users/${selectedUser.id}`, toPayload(userData));
        setUsers(users.map(u =>
          u.id === selectedUser.id
            ? {
                id: selectedUser.id,
                name: userData.name,
                email: userData.email,
                role: normalizeRole(userData.role),
                status: normalizeStatus(userData.status),
                totalOrders: u.totalOrders,
                totalSpent: u.totalSpent,
                joinDate: u.joinDate,
                lastActive: u.lastActive
              }
            : u
        ));
      } else {
        const response = await api.post('/api/admin/users', toPayload(userData));

        const newUser = {
          id: response.data?.adminUserProfileId || response.data?.id,
          name: response.data?.userFullDisplayName || userData.name,
          email: response.data?.userPrimaryEmailAddress || userData.email,
          role: normalizeRole(response.data?.userAccountRoleType || userData.role),
          status: normalizeStatus(response.data?.userProfileStatus || userData.status),
          joinDate: response.data?.userRegistrationTimestamp || response.data?.profileCreatedTimestamp || '',
          lastActive: response.data?.lastActivityTimestamp || '',
          totalOrders: response.data?.totalOrdersPlacedCount ?? 0,
          totalSpent: response.data?.lifetimeSpendingAmount ?? 0
        };

        setUsers([newUser, ...users]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save user:', error);
      setError('Failed to save user.');
    }
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !filterRole || user.role === filterRole;
      const matchesStatus = !filterStatus || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });

  const getRoleColor = (role) => {
    switch ((role || '').toUpperCase()) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'ADMIN_USER':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100';
      case 'PREMIUM_USER':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100';
      case 'STANDARD_USER':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'inactive':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
      case 'suspended':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100';
      case 'banned':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'pending_verification':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage user accounts and permissions</p>
          </div>
          <button
            onClick={handleCreateUser}
            className="mt-4 sm:mt-0 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center"
          >
            <span className="material-symbols-outlined mr-2">person_add</span>
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="STANDARD_USER">User</option>
              <option value="ADMIN_USER">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="PREMIUM_USER">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
              <option value="pending_verification">Pending Verification</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-sm font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {roleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${user.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {user.status === 'active' ? 'block' : 'check_circle'}
                        </span>
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">people</span>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}