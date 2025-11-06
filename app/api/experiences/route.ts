// app/api/experiences/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";


export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build search query
    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination metadata
    const totalCount = await Experience.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated experiences
    const experiences = await Experience.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(
      `Fetched ${experiences.length} experiences (page ${page}/${totalPages})`
    );

    // Always return consistent response format with pagination metadata
    return NextResponse.json(
      {
        success: true,
        count: experiences.length,
        total: totalCount,
        page,
        totalPages,
        hasMore: page < totalPages,
        data: experiences,
        message: experiences.length === 0 ? "No experiences found" : undefined,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch experiences",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
