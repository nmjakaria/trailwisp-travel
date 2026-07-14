"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, Button, Table, Chip, toast } from "@heroui/react"; // ← TableHeader ইত্যাদি সরিয়ে ফেলুন
import { Compass, BookOpen, FolderPlus, ArrowRight, Check, Xmark } from "@gravity-ui/icons";
import { acceptBooking, updateBookingStatus } from "@/lib/api/bookings";
import { BsPeople } from "react-icons/bs";

interface AdminDashboardViewProps {
    user: any;
    initialBookings: any[];
    placesCount: number;
    initialStories: any[];
}

export default function AdminDashboardView({
    user,
    initialBookings,
    placesCount,
    initialStories,
}: AdminDashboardViewProps): React.JSX.Element {
    const [bookings, setBookings] = useState<any[]>(initialBookings);
    const [isMutating, setIsMutating] = useState<string | null>(null);

    // Dynamic metrics calculators
    const pendingBookings = bookings.filter((b) => b.status === "pending");
    const activeBookingsCount = bookings.filter((b) => b.status === "confirmed").length;

    // Approve booking status using your core server mutation utils
    const handleApprove = async (id: string) => {
        setIsMutating(id);
        try {
            const confirmedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            await acceptBooking(id, confirmedTime);
            setBookings((prev) =>
                prev.map((b) => (b._id === id ? { ...b, status: "confirmed" } : b))
            );
            toast.success("Booking confirmed successfully!");
        } catch (err: any) {
            toast.error(err.message || "Failed to accept booking.");
        } finally {
            setIsMutating(null);
        }
    };

    // Reject/Cancel booking status
    const handleReject = async (id: string) => {
        if (!confirm("Reject this booking request?")) return;
        setIsMutating(id);
        try {
            await updateBookingStatus(id, "cancelled");
            setBookings((prev) =>
                prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
            );
            toast.success("Booking cancelled.");
        } catch (err: any) {
            toast.warning(err.message || "Failed to reject booking.");
        } finally {
            setIsMutating(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Identity Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Admin <span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">HQ Overview</span>
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Review pending booking verifications, destination listings, and platform metrics.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Your exact dynamic Link with Button formatting */}
                    <Link href="/dashboard/admin/places/add">
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl px-4 h-10 shadow-sm shadow-teal-600/10">
                            Add New Place <FolderPlus size={14} />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ─── QUICK METRICS GRID ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Bookings */}
                <Card className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-row items-center gap-4 rounded-2xl">
                    <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl text-teal-600 dark:text-teal-400">
                        <Compass size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block">Total Bookings</span>
                        <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{bookings.length}</span>
                    </div>
                </Card>

                {/* Pending Requests Alert */}
                <Card className="p-5 border border-orange-200 dark:border-orange-900/40 bg-orange-50/20 dark:bg-orange-950/10 shadow-xs flex flex-row items-center gap-4 rounded-2xl">
                    <div className="p-3 bg-orange-100 dark:bg-orange-950/40 rounded-xl text-orange-600 dark:text-orange-400 animate-pulse">
                        <Compass size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-orange-600/80 dark:text-orange-400 font-semibold uppercase tracking-wider block">Pending Approval</span>
                        <span className="text-2xl font-black text-orange-600 dark:text-orange-400">{pendingBookings.length}</span>
                    </div>
                </Card>

                {/* Destination Places count */}
                <Card className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-row items-center gap-4 rounded-2xl">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400">
                        <BsPeople size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block">Active Places</span>
                        <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{placesCount}</span>
                    </div>
                </Card>

                {/* Curated Stories count */}
                <Card className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-row items-center gap-4 rounded-2xl">
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-500 dark:text-rose-400">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block">Total Stories</span>
                        <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{initialStories.length}</span>
                    </div>
                </Card>
            </div>

            {/* ─── PENDING BOOKINGS TABLE VIEW ─── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <Compass size={20} className="text-teal-600" />
                        Verification Requests Queue ({pendingBookings.length})
                    </h2>

                    <Link href="/dashboard/admin/bookings">
                        <Button size="sm" className="bg-teal-600 text-white font-semibold rounded-xl">
                            All Bookings <ArrowRight size={14} />
                        </Button>
                    </Link>
                </div>

                {pendingBookings.length === 0 ? (
                    <Card className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[1.5rem]">
                        <p className="text-sm text-zinc-500 font-medium">All clear! No pending booking verifications left in the system queue.</p>
                    </Card>
                ) : (
                    <Table className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Verification Queue Table">
                                <Table.Header>
                                    <Table.Column isRowHeader className="font-bold text-zinc-500">TRAVELER</Table.Column>
                                    <Table.Column className="font-bold text-zinc-500">DESTINATION PLACE</Table.Column>
                                    <Table.Column className="font-bold text-zinc-500">SCHEDULE</Table.Column>
                                    <Table.Column className="font-bold text-zinc-500 text-center">SEATS</Table.Column>
                                    <Table.Column className="font-bold text-zinc-500 text-right">ACTION CONTROLS</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {pendingBookings.map((booking) => (
                                        <Table.Row key={booking._id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                            <Table.Cell className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold">{booking.contactInfo?.fullName || "Guest User"}</span>
                                                    <span className="text-[10px] text-zinc-400 font-normal">{booking.contactInfo?.phone}</span>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="font-medium text-zinc-700 dark:text-zinc-300">
                                                {booking.placeId?.title || "Unknown Destination"}
                                            </Table.Cell>
                                            <Table.Cell className="text-zinc-650 dark:text-zinc-400 text-xs">
                                                <div className="font-medium text-zinc-800 dark:text-zinc-300">{booking.departureDate}</div>
                                                <div>{booking.departureTime}</div>
                                            </Table.Cell>
                                            <Table.Cell className="text-center font-bold text-zinc-850 dark:text-zinc-200">
                                                {booking.seats}
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="success"
                                                        variant="light"
                                                        className="rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                                        onClick={() => handleApprove(booking._id)}
                                                        isLoading={isMutating === booking._id}
                                                    >
                                                        <Check size={18} />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                        className="rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                                        onClick={() => handleReject(booking._id)}
                                                        isLoading={isMutating === booking._id}
                                                    >
                                                        <Xmark size={18} />
                                                    </Button>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                )}
            </div>
        </div>
    );
}