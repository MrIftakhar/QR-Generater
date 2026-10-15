'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      
      {/* Hero Section */}
      <header className="py-5 bg-dark text-white text-center">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-semibold">
                100% Subscription-Free & Open Source
              </span>
              <h1 className="display-4 fw-bold mb-4">
                Generate & Track Dynamic QR Codes Instantly
              </h1>
              <p className="lead text-muted mb-5">
                Create gorgeous QR codes for URLs, WiFi, vCards, social media, and more. 
                Track real-time scans with powerful analytics—completely free.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/register" className="btn btn-primary btn-lg px-4 shadow fw-bold">
                  Create Free QR Code <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <Link href="/login" className="btn btn-outline-light btn-lg px-4">
                  Access Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Section 1: Benefits from Platform */}
      <section id="benefits" className="py-5 bg-white border-bottom">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center">
              <div className="p-5 bg-light rounded-4 shadow-sm border d-inline-block w-100">
                <i className="bi bi-qr-code-scan text-primary display-1 mb-3"></i>
                <h4 className="fw-bold text-dark">Advanced Studio & Analytics</h4>
                <p className="text-muted small mb-0">Custom colors, styles, logos, and real-time scan tracking.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3 text-dark">Benefits from Our Platform</h2>
              <p className="text-muted mb-4">
                By using our platform you will be able to keep track of how many people scan your QR Codes, from where and on what date. Also, for those non-developers, you can create fully customized codes with no coding required!
              </p>
              
              <div className="row g-2">
                {[
                  'Dynamic QR Codes & Real-time Tracking',
                  'Static QR Codes Support',
                  'QR Code Statistics & Analytics',
                  'Fully Customized Designs & Colors',
                  'Multi-type Support (URL, WiFi, vCard, Email)',
                  'No Coding Required'
                ].map((benefit, index) => (
                  <div className="col-12" key={index}>
                    <div className="p-3 border rounded bg-light d-flex align-items-center gap-3">
                      <i className="bi bi-check-circle-fill text-success fs-5"></i>
                      <span className="fw-semibold text-dark">{benefit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What are QR Codes & Use Cases */}
      <section id="about" className="py-5 text-white" style={{ backgroundColor: '#198754' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <span className="badge bg-light text-success fw-bold mb-2">QUICK RESPONSE</span>
              <h2 className="fw-bold display-6 mb-3">What are QR Codes stands for &apos;Quick Response&apos;?</h2>
              <p className="lead mb-4" style={{ opacity: '0.9' }}>
                They were created in 1994 by Denso Wave to track vehicles during manufacturing. They quickly gained popularity when it spread to smartphones. You can now scan QR Codes right from your phone camera.
              </p>
              <Link href="/register" className="btn btn-light text-success fw-bold px-4 py-2">
                Generate QR Code <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
            
            <div className="col-lg-7">
              <div className="row g-3">
                {[
                  { title: 'Gather Feedback', desc: 'You can ask users to give some feedback when they scan the QR Code.', icon: 'bi-chat-dots' },
                  { title: 'Profile Cards', desc: 'Physical profile cards are rare; digital profile cards are a great alternative.', icon: 'bi-person-badge' },
                  { title: 'Describe your Business', desc: 'You can redirect your clients to instruction pages for your business when they scan.', icon: 'bi-briefcase' },
                  { title: 'Promote Events & Discounts', desc: 'You can promote any event or give discount codes when people scan the QR Code.', icon: 'bi-megaphone' }
                ].map((item, idx) => (
                  <div className="col-md-6" key={idx}>
                    <div className="card h-100 border-0 shadow-sm p-3 text-dark">
                      <div className="card-body">
                        <i className={`bi ${item.icon} fs-2 text-success mb-3 d-block`}></i>
                        <h5 className="fw-bold">{item.title}</h5>
                        <p className="text-muted small mb-0">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Dynamic vs Static Explained */}
      <section id="comparison" className="py-5 bg-white">
        <div className="container py-4 text-center">
          <h2 className="fw-bold mb-2 text-dark">Dynamic vs Static QR Codes</h2>
          <p className="text-muted mb-5">The outcome of both are pretty similar. They have their differences when it comes to changes, updates, stats, track.</p>
          
          <div className="row g-4 text-start">
            <div className="col-md-6">
              <div className="card h-100 border shadow-sm p-4 bg-light">
                <span className="badge bg-primary w-25 mb-3">DYNAMIC</span>
                <h4 className="fw-bold text-dark">Dynamic QR Codes Explained</h4>
                <p className="text-muted">
                  Dynamic QR Codes allow you to change the destination URL anytime you want without having to reprint the QR Code. You can also track how many people scan your QR Code, from where and when.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 border shadow-sm p-4 bg-light">
                <span className="badge bg-success w-25 mb-3">STATIC</span>
                <h4 className="fw-bold text-dark">Static QR Codes Explained</h4>
                <p className="text-muted">
                  Static QR Codes encode the information directly in the QR Code pattern. Once generated, the content cannot be changed and scans cannot be tracked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}