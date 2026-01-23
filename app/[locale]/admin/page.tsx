"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type Booking = {
  id: string;
  destination: string;
  service: string;
  totalPrice: number | string;
  status: string;
  createdAt?: string;
  user?: { id?: string; name?: string; email?: string };
};

const API = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") : "http://localhost:4000";

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const source = axios.CancelToken.source();
    setLoading(true);
    setError(null);

    axios
      .get(`${API}/api/bookings?page=${page}&limit=${limit}`, {
        cancelToken: source.token
      })
      .then((res) => {
        // support both paginated and non-paginated responses
        const data = res.data?.data ?? res.data;
        setBookings(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) setError("Failed to load bookings");
      })
      .finally(() => setLoading(false));

    return () => source.cancel("component unmounted");
  }, [page]);

  const formatCurrency = (v: number | string) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(v || 0));

  const updateStatus = async (id: string, status: string) => {
    const prev = bookings;
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      await axios.patch(`${API}/api/bookings/${id}`, { status });
    } catch {
      setBookings(prev);
      alert("Failed to update booking status");
    }
  };

  return (
    <main className="pt-32 px-6 max-w-7xl mx-auto" role="main" aria-label="Admin Dashboard">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-white/10"
          aria-label="Previous page"
          disabled={page === 1}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-white/10"
          aria-label="Next page"
        >
          Next
        </button>
      </div>

      {loading && <div className="py-8 text-center">Loading bookings…</div>}
      {error && <div role="alert" className="text-red-600 mb-4">{error}</div>}

      {!loading && bookings.length === 0 && <div className="py-8 text-center">No bookings yet.</div>}

      <div className="grid gap-4">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white dark:bg-white/10 p-4 rounded-xl shadow flex items-center justify-between">
            <div>
              <p>
                <strong>{b.destination}</strong> — {b.service}
              </p>
              <p className="text-sm text-muted-foreground">
                {b.user?.name ?? b.user?.email ?? "Anonymous"} • {b.createdAt ? new Date(b.createdAt).toLocaleString() : ""}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-lg font-bold">{formatCurrency(b.totalPrice)}</div>

              <div className="flex gap-2 items-center">
                <span className="text-sm">{b.status}</span>

                <button
                  onClick={() => updateStatus(b.id, "confirmed")}
                  className="px-3 py-1 rounded bg-green-500 text-white text-sm"
                  title="Mark confirmed"
                >
                  Confirm
                </button>

                <button
                  onClick={() => updateStatus(b.id, "cancelled")}
                  className="px-3 py-1 rounded bg-red-500 text-white text-sm"
                  title="Mark cancelled"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
