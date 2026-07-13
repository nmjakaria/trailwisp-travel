// =========================================================================
// 👤 USER TYPES
// =========================================================================

export type UserRole = 'user' | 'admin';

export interface IUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// ✈️ DESTINATION / PLACE TYPES
// =========================================================================

export type PlaceCategory = 'Beach' | 'Mountain' | 'City' | 'Adventure' | 'Cultural';

export interface IPlace {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  price: number;
  location: string;
  category: PlaceCategory;
  duration: string;
  availableDates: string[]; // ISO string format for date handling
  rating: number;
  likesCount: number;
  isFeatured: boolean;
  createdBy: string | IUser; // Can be just ID string or fully populated User object
  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// 🎫 BOOKING TYPES
// =========================================================================

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface IContactInfo {
  fullName: string;
  phone: string;
  email: string;
}

export interface IBooking {
  _id: string;
  userId: string | IUser;
  placeId: string | IPlace;
  seats: number;
  departureDate: string;
  departureTime: string;
  contactInfo: IContactInfo;
  status: BookingStatus;
  adminConfirmedTime?: string;
  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// 📖 STORY / BLOG TYPES
// =========================================================================

export interface IStory {
  _id: string;
  userId: string | IUser;
  title: string;
  shortDescription: string;
  content: string;
  images: string[];
  destinationTag: string;
  likesCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// 📰 NEWS / TICKER TYPES
// =========================================================================

export interface INewsItem {
  _id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}