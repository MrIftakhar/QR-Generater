'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

export default function CreateQrPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('url');
  const [isDynamic, setIsDynamic] = useState(true);
  
  // Type-specific input fields
  const [url, setUrl] = useState('');
  
  // Wi-Fi fields
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');

  // vCard fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Email fields
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Phone field
  const [phoneNumber, setPhoneNumber] = useState('');

  // Customization options
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Compute final content string depending on QR type
  const getComputedContent = () => {
    switch (type) {
      case 'url':
        return url;
      case 'wifi':
        return `WIFI:S:${ssid};T:${encryption};P:${password};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${lastName};${firstName}\nFN:${firstName} ${lastName}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNumber}`;
      default:
        return url;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const content = getComputedContent();

    try {
      const res = await fetch('http://localhost:8000/api/qrcodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          title,
          type,
          content,
          is_dynamic: isDynamic,
          options: { fgColor, bgColor },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create QR code.');
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold">Advanced QR Studio</h1>
          <p className="text-muted">Create professional dynamic or static QR codes with real-time rendering.</p>
        </div>
        <Link href="/dashboard" className="btn btn-outline-secondary">
          Back to Dashboard
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-4">
        <div className="col-md-7">
          <div className="card shadow-sm border-0 p-4">
            
            {/* Title */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Campaign Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Summer Marketing Campaign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* QR Mode Selection (Dynamic vs Static) */}
            <div className="mb-4">
              <label className="form-label fw-semibold">QR Code Mode</label>
              <div className="row g-2">
                <div className="col-6">
                  <div
                    className={`p-3 border rounded text-center ${isDynamic ? 'border-primary bg-light fw-bold text-primary' : 'text-muted'}`}
                    onClick={() => setIsDynamic(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>Dynamic</div>
                    <small className="d-block text-muted fw-normal" style={{ fontSize: '0.8rem' }}>
                      Track scans & analytics
                    </small>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className={`p-3 border rounded text-center ${!isDynamic ? 'border-primary bg-light fw-bold text-primary' : 'text-muted'}`}
                    onClick={() => setIsDynamic(false)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>Static</div>
                    <small className="d-block text-muted fw-normal" style={{ fontSize: '0.8rem' }}>
                      Permanent raw data
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Type Selection */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Select QR Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="url">Website URL</option>
                <option value="wifi">Wi-Fi Auto-Connect</option>
                <option value="vcard">vCard Contact Download</option>
                <option value="email">Email Trigger</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>

            {/* Dynamic Type Fields */}
            {type === 'url' && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Target URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
            )}

            {type === 'wifi' && (
              <>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Network SSID (Name)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="GuestNetwork"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Network password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Encryption</label>
                  <select
                    className="form-select"
                    value={encryption}
                    onChange={(e) => setEncryption(e.target.value)}
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password</option>
                  </select>
                </div>
              </>
            )}

            {type === 'vcard' && (
              <>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </>
            )}

            {type === 'email' && (
              <>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Recipient Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="support@example.com"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Body Message</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                  />
                </div>
              </>
            )}

            {type === 'phone' && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Colors Customization */}
            <div className="row mt-3">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">QR Color</label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
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
              className="btn btn-primary w-100 py-2 mt-3 fw-bold"
              disabled={loading}
            >
              {loading ? 'Creating Campaign...' : 'Save to Dashboard Library'}
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 p-4 text-center sticky-top" style={{ top: '2rem' }}>
            <h5 className="fw-bold mb-3">Live Preview</h5>
            <div className="bg-light p-4 rounded border d-flex justify-content-center align-items-center mb-3" style={{ minHeight: '220px' }}>
              <QRCodeSVG
                value={isDynamic ? 'http://localhost:8000/s/preview-uuid' : (getComputedContent() || 'https://example.com')}
                size={180}
                fgColor={fgColor}
                bgColor={bgColor}
              />
            </div>
            <p className="text-muted small">
              {isDynamic 
                ? 'Dynamic mode: Encodes a trackable short URL link for real-time analytics.' 
                : 'Static mode: Encodes your specialized content directly into the pattern.'}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}