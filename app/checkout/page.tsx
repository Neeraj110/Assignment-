"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import axios from "axios";

interface BookingData {
  experienceId: string;
  title: string;
  price: number;
  quantity: number;
  selectedDate: string;
  selectedTime: string;
}

interface PromoResponse {
  valid: boolean;
  code?: string;
  discount?: number;
  finalAmount?: number;
  message: string;
  error?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    promoCode: "",
  });
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string>("");
  const [promoError, setPromoError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("bookingData");
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      router.push("/");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    const subtotal = (bookingData?.price || 0) * (bookingData?.quantity || 1);

    setValidatingPromo(true);
    setPromoError("");
    setPromoMessage("");

    try {
      const { data: response } = await axios.post<PromoResponse>(
        "/api/promo/validate",
        {
          code: formData.promoCode.trim().toUpperCase(),
          amount: subtotal,
        }
      );

      if (response.valid && response.discount !== undefined) {
        setDiscount(response.discount);
        setPromoMessage(response.message || "Promo code applied successfully!");
        setPromoError("");
      } else {
        setDiscount(0);
        setPromoError(response.error || response.message || "Invalid promo code");
        setPromoMessage("");
      }
    } catch (error: unknown) {
      console.error("Failed to validate promo:", error);
      setDiscount(0);
      const errorMessage = error instanceof Error ? error.message : "Failed to validate promo code";
      setPromoError(errorMessage);
      setPromoMessage("");
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleCheckout = async () => {
    // Validation
    if (!formData.fullName.trim()) {
      alert("Please enter your full name");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email");
      return;
    }

    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!termsAccepted) {
      alert("Please accept the terms and safety policy");
      return;
    }

    if (!bookingData) {
      alert("Booking data not found");
      return;
    }

    setLoading(true);

    try {
      const { data: response } = await axios.post(
        "/api/bookings",
        {
          ...bookingData,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          promoCode: formData.promoCode.trim().toUpperCase(),
        }
      );

      if (response.success && response.data) {
        // Store confirmation data
        sessionStorage.setItem(
          "bookingConfirmation",
          JSON.stringify(response.data)
        );
        sessionStorage.removeItem("bookingData");
        router.push("/confirmation");
      } else {
        throw new Error(response.error || "Booking failed");
      }
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to complete booking. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
          <div className="text-gray-500">Loading checkout...</div>
        </div>
      </main>
    );
  }

  const subtotal = bookingData.price * bookingData.quantity;
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes - discount;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 mb-6 hover:text-gray-900"
        >
          <span>←</span>
          <span>Checkout</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="border-4 border-purple-500 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10 digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  maxLength={15}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="promoCode"
                    placeholder="Enter promo code (SAVE10, FLAT100, WELCOME20)"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    className="input-field flex-1"
                    disabled={validatingPromo || discount > 0}
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={validatingPromo || discount > 0}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {validatingPromo ? "Validating..." : discount > 0 ? "Applied" : "Apply"}
                  </button>
                </div>
                {promoMessage && (
                  <p className="text-sm text-green-600 mt-2">✓ {promoMessage}</p>
                )}
                {promoError && (
                  <p className="text-sm text-red-600 mt-2">✗ {promoError}</p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the terms and safety policy{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Booking Summary
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-300">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium text-gray-900 text-right">
                    {bookingData.title}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900">
                    {bookingData.selectedDate}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium text-gray-900">
                    {bookingData.selectedTime}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium text-gray-900">
                    {bookingData.quantity} × ₹{bookingData.price}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-300">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes (10%)</span>
                  <span className="font-medium text-gray-900">₹{taxes}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Discount ({formData.promoCode})
                    </span>
                    <span className="font-medium text-green-600">
                      -₹{discount}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{total}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !termsAccepted}
                className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Pay and Confirm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}