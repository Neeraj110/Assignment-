// models/Booking.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  experienceId: mongoose.Types.ObjectId;
  experienceTitle: string;
  fullName: string;
  email: string;
  date: string;
  time: string;
  quantity: number;
  pricePerPerson: number;
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: "Experience",
      required: [true, "Experience ID is required"],
      index: true,
    },
    experienceTitle: {
      type: String,
      required: [true, "Experience title is required"],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
      index: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      max: [20, "Cannot book more than 20 slots at once"],
    },
    pricePerPerson: {
      type: Number,
      required: [true, "Price per person is required"],
      min: [0, "Price cannot be negative"],
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    total: {
      type: Number,
      required: [true, "Total is required"],
      min: [0, "Total cannot be negative"],
    },
    promoCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: {
        values: ["confirmed", "pending", "cancelled"],
        message: "Status must be confirmed, pending, or cancelled",
      },
      default: "confirmed",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for preventing duplicate bookings
BookingSchema.index({ experienceId: 1, date: 1, time: 1, email: 1 });

// Index for user's booking history
BookingSchema.index({ email: 1, createdAt: -1 });

// Pre-save hook to calculate totals
BookingSchema.pre("save", function (next) {
  if (this.isModified("quantity") || this.isModified("pricePerPerson")) {
    this.subtotal = this.quantity * this.pricePerPerson;
  }
  if (this.isModified("subtotal") || this.isModified("discount")) {
    this.total = Math.max(0, this.subtotal - this.discount);
  }
  next();
});

// Method to format booking details
BookingSchema.methods.getConfirmationDetails = function () {
  return {
    bookingId: this._id,
    experience: this.experienceTitle,
    name: this.fullName,
    email: this.email,
    date: this.date,
    time: this.time,
    quantity: this.quantity,
    total: this.total,
    status: this.status,
  };
};

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
