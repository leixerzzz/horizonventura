"use client";

import { useEffect, useState } from "react";
import { format, differenceInDays, parseISO, isBefore, isValid } from "date-fns";

type BookingType = "stay" | "classes" | "service" | string;

export default function BookingForm({ type }: { type: BookingType }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricePerUnit = 120;
  const todayIso = format(new Date(), "yyyy-MM-dd");

  // ensure quantity >= 1
  useEffect(() => {
    if (quantity < 1) setQuantity(1);
  }, [quantity]);

  // if end is before start, adjust end to start
  useEffect(() => {
    if (start && end) {
      const s = parseISO(start);
      const e = parseISO(end);
      if (isValid(s) && isValid(e) && isBefore(e, s)) {
        setEnd(start);
      }
    }
  }, [start, end]);

  const requiresEnd = type === "stay" || type === "classes";

  const validStart = start && isValid(parseISO(start)) && !isBefore(parseISO(start), parseISO(todayIso));
  const validEnd = !requiresEnd || (end && isValid(parseISO(end)) && !isBefore(parseISO(end), parseISO(start)));

  const days =
    validStart && validEnd && requiresEnd
      ? Math.max(differenceInDays(parseISO(end), parseISO(start)), 1)
      : 1;

  const total =
    requiresEnd
      ? days * pricePerUnit * quantity
      : pricePerUnit * quantity;

  const currency = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(total);

  const isFormValid = Boolean(validStart && validEnd && quantity >= 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isFormValid) {
      setError("Please fill the form correctly.");
      return;
    }
    setLoading(true);
    try {
      // simulate reservation request
      await new Promise((res) => setTimeout(res, 900));
      // success feedback could be handled here
      alert(`Reserved — ${currency}`);
    } catch {
      setError("Reservation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-white/10 p-8 rounded-3xl shadow-xl max-w-xl" aria-labelledby="booking-heading">
      <h2 id="booking-heading" className="text-3xl font-bold mb-6">Book your experience</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1" htmlFor="start">Start Date</label>
          <input
            id="start"
            name="start"
            type="date"
            value={start}
            min={todayIso}
            onChange={e => setStart(e.target.value)}
            className="w-full p-3 rounded-lg border"
            aria-required="true"
          />
        </div>

        {requiresEnd && (
          <div>
            <label className="block font-semibold mb-1" htmlFor="end">End Date</label>
            <input
              id="end"
              name="end"
              type="date"
              value={end}
              min={start || todayIso}
              onChange={e => setEnd(e.target.value)}
              className="w-full p-3 rounded-lg border"
              aria-required="true"
            />
          </div>
        )}

        <div>
          <label className="block font-semibold mb-1" htmlFor="quantity">People / Units</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value || 1))}
            className="w-full p-3 rounded-lg border"
            aria-valuemin={1}
          />
        </div>

        <div className="text-xl font-bold mt-4" aria-live="polite">
          Total: {currency}
        </div>

        {error && <div role="alert" className="text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-sun text-black font-bold hover:scale-105 transition disabled:opacity-50"
          disabled={loading || !isFormValid}
          aria-disabled={loading || !isFormValid}
        >
          {loading ? "Reserving..." : "Reserve Now"}
        </button>
      </div>
    </form>
  );
}