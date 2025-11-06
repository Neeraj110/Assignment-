"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";

interface BookingConfirmation {
  bookingId: string;
  experienceTitle: string;
  fullName: string;
  email: string;
  date: string;
  time: string;
  quantity: number;
  subtotal: number;
  discount: number;
  total: number;
  promoApplied?: {
    code: string;
    type: string;
    value: number;
    discount: number;
  };
  status: string;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = sessionStorage.getItem("bookingConfirmation");

    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setBooking(parsedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to parse booking confirmation:", error);
        router.push("/");
      }
    } else {
      // No booking data found, redirect to home
      router.push("/");
    }
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  const handleNewBooking = () => {
    // Clear session storage
    sessionStorage.removeItem("bookingConfirmation");
    sessionStorage.removeItem("bookingData");
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
          <div className="text-gray-500">Loading confirmation...</div>
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col justify-center items-center h-96">
          <div className="text-gray-500 mb-4">No booking found</div>
          <Link href="/" className="btn-primary">
            Go to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-green-600">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">Your adventure awaits</p>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Booking ID</p>
              <p className="font-semibold text-gray-900 break-all">
                {booking.bookingId}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="font-semibold text-green-600 uppercase">
                {booking.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-semibold text-gray-900">{booking.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold text-gray-900 break-all">
                {booking.email}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600 mb-1">Experience</p>
              <p className="font-semibold text-gray-900">
                {booking.experienceTitle}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Date</p>
              <p className="font-semibold text-gray-900">{booking.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Time</p>
              <p className="font-semibold text-gray-900">{booking.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Quantity</p>
              <p className="font-semibold text-gray-900">
                {booking.quantity} {booking.quantity === 1 ? "person" : "people"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="font-semibold text-gray-900">₹{booking.total}</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-300 pt-4 mb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{booking.subtotal}</span>
              </div>
              {booking.discount > 0 && booking.promoApplied && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Discount ({booking.promoApplied.code})
                  </span>
                  <span className="text-green-600">-₹{booking.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total Paid</span>
                <span className="text-gray-900">₹{booking.total}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            A confirmation email has been sent to{" "}
            <span className="font-semibold">{booking.email}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={handleNewBooking}
            className="btn-primary px-6 py-3"
          >
            Book Another Experience
          </button>
          <button onClick={handlePrint} className="btn-secondary px-6 py-3">
            Print Confirmation
          </button>
        </div>

        {/* Important Information */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Important Information
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Please arrive 15 minutes before your scheduled time</li>
            <li>• Bring a valid ID proof for verification</li>
            <li>
              • For any changes or cancellations, contact us at least 24 hours
              in advance
            </li>
            <li>
              • Check your email for detailed instructions and contact
              information
            </li>
          </ul>
        </div>
      </div>

  
    </main>
  );
}