// types/api.ts
// API Request/Response Types

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  count: number;
  page?: number;
  totalPages?: number;
}

// Experience Types
export interface ExperienceListItem {
  _id: string;
  title: string;
  location: string;
  image: string;
  description: string;
  price: number;
  availableDates: string[];
  availableTimes: string[];
}

export interface SlotAvailability {
  date: string;
  time: string;
  available: number;
  capacity?: number;
  status?: "available" | "limited" | "sold_out";
}

export interface ExperienceDetail extends ExperienceListItem {
  about: string;
  availableSlots: SlotAvailability[];
  totalAvailableSlots: number;
}

// Booking Types
export interface BookingRequest {
  experienceId: string;
  title: string;
  price: number;
  quantity: number;
  selectedDate: string;
  selectedTime: string;
  fullName: string;
  email: string;
  phone?: string;
  promoCode?: string;
}

export interface PromoDetails {
  code: string;
  type: "percent" | "flat";
  value: number;
  discount: number;
}

export interface BookingResponse {
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
  promoApplied?: PromoDetails;
  status: string;
}

export interface BookingHistoryItem {
  _id: string;
  experienceId: string;
  experienceTitle: string;
  fullName: string;
  email: string;
  date: string;
  time: string;
  quantity: number;
  total: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

// Promo Code Types
export interface PromoValidateRequest {
  code: string;
  amount: number;
}

export interface PromoValidateResponse {
  valid: boolean;
  code?: string;
  type?: "percent" | "flat";
  value?: number;
  discount?: number;
  finalAmount?: number;
  savings?: number;
  message: string;
  description?: string;
  error?: string;
  minAmount?: number;
}

export interface PromoCode {
  code: string;
  type: "percent" | "flat";
  value: number;
  minAmount: number;
  description: string;
}

// Error Response Type
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  details?: any;
}
