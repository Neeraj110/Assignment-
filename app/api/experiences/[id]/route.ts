/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/experiences/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience, { IExperience, ISlot } from "@/models/Experience";
import mongoose from "mongoose";

// Type for lean query result with _id
type LeanExperience = Omit<
  IExperience,
  "_id" | "__v" | keyof mongoose.Document
> & {
  _id: mongoose.Types.ObjectId;
};

/**
 * GET /api/experiences/:id
 * Returns experience details with full information (excluding internal slot details)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Await params as required by Next.js 15+
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid experience ID format" },
        { status: 400 }
      );
    }

    const experience = (await Experience.findById(id)
      .select("-__v")
      .lean()) as LeanExperience | null;

    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    // Transform slots to show availability without exposing internal details
    const availableSlots = experience.slots
      .filter((slot: ISlot) => slot.booked < slot.capacity)
      .map((slot: ISlot) => ({
        date: slot.date,
        time: slot.time,
        available: slot.capacity - slot.booked,
      }));

    // Build response data
    const { slots, ...experienceWithoutSlots } = experience;

    const responseData = {
      ...experienceWithoutSlots,
      _id: experience._id.toString(),
      availableDates: experience.availableDates || [],
      availableTimes: experience.availableTimes || [],
      availableSlots,
      totalAvailableSlots: availableSlots.reduce(
        (sum: number, slot) => sum + slot.available,
        0
      ),
    };

    return NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching experience details:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch experience details",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
