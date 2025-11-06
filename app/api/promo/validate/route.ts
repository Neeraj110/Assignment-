// app/api/promo/validate/route.ts
import { NextRequest, NextResponse } from "next/server";

type Codes = {
  type: "percent" | "flat";
  value: number;
  minAmount: number;
  description: string;
};

const promoCodes: Record<string, Codes> = {
  SAVE10: {
    type: "percent",
    value: 10,
    minAmount: 500,
    description: "Get 10% off on orders above ₹500",
  },
  FLAT100: {
    type: "flat",
    value: 100,
    minAmount: 1000,
    description: "Get ₹100 off on orders above ₹1000",
  },
  WELCOME20: {
    type: "percent",
    value: 20,
    minAmount: 0,
    description: "Welcome offer - Get 20% off on your first booking",
  },
};

/**
 * POST /api/promo/validate
 * Validates a promo code and calculates discount
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, amount } = body;

    // Validation
    if (!code) {
      return NextResponse.json(
        {
          valid: false,
          error: "Promo code is required",
        },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          valid: false,
          error: "Valid amount is required",
        },
        { status: 400 }
      );
    }

    // Normalize code to uppercase
    const normalizedCode = code.trim().toUpperCase();

    // Check if promo code exists
    const promo = promoCodes[normalizedCode];
    if (!promo) {
      return NextResponse.json(
        {
          valid: false,
          error: "Invalid promo code",
          message: "The promo code you entered is not valid",
        },
        { status: 200 } // Return 200 but with valid: false
      );
    }

    // Check minimum amount requirement
    if (promo.minAmount && amount < promo.minAmount) { // If minAmount is set and not met
      return NextResponse.json(
        {
          valid: false,
          error: "Minimum amount not met",
          message: `This promo code requires a minimum purchase of ₹${promo.minAmount}`,
          minAmount: promo.minAmount,
        },
        { status: 200 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (promo.type === "percent") {
      discount = (amount * promo.value) / 100;
    } else {
      discount = promo.value;
    }

    // Ensure discount doesn't exceed amount
    discount = Math.min(discount, amount);

    const finalAmount = amount - discount;

    // Generate success message
    const discountText =
      promo.type === "percent" ? `${promo.value}%` : `₹${promo.value}`;

    return NextResponse.json(
      {
        valid: true,
        code: normalizedCode,
        type: promo.type,
        value: promo.value,
        discount: Math.round(discount * 100) / 100, // Round to 2 decimal places
        finalAmount: Math.round(finalAmount * 100) / 100,
        savings: Math.round(discount * 100) / 100,
        message: `${discountText} discount applied successfully!`,
        description: promo.description,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Promo validation error:", error);
    return NextResponse.json(
      {
        valid: false,
        error: "Failed to validate promo code",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/promo/validate
 * Returns list of available promo codes (optional - for displaying available promos)
 */
export async function GET() {
  try {
    const availablePromos = Object.entries(promoCodes).map(
      ([code, details]) => ({
        code,
        type: details.type,
        value: details.value,
        minAmount: details.minAmount || 0,
        description: details.description,
      })
    );

    return NextResponse.json(
      {
        success: true,
        count: availablePromos.length,
        data: availablePromos,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching promo codes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch promo codes",
      },
      { status: 500 }
    );
  }
}
