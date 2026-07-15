// lib/api/users.ts
'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { authFetch, mutate } from '../core/server'; // Adjust this import path as needed

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface GetUsersResponse {
  users: UserItem[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

/**
 * Fetch users with optional search and pagination
 */
export const getUsers = async (page = 1, limit = 10, search = ''): Promise<GetUsersResponse> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });

  return authFetch<GetUsersResponse>(`/api/admin/users?${queryParams.toString()}`, {
    tags: ['admin-users'],
  });
};

/**
 * Change a user's authorization role
 */
export const updateUserRole = async (userId: string, role: UserItem['role']): Promise<UserItem> => {
  const result = await mutate<UserItem>(`/api/admin/users/${userId}/role`, { role }, 'PATCH');
  
  // Clear any cached admin statistics and refresh user data paths
  updateTag('admin-stats');
  updateTag('admin-users');
  revalidatePath('/dashboard/admin/user');
  
  return result;
};

/**
 * Delete a user account from the system entirely
 */
export const deleteUser = async (userId: string): Promise<{ success: boolean; message: string }> => {
  const result = await mutate<{ success: boolean; message: string }>(
    `/api/admin/users/${userId}`,
    undefined,
    'DELETE'
  );

  updateTag('admin-stats');
  updateTag('admin-users');
  revalidatePath('/dashboard/admin/user');

  return result;
};