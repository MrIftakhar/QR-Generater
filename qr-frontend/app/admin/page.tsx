'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

interface UserStat {
  id: number;
  name: string;
  email: string;
  is_admin: boolean | number;
  qr_codes_count: number;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    total_users: number;
    total_qr_codes: number;
    users: UserStat[];
  } | null>(null);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        // 1. Verify current user role
        const userRes = await api.get('/user');
        const userData = userRes.data.user || userRes.data;

        if (!userData.is_admin && userData.is_admin !== 1 && userData.is_admin !== true) {
          toast.error('Access denied. Admins only.');
          router.push('/dashboard');
          return;
        }

        // 2. Fetch admin platform stats & user list
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Admin dashboard error:', err.response?.data || err.message);
        toast.error(err.response?.data?.message || 'Failed to load admin stats or unauthorized.');
        router.push('/dashboard');
      }
    }

    fetchAdminData();
  }, [router]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Admin Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="fw-bold text-dark mb-1">
            <i className="bi bi-shield-lock-fill text-danger me-2"></i>Admin Console
          </h1>
          <p className="text-muted small mb-0">Platform overview and user activity monitoring</p>
        </div>
        <span className="badge bg-danger px-3 py-2 fs-6">Administrator Mode</span>
      </div>

      {/* Overview Stat Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 bg-white border-start border-primary border-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Total Registered Users</span>
                <h2 className="fw-bold text-dark mt-2 mb-0">{stats?.total_users || 0}</h2>
              </div>
              <i className="bi bi-people-fill display-6 text-primary"></i>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 bg-white border-start border-success border-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Total QR Codes Created</span>
                <h2 className="fw-bold text-dark mt-2 mb-0">{stats?.total_qr_codes || 0}</h2>
              </div>
              <i className="bi bi-qr-code-scan display-6 text-success"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Users Activity Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0 text-dark">User Account Activity</h5>
          <span className="badge bg-light text-dark border">
            {stats?.users?.length || 0} Accounts
          </span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>QR Codes Created</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.users?.map((user) => (
                <tr key={user.id}>
                  <td className="fw-bold text-muted">#{user.id}</td>
                  <td className="fw-semibold text-dark">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.is_admin ? (
                      <span className="badge bg-danger-subtle text-danger border border-danger">
                        Admin
                      </span>
                    ) : (
                      <span className="badge bg-secondary-subtle text-secondary">
                        User
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-primary rounded-pill fs-6 px-3">
                      {user.qr_codes_count}
                    </span>
                  </td>
                  <td className="text-muted small">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}