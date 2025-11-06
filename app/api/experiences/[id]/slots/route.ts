// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";
import Booking from "@/models/Booking";
import mongoose from "mongoose";

// Promo codes configuration
const promoCodes: Record<
  string,
  { type: "percent" | "flat"; value: number; minAmount?: number }
> = {
  SAVE10: { type: "percent", value: 10, minAmount: 500 },
  FLAT100: { type: "flat", value: 100, minAmount: 1000 },
  WELCOME20: { type: "percent", value: 20, minAmount: 0 },
};

/**
 * POST /api/bookings
 * Creates a new booking and updates slot availability
 */
export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectDB();
    const body = await req.json();

    const {
      experienceId,
      title,
      price,
      quantity,
      selectedDate,
      selectedTime,
      fullName,
      email,
      phone,
      promoCode,
    } = body;

    // Validation
    if (
      !experienceId ||
      !title ||
      !price ||
      !quantity ||
      !selectedDate ||
      !selectedTime ||
      !fullName ||
      !email
    ) {
      await session.abortTransaction();
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: [
            "experienceId",
            "title",
            "price",
            "quantity",
            "selectedDate",
            "selectedTime",
            "fullName",
            "email",
          ],
        },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(experienceId)) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: "Invalid experience ID format" },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity < 1 || quantity > 20) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: "Quantity must be between 1 and 20" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Find experience
    const experience = await Experience.findById(experienceId).session(session);
    if (!experience) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    // Find and validate slot
    const slot = experience.slots.find(
      (s: any) => s.date === selectedDate && s.time === selectedTime
    );

    if (!slot) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: "Selected slot not found" },
        { status: 400 }
      );
    }

    // Check availability
    if (slot.booked + quantity > slot.capacity) {
      await session.abortTransaction();
      return NextResponse.json(
        {
          success: false,
          error: "Not enough slots available",
          available: slot.capacity - slot.booked,
          requested: quantity,
        },
        { status: 400 }
      );
    }

    // Check for duplicate booking (same user, same experience, same date/time)
    const existingBooking = await Booking.findOne({
      experienceId,
      email,
      date: selectedDate,
      time: selectedTime,
      status: { $ne: "cancelled" },
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();
      return NextResponse.json(
        {
          success: false,
          error: "You already have a booking for this slot",
          bookingId: existingBooking._id,
        },
        { status: 400 }
      );
    }

    // Calculate pricing
    const subtotal = price * quantity;
    let discount = 0;
    let promoApplied = null;

    if (promoCode && promoCodes[promoCode.toUpperCase()]) {
      const promo = promoCodes[promoCode.toUpperCase()];

      // Check minimum amount requirement
      if (promo.minAmount && subtotal < promo.minAmount) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            success: false,
            error: `Promo code requires minimum purchase of ₹${promo.minAmount}`,
          },
          { status: 400 }
        );
      }

      discount =
        promo.type === "percent" ? (subtotal * promo.value) / 100 : promo.value;

      // Ensure discount doesn't exceed subtotal
      discount = Math.min(discount, subtotal);

      promoApplied = {
        code: promoCode.toUpperCase(),
        type: promo.type,
        value: promo.value,
        discount,
      };
    }

    const total = subtotal - discount;

    // Create booking
    const booking = await Booking.create(
      [
        {
          experienceId,
          experienceTitle: title,
          fullName,
          email,
          phone: phone || undefined,
          date: selectedDate,
          time: selectedTime,
          quantity,
          pricePerPerson: price,
          subtotal,
          discount,
          total,
          promoCode: promoCode?.toUpperCase() || undefined,
          status: "confirmed",
        },
      ],
      { session }
    );

    // Update slot count
    slot.booked += quantity;
    await experience.save({ session });

    // Commit transaction
    await session.commitTransaction();

    return NextResponse.json(
      {
        success: true,
        message: "Booking confirmed successfully",
        data: {
          bookingId: booking[0]._id,
          experienceTitle: title,
          fullName,
          email,
          date: selectedDate,
          time: selectedTime,
          quantity,
          subtotal,
          discount,
          total,
          promoApplied,
          status: "confirmed",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Booking error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create booking",
        message: error.message,
      },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}

/**
 * GET /api/bookings?email=user@example.com
 * Get booking history for a user
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const bookings = await Booking.find({ email })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: bookings.length,
        data: bookings,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bookings",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
