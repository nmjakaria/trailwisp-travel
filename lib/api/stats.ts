'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { publicFetch, authFetch } from '../core/server'; // Adjust this path to where your core/server file lives

// Define structural types returned from the Express backend
export interface AdminTotals {
  totalUsers: number;
  totalPlaces: number;
  totalBookings: number;
  totalStories: number;
  totalComments: number;
}

export interface BookingTrendItem {
  _id: string; // "YYYY-MM-DD"
  count: number;
}

export interface TopDestinationItem {
  _id: string;
  bookings: number;
  title: string;
}

export interface CategoryDistributionItem {
  _id: string; // Category Name
  count: number;
}

export interface AdminStatsData {
  totals: AdminTotals;
  bookingsOverTime: BookingTrendItem[];
  topDestinations: TopDestinationItem[];
  categoryDistribution: CategoryDistributionItem[];
}

export interface PublicStatsData {
  totalDestinations: number;
  totalStories: number;
  totalTravelers: number;
}

/**
 * Fetch public-facing statistics (unauthenticated)
 */
export const getPublicStats = async (): Promise<PublicStatsData> => {
  return publicFetch<PublicStatsData>('/api/stats/public', { 
    tags: ['public-stats'] 
  });
};

/**
 * Fetch comprehensive dashboard metrics (requires JWT & Admin privileges)
 */
export const getAdminStats = async (): Promise<AdminStatsData> => {
  return authFetch<AdminStatsData>('/api/stats/admin', {
    tags: ['admin-stats']
  });
};

/**
 * Trigger an on-demand refresh of the admin statistics cache.
 * Useful if you perform actions like manual syncs or want to force-revalidate.
 */
export const revalidateAdminStats = async () => {
  updateTag('admin-stats');
  revalidatePath('/dashboard/admin');
};