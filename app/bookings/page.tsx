"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import axios from "axios";

interface Booking {
    _id: string;
    experienceTitle: string;
    fullName: string;
    email: string;
    phone?: string;
    date: string;
    time: string;
    quantity: number;
    pricePerPerson: number;
    subtotal: number;
    discount: number;
    total: number;
    promoCode?: string;
    status: "confirmed" | "cancelled" | "completed";
    createdAt: string;
}

interface PaginationMeta {
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
}

export default function BookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [pagination, setPagination] = useState<PaginationMeta>({
        total: 0,
        page: 1,
        totalPages: 1,
        hasMore: false,
    });

    useEffect(() => {
        // Get email from session or prompt user
        const storedEmail = sessionStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        if (email) {
            fetchBookings(1, true);
        }
    }, [email, statusFilter]);

    const fetchBookings = async (page: number = 1, reset: boolean = false) => {
        if (!email) return;

        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);

        try {
            const params = new URLSearchParams({
                email,
                page: page.toString(),
                limit: "10",
                ...(statusFilter !== "all" && { status: statusFilter }),
            });

            const { data: response } = await axios.get(`/api/bookings?${params}`);

            if (response.success) {
                const newBookings = response.data || [];

                if (reset) {
                    setBookings(newBookings);
                } else {
                    setBookings((prev) => [...prev, ...newBookings]);
                }

                setPagination({
                    total: response.total || 0,
                    page: response.page || 1,
                    totalPages: response.totalPages || 1,
                    hasMore: response.hasMore || false,
                });
            } else {
                throw new Error(response.error || "Failed to fetch bookings");
            }
        } catch (err: any) {
            console.error("Failed to fetch bookings:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load bookings. Please try again."
            );
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (pagination.hasMore && !loadingMore) {
            fetchBookings(pagination.page + 1, false);
        }
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            sessionStorage.setItem("userEmail", email.trim());
            fetchBookings(1, true);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <button
                        onClick={() => router.push("/")}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Home
                    </button>
                </div>

                {/* Email Input Form */}
                {!email && (
                    <div className="max-w-md mx-auto mb-8">
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter your email to view bookings
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 font-medium"
                            >
                                View My Bookings
                            </button>
                        </form>
                    </div>
                )}

                {/* Filters */}
                {email && (
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Filter by status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            >
                                <option value="all">All</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <button
                            onClick={() => {
                                setEmail("");
                                sessionStorage.removeItem("userEmail");
                                setBookings([]);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Change Email
                        </button>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
                        <div className="text-gray-500">Loading bookings...</div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col justify-center items-center h-96">
                        <div className="text-red-500 mb-4">❌ {error}</div>
                        <button
                            onClick={() => fetchBookings(1, true)}
                            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                        >
                            Try Again
                        </button>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-96">
                        <div className="text-gray-500 mb-4">
                            {statusFilter !== "all"
                                ? `No ${statusFilter} bookings found`
                                : "No bookings found"}
                        </div>
                        <button
                            onClick={() => router.push("/")}
                            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                        >
                            Browse Experiences
                        </button>
                    </div>
                ) : (
                    <>
                        {pagination.total > 0 && (
                            <div className="mb-4 text-gray-600">
                                Showing {bookings.length} of {pagination.total} bookings
                            </div>
                        )}

                        {/* Bookings List */}
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                {booking.experienceTitle}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Booked on {formatDate(booking.createdAt)}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status.charAt(0).toUpperCase() +
                                                booking.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Date:</span> {booking.date}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Time:</span> {booking.time}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Quantity:</span>{" "}
                                                {booking.quantity} person(s)
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Name:</span>{" "}
                                                {booking.fullName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Email:</span> {booking.email}
                                            </p>
                                            {booking.phone && (
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Phone:</span>{" "}
                                                    {booking.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600">
                                                    Subtotal: ₹{booking.subtotal}
                                                </p>
                                                {booking.discount > 0 && (
                                                    <p className="text-sm text-green-600">
                                                        Discount ({booking.promoCode}): -₹{booking.discount}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ₹{booking.total}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {pagination.hasMore && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    {loadingMore ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                            Loading...
                                        </span>
                                    ) : (
                                        `Load More (${pagination.total - bookings.length} remaining)`
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
