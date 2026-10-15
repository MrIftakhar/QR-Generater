'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Scan {
  id: number;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface AnalyticsData {
  title: string;
  total_scans: number;
  recent_scans: Scan[];
}

interface AnalyticsPageProps {
  params: Promise<{ id: string }>;
}

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`http://localhost:8000/api/qrcodes/${id}/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch analytics data.');
        return res.json();
      })
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load scan analytics.');
        setLoading(false);
      });
  }, [id, router]);

  if (loading) {
    return <div className="text-center mt-5 py-5">Loading scan analytics...</div>;
  }

  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold">Scan Analytics</h1>
          <p className="text-muted">
            Performance metrics for campaign: <span className="text-dark fw-semibold">{analytics?.title}</span>
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-outline-secondary">
          Back to Dashboard
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Metric Card */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card shadow-sm border-0 bg-primary text-white p-4">
            <h6 className="text-uppercase tracking-wider mb-1 opacity-75">Total Scans</h6>
            <h2 className="display-4 fw-bold mb-0">{analytics?.total_scans || 0}</h2>
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="card shadow-sm border-0 p-4">
        <h5 className="fw-bold mb-3">Recent Scan Activity</h5>
        {analytics?.recent_scans && analytics.recent_scans.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>IP Address</th>
                  <th>Device / User Agent</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recent_scans.map((scan) => (
                  <tr key={scan.id}>
                    <td><code>{scan.ip_address || 'Unknown'}</code></td>
                    <td className="text-muted small text-truncate" style={{ maxWidth: '350px' }}>
                      {scan.user_agent || 'Unknown'}
                    </td>
                    <td>{new Date(scan.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted mb-0 py-3 text-center">No scans recorded yet. Try scanning your dynamic QR code!</p>
        )}
      </div>
    </div>
  );
}