'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/register', { name, email, password });
      localStorage.setItem('auth_token', res.data.access_token);
      toast.success('Registration successful! Welcome aboard.');
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm p-4 border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <Link href="/" className="text-decoration-none fs-3 fw-bold text-dark">
            <i className="bi bi-qr-code-scan text-primary me-2"></i>QR SaaS
          </Link>
          <p className="text-muted small mt-1">Create your free account</p>
        </div>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-3 small text-muted">
          Already have an account? <Link href="/login" className="text-decoration-none fw-semibold">Login</Link>
        </div>
      </div>
    </div>
  );
}