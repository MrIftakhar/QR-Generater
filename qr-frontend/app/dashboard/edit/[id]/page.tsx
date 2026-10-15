'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditQrPage({ params }: EditPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('url');
  const [content, setContent] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch existing QR code details
    fetch(`http://localhost:8000/api/qrcodes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch QR code.');
        return res.json();
      })
      .then((data) => {
        setTitle(data.title);
        setType(data.type);
        setContent(data.content);
        if (data.options) {
          if (data.options.fgColor) setFgColor(data.options.fgColor);
          if (data.options.bgColor) setBgColor(data.options.bgColor);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load QR code details.');
        setLoading(false);
      });
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`http://localhost:8000/api/qrcodes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          title,
          type,
          content,
          options: { fgColor, bgColor },
        }),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const errData = await res.json();
        setError(errData.message || 'Failed to update QR code.');
        setSubmitting(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5 py-5">Loading QR code details...</div>;
  }

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold">Edit QR Code</h1>
          <p className="text-muted">Modify campaign details and instant live rendering style.</p>
        </div>
        <Link href="/dashboard" className="btn btn-outline-secondary">
          Back to Dashboard
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-md-7">
          <div className="card shadow-sm border-0 p-4">
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label fw-semibold">QR Title / Campaign Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">QR Type</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="url">Website URL</option>
                  <option value="text">Plain Text</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Number</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Content / Target Value</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="row mb-4">
                <div className="col-6">
                  <label className="form-label fw-semibold">QR Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color w-100"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">Background Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color w-100"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={submitting}
              >
                {submitting ? 'Saving Changes...' : 'Update QR Code'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm border-0 p-4 text-center bg-light h-100 d-flex flex-column justify-content-center">
            <h5 className="fw-bold mb-3 text-muted">Live Preview</h5>
            <div className="bg-white p-4 rounded shadow-sm d-inline-block mx-auto border">
              <QRCodeSVG
                value={content || 'https://example.com'}
                size={160}
                fgColor={fgColor}
                bgColor={bgColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}