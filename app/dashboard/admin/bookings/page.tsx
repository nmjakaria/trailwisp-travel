"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Surface, Modal, Table, Spinner } from "@heroui/react";
import {
    Check,
    Xmark,
    TrashBin,
    Magnifier,
    Calendar,
    Clock,
    Envelope,
    Handset,
    CreditCard
} from "@gravity-ui/icons";
import { updateBookingStatus, deleteBooking, getAllBookings, acceptBooking } from "@/lib/api/bookings";

interface Booking {
    _id: string;
    placeId: {
        _id: string;
        title: string;
        price: number;
    } | null;
    seats: number;
    departureDate: string;
    departureTime: string;
    status: "pending" | "confirmed" | "cancelled";
    contactInfo: {
        fullName: string;
        phone: string;
        email: string;
    };
    createdAt: string;
}

export default function AdminManageBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("All");

    // Modal state configs for deletion validation
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [isActionSubmitting, setIsActionSubmitting] = useState<boolean>(false);

    // Initial Fetch Operations
    const loadAllBookings = async () => {
        try {
            setIsLoading(true);
            const res = await getAllBookings();
            const data = res?.data || (Array.isArray(res) ? res : []);
            setBookings(data);
        } catch (err) {
            console.error("Failed to compile administrative booking entries:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAllBookings();
    }, []);

    // Status Transition Updates
    const handleStatusTransition = async (bookingId: string, nextStatus: "confirmed" | "cancelled") => {
        try {
            const updated = nextStatus === "confirmed"
                ? await acceptBooking(bookingId)
                : await updateBookingStatus(bookingId, nextStatus);
            if (updated) {
                setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: nextStatus } : b));
            }
        } catch (err) {
            console.error(`Failed to update status to ${nextStatus}:`, err);
        }
    };

    // Open Delete Confirmation
    const handleInitiateDelete = (id: string) => {
        setSelectedBookingId(id);
        setIsDeleteOpen(true);
    };

    // Confirm Delete
    const handleConfirmDelete = async () => {
        if (!selectedBookingId) return;
        try {
            setIsActionSubmitting(true);
            await deleteBooking(selectedBookingId);
            setBookings(prev => prev.filter(b => b._id !== selectedBookingId));
            setIsDeleteOpen(false);
            setSelectedBookingId(null);
        } catch (err) {
            console.error("Critical failure during record exclusion pipeline execution:", err);
        } finally {
            setIsActionSubmitting(false);
        }
    };

    // Filter & Search Evaluation
    const filteredBookings = bookings.filter(b => {
        const matchesStatus = statusFilter === "All" || b.status === statusFilter;

        const searchTarget = `${b.contactInfo?.fullName || ""} ${b.contactInfo?.email || ""} ${b.placeId?.title || ""}`.toLowerCase();
        const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">

            {/* Upper Action/Header Panel */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Expeditions Booking Registry</h1>
                    <p className="text-xs text-zinc-500 mt-1">Review, authorize, and prune live user adventure reservations.</p>
                </div>

                {/* Filter Selector Row */}
                <div className="flex items-center gap-1.5 self-start bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
                    {["All", "pending", "confirmed", "cancelled"].map((status) => (
                        <button key={status} onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${statusFilter === status
                                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                                }`}
                        >
                            {status === "All" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sub-Header Input Search Box */}
            <div className="max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Magnifier className="text-zinc-400 size-4 mr-1.5" />
                </span>
                <Input
                    placeholder="Search by client name, email, or endpoint..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="bordered"
                    className="w-full"
                />
            </div>

            {/* Core Data Array Display */}
            {isLoading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
                    <Spinner size="lg" color="teal" />
                    <p className="text-xs text-zinc-500">Querying platform database structures...</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center">
                    <p className="text-sm text-zinc-400 font-medium">No booking modules matched your current query criteria.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    <th className="p-4 pl-6">Client Details</th>
                                    <th className="p-4">Destination Destination</th>
                                    <th className="p-4">Date & Scale</th>
                                    <th className="p-4">Aggregate Cost</th>
                                    <th className="p-4">Registration Status</th>
                                    <th className="p-4 pr-6 text-right">Admin Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800 text-sm">
                                {filteredBookings.map((b) => {
                                    const totalCost = (b.placeId?.price || 0) * b.seats;

                                    return (
                                        <tr key={b._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                                            {/* Client Column */}
                                            <td className="p-4 pl-6">
                                                <div className="font-bold text-zinc-900 dark:text-zinc-50">
                                                    {b.contactInfo?.fullName || "Unspecified Profile"}
                                                </div>
                                                <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-zinc-400">
                                                    <span className="flex items-center gap-1">
                                                        <Envelope className="size-3 shrink-0" /> {b.contactInfo?.email || "No Email"}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Handset className="size-3 shrink-0" /> {b.contactInfo?.phone || "No Number"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Destination Column */}
                                            <td className="p-4">
                                                <div className="font-semibold text-zinc-800 dark:text-zinc-200 max-w-[200px] truncate">
                                                    {b.placeId?.title || "Undefined Framework Asset"}
                                                </div>
                                                <span className="text-[10px] text-zinc-400 block mt-0.5">ID: {b.placeId?._id || "N/A"}</span>
                                            </td>

                                            {/* Date Info */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium">
                                                    <Calendar className="size-3.5 text-teal-600" />
                                                    {b.departureDate ? new Date(b.departureDate).toLocaleDateString() : "N/A"}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                                                    <Clock className="size-3.5" /> {b.departureTime || "N/A"} • {b.seats} {b.seats === 1 ? "seat" : "seats"}
                                                </div>
                                            </td>

                                            {/* Cost Calculations */}
                                            <td className="p-4 font-bold text-zinc-900 dark:text-zinc-50">
                                                ৳{b.totalPrice?.toLocaleString("en-BD") || "N/A"}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="p-4">
                                                <span className={`... ${b.status === "confirmed"
                                                    ? "bg-emerald-50 ..."
                                                    : b.status === "cancelled"
                                                        ? "bg-rose-50 ..."
                                                        : "bg-amber-50 ..."
                                                    }`}>
                                                    <span className={`... ${b.status === "confirmed" ? "bg-emerald-500" : b.status === "cancelled" ? "bg-rose-500" : "bg-amber-500"}`} />
                                                    {b.status}
                                                </span>
                                            </td>

                                            {/* Operations Panel */}
                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {b.status === "Pending" && (
                                                        <>
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="flat"
                                                                className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 rounded-lg"
                                                                onClick={() => handleStatusTransition(b._id, "Approved")}
                                                                title="Approve Booking"
                                                            >
                                                                <Check className="size-4" />
                                                            </Button>
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="flat"
                                                                className="text-rose-600 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 rounded-lg"
                                                                onClick={() => handleStatusTransition(b._id, "Rejected")}
                                                                title="Reject Booking"
                                                            >
                                                                <Xmark className="size-4" />
                                                            </Button>
                                                        </>
                                                    )}

                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="flat"
                                                        className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                                                        onClick={() => handleInitiateDelete(b._id)}
                                                        title="Delete Entry"
                                                    >
                                                        <TrashBin className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Composite Deletion Modal Backdrop Layer */}
            <Modal isOpen={isDeleteOpen} onOpenChange={(open: boolean) => { if (!open) setIsDeleteOpen(false); }}>
                <Modal.Backdrop>
                    <Modal.Container placement="auto">
                        <Modal.Dialog className="sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                            <Modal.CloseTrigger />

                            <Modal.Header className="p-6 pb-2">
                                <Modal.Heading className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                    Confirm Removal Protocol
                                </Modal.Heading>
                                <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
                                    Are you certain you want to purge this booking document? This structural delete routine is permanent.
                                </p>
                            </Modal.Header>
                            <Modal.Footer className="p-6 pt-4 flex gap-2 justify-end">
                                <Button
                                    variant="secondary"
                                    className="rounded-xl"
                                    onClick={() => setIsDeleteOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isActionSubmitting}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                                    onClick={handleConfirmDelete}
                                >
                                    {isActionSubmitting ? "Deleting..." : "Delete Entry"}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}