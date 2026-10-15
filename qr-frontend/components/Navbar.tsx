'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname() || '';
  
  const [token] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  });
  const [userName, setUserName] = useState<string>('Account');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      api.get('/user')
        .then((res) => {
          setUserName(res.data.name || 'User');
          setIsAdmin(!!res.data.is_admin);
        })
        .catch(() => {});
    }
  }, [token, pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch {}
    localStorage.removeItem('auth_token');
    toast.success('Logged out successfully');
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-4 shadow-sm sticky-top" style={{ backgroundColor: '#198754' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 text-white" href={token ? '/dashboard' : '/'}>
          <i className="bi bi-qr-code-scan me-2"></i>QR-Generater
        </Link>

        <div className="ms-auto d-flex align-items-center gap-4">
          {!token && pathname === '/' && (
            <div className="d-none d-lg-flex align-items-center gap-3">
              <a href="#benefits" className="text-white text-decoration-none small fw-semibold">Benefits</a>
              <a href="#about" className="text-white text-decoration-none small fw-semibold">What are QR Codes</a>
              <a href="#comparison" className="text-white text-decoration-none small fw-semibold">Dynamic vs Static</a>
            </div>
          )}

          {token ? (
            <div className="dropdown position-relative">
              <button
                className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <i className="bi bi-person-circle"></i> {userName}
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu dropdown-menu-end show position-absolute mt-2 shadow" style={{ right: 0, left: 'auto' }}>
                  <li>
                    <Link className="dropdown-item" href="/dashboard" onClick={() => setDropdownOpen(false)}>
                      <i className="bi bi-speedometer2 me-2"></i>Dashboard
                    </Link>
                  </li>
                  {isAdmin && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item text-danger fw-semibold" href="/admin" onClick={() => setDropdownOpen(false)}>
                          <i className="bi bi-shield-lock-fill me-2"></i>Admin Console
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div>
              <Link href="/login" className="btn btn-outline-light me-2">
                Login
              </Link>
              <Link href="/register" className="btn btn-dark text-white">
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}