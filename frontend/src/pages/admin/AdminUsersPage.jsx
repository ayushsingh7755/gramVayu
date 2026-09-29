import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Trash2, ShieldCheck } from 'lucide-react';
import { userService } from '../../services/userService';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorBanner } from '../../components/common/ErrorBanner';

export const AdminUsersPage = () => {
  const {
    states,
    districts,
    blocks,
    panchayats,
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedPanchayat,
  } = useLocationFilter();

  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'Password@123',
    phone: '',
    role: 'officer',
  });

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const list = await userService.getUsers({ role: roleFilter });
      setUsers(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser({
        ...form,
        state: selectedState,
        district: selectedDistrict,
        block: selectedBlock,
        panchayat: selectedPanchayat,
      });
      setForm({
        name: '',
        email: '',
        password: 'Password@123',
        phone: '',
        role: 'officer',
      });
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user.');
    }
  };

  const handleRoleChange = async (userObj, newRole) => {
    try {
      await userService.updateUser(userObj._id, {
        ...userObj,
        state: userObj.state?._id,
        district: userObj.district?._id,
        block: userObj.block?._id,
        panchayat: userObj.panchayat?._id,
        role: newRole,
      });
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      await userService.deleteUser(id);
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            User & Role Access Management
          </h1>
          <p className="text-sm text-slate-600">
            Create Agriculture Officer, System Admin, or Farmer accounts and manage role permissions
          </p>
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm"
        >
          <option value="all">All Roles</option>
          <option value="farmer">Farmers</option>
          <option value="officer">Agriculture Officers</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Create Officer / Admin / Farmer Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-emerald-600" />
          Provision New Account (Admin / Officer / Farmer)
        </h3>
        <form
          onSubmit={handleCreateUser}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3"
        >
          <input
            type="text"
            required
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="email"
            required
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
          >
            <option value="officer">Agriculture Officer</option>
            <option value="admin">System Admin</option>
            <option value="farmer">Farmer</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
          >
            Create Account
          </button>
        </form>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadUsers} />}

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Assigned Location</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {u.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-semibold capitalize"
                      >
                        <option value="farmer">farmer</option>
                        <option value="officer">officer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {u.panchayat?.name || '—'} ({u.block?.name || '—'})
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
