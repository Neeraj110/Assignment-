"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header";
import axios from "axios";

interface SlotAvailability {
  date: string;
  time: string;
  available: number;
  capacity?: number;
  status?: "available" | "limited" | "sold_out";
}

interface Experience {
  _id: string;
  title: string;
  location: string;
  image: string;
  description: string;
  price: number;
  about: string;
  availableDates: string[];
  availableTimes: string[];
  availableSlots?: SlotAvailability[];
  totalAvailableSlots?: number;
}

export default function DetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<SlotAvailability[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchExperience();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    if (experience?.availableSlots) {
      setAvailableSlots(experience.availableSlots);
    }
  }, [experience]);

  const fetchExperience = async () => {
    setLoading(true);
    setError(null);

    try {
      const {data} = await axios.get(
        `/api/experiences/${params.id}`
      );  

      const experienceData: Experience = data.data;
      console.log("Experience Data:", experienceData);
      console.log("Available Dates:", experienceData.availableDates);
      console.log("Available Times:", experienceData.availableTimes);
      console.log("Available Slots:", experienceData.availableSlots);
      
      setExperience(experienceData);

      // Set initial date and time
      if (experienceData.availableDates?.length > 0) {
        setSelectedDate(experienceData.availableDates[0]);
      }
      if (experienceData.availableTimes?.length > 0) {
        setSelectedTime(experienceData.availableTimes[0]);
      }

      // Set available slots from response
      if (experienceData.availableSlots) {
        setAvailableSlots(experienceData.availableSlots);
      } else {
        setAvailableSlots([]);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch experience:", err);
      setError(err instanceof Error ? err.message : "Failed to load experience details");
    } finally {
      setLoading(false);
    }
  };


  const getSlotAvailability = (date: string, time: string) => {
    const slot = availableSlots.find(
      (s) => s.date === date && s.time === time
    );
    return slot ? slot.available : null;
  };

  const isSlotAvailable = (date: string, time: string) => {
    const available = getSlotAvailability(date, time);
    return available !== null && available >= quantity;
  };

  const handleCheckout = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time");
      return;
    }

    if (!isSlotAvailable(selectedDate, selectedTime)) {
      alert("Selected slot is not available for the requested quantity");
      return;
    }

    const bookingData = {
      experienceId: params.id as string,
      title: experience?.title || "",
      price: experience?.price || 0,
      quantity,
      selectedDate,
      selectedTime,
    };

    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/checkout");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
          <div className="text-gray-500">Loading experience details...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col justify-center items-center h-96">
          <div className="text-red-500 mb-4">❌ {error}</div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  if (!experience) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-500">Experience not found</div>
        </div>
      </main>
    );
  }

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 mb-6 hover:text-gray-900"
        >
          <span>←</span>
          <span>Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Experience Details */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-6 border-4 ">
              <Image
                src={experience.image || "/placeholder.svg"}
                alt={experience.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title and Description */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {experience.title}
              </h1>
              <p className="text-gray-700 mb-6">{experience.description}</p>

              {/* Date Selection */}
              <div className="mb-6 pb-6 border-b-2 border-dashed border-gray-300">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Choose date
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {experience.availableDates && experience.availableDates.length > 0 ? (
                    experience.availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded font-medium transition-colors ${selectedDate === date
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      {date}
                    </button>
                  ))
                  ) : (
                    <p className="text-gray-500 text-sm">No dates available</p>
                  )}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Choose time
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {experience.availableTimes && experience.availableTimes.length > 0 ? (
                    experience.availableTimes.map((time) => {
                    const available = getSlotAvailability(selectedDate, time);
                    const isAvailable = available !== null && available >= quantity;

                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        disabled={!isAvailable}
                        className={`px-4 py-2 rounded font-medium transition-colors relative ${selectedTime === time
                            ? "bg-yellow-400 text-black"
                            : isAvailable
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        {time}
                        {available !== null && (
                          <span className="text-xs block">
                            ({available} left)
                          </span>
                        )}
                      </button>
                    );
                  })
                  ) : (
                    <p className="text-gray-500 text-sm">No times available</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  All times are in IST (GMT +5:30)
                </p>
              </div>

              {/* About Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-700 text-sm">{experience.about}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Starts at</span>
                  <span className="font-semibold text-gray-900">
                    ₹{experience.price}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(20, quantity + 1))}
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ₹{subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-semibold text-gray-900">
                      ₹{taxes}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!isSlotAvailable(selectedDate, selectedTime)}
                className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isSlotAvailable(selectedDate, selectedTime)
                  ? "Slot Not Available"
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}