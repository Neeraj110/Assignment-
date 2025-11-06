import mongoose, { Document, Schema } from "mongoose";

export interface ISlot {
  date: string;
  time: string;
  booked: number;
  capacity: number;
}

export interface IExperience extends Document {
  title: string;
  location: string;
  image: string;
  description: string;
  price: number;
  about: string;
  availableDates: string[];
  availableTimes: string[];
  slots: ISlot[];
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new Schema<ISlot>(
  {
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
    booked: {
      type: Number,
      default: 0,
      min: [0, "Booked slots cannot be negative"],
    },
    capacity: {
      type: Number,
      default: 10,
      min: [1, "Capacity must be at least 1"],
    },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    about: {
      type: String,
      required: [true, "About section is required"],
      trim: true,
    },
    availableDates: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    availableTimes: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    slots: [SlotSchema],
  },
  {
    timestamps: true,
  }
);

ExperienceSchema.index({ title: 1, location: 1 });
ExperienceSchema.index({ "slots.date": 1, "slots.time": 1 });

const Experience =
  mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema);

export default Experience;
