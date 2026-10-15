"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface QrCodeItem {
  id: number;
  uuid: string;
  title: string;
  type: string;
  content: string;
  is_dynamic?: boolean;
  options?: {
    fgColor?: string;
    bgColor?: string;
  };
  created_at: string;
}

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<QrCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Keep track of SVG DOM refs for downloading
  const svgRefs = useRef<{ [key: number]: SVGSVGElement | null }>({});

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8000/api/qrcodes", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQrCodes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this QR code?")) return;

    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`http://localhost:8000/api/qrcodes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setQrCodes(qrCodes.filter((qr) => qr.id !== id));
      } else {
        alert("Failed to delete QR code.");
      }
    } catch {
      alert("Network error while deleting.");
    }
  };

  const handleDownloadPNG = (qr: QrCodeItem) => {
    const svgElement = svgRefs.current[qr.id];
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Set canvas resolution for crisp download
    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = qr.options?.bgColor || "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${qr.title.replace(/\s+/g, "_")}_qrcode.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  if (loading) {
    return (
      <div className="text-center mt-5 py-5">Loading your dashboard...</div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold">Your QR Dashboard</h1>
          <p className="text-muted">
            Manage and track your subscription-free QR codes.
          </p>
        </div>
        <Link href="/dashboard/create" className="btn btn-primary px-4 py-2">
          + Create New QR Code
        </Link>
      </div>

      {qrCodes.length === 0 ? (
        <div className="card shadow-sm text-center py-5 border-0 bg-light">
          <div className="card-body">
            <h4>No QR codes generated yet!</h4>
            <p className="text-muted">
              Get started by creating your first URL, WiFi, or vCard QR code.
            </p>
            <Link
              href="/dashboard/create"
              className="btn btn-outline-primary mt-2"
            >
              Launch Studio
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {qrCodes.map((qr) => {
            // If dynamic, encode the short URL path pointing to the tracking redirect engine
            // Inside your dashboard map loop:
            const backendHost = "192.168.1.50:8000"; // Replace with your local IP or production domain
            const qrValue =
              qr.is_dynamic && qr.uuid
                ? `http://${backendHost}/s/${qr.uuid}`
                : qr.content;

            return (
              <div className="col-md-4" key={qr.id}>
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-secondary text-uppercase">
                          {qr.type}
                        </span>
                        <small className="text-muted">
                          {new Date(qr.created_at).toLocaleDateString()}
                        </small>
                      </div>

                      {/* QR Thumbnail Preview */}
                      <div className="text-center bg-light p-3 rounded mb-3 border">
                        <QRCodeSVG
                          ref={(el) => {
                            if (el) svgRefs.current[qr.id] = el;
                          }}
                          value={qrValue}
                          size={96}
                          fgColor={qr.options?.fgColor || "#000000"}
                          bgColor={qr.options?.bgColor || "#ffffff"}
                        />
                      </div>

                      <h5 className="card-title fw-bold">{qr.title}</h5>
                      <p className="card-text text-truncate text-muted small">
                        {qr.content}
                      </p>
                    </div>

                    {/* Actions: Analytics, Download, Edit & Delete */}
                    <div className="mt-3 pt-2 border-top">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Link
                          href={`/dashboard/analytics/${qr.id}`}
                          className="btn btn-sm btn-outline-info w-100 py-1 fw-semibold"
                        >
                          View Analytics
                        </Link>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          onClick={() => handleDownloadPNG(qr)}
                          className="btn btn-sm btn-success px-2 py-1"
                          title="Download PNG"
                        >
                          Download PNG
                        </button>

                        <div className="d-flex gap-1">
                          <Link
                            href={`/dashboard/edit/${qr.id}`}
                            className="btn btn-sm btn-outline-secondary px-2 py-1"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(qr.id)}
                            className="btn btn-sm btn-outline-danger px-2 py-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
