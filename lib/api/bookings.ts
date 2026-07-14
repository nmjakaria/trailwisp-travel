//lib/api/bookings.ts
'use server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { authFetch, mutate } from '../core/server';

export interface CreateBookingInput {
    placeId: string;
    seats: number;
    departureDate: string;
    departureTime: string;
    contactInfo: { fullName: string; phone: string; email: string };
}

export const createBooking = async (data: CreateBookingInput) => {
    const result = await mutate('/api/bookings', data, 'POST');
    revalidatePath('/dashboard/bookings');
    revalidateTag('places'); // bookingsCount বদলে যেতে পারে
    return result;
};

export const getMyBookings = async () => authFetch('/api/bookings/mine');

export const cancelMyBooking = async (id: string) => {
    const result = await mutate(`/api/bookings/${id}`, undefined, 'DELETE');
    revalidatePath('/dashboard/bookings');
    return result;
};

// --- Admin ---
export const getAllBookings = async (status?: string) =>
    authFetch(`/api/admin/bookings${status ? `?status=${status}` : ''}`);

export const acceptBooking = async (id: string, adminConfirmedTime?: string) => {
    const result = await mutate(`/api/admin/bookings/${id}/accept`, { adminConfirmedTime }, 'PUT');
    revalidatePath('/dashboard/admin/bookings');
    return result;
};

export const updateBookingStatus = async (id: string, status: string) => {
    const result = await mutate(`/api/admin/bookings/${id}/status`, { status }, 'PUT');
    revalidatePath('/dashboard/admin/bookings');
    return result;
};

export const deleteBooking = async (id: string) => {
    const result = await mutate(`/api/admin/bookings/${id}`, undefined, 'DELETE');
    revalidatePath('/dashboard/admin/bookings');
    return result;
};