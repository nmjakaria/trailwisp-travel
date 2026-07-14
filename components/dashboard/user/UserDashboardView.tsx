/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Card, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, toast } from "@heroui/react";
import { Compass, Heart, BookOpen, Clock, TrashBin, ArrowRight, Star } from "@gravity-ui/icons";
import { cancelMyBooking } from "@/lib/api/bookings";
import { removeFromWishlist } from "@/lib/api/wishlist";
import Link from "next/link";

interface SessionUser {
    name: string;
    email: string;
    image?: string;
    role: "user" | "admin";
}

interface UserDashboardViewProps {
    user: SessionUser;
    initialBookings: any[];
    initialWishlist: any[];
    initialStories: any[];
}

export default function UserDashboardView({
    user,
    initialBookings,
    initialWishlist,
    initialStories,
}: UserDashboardViewProps): React.JSX.Element {
    const [bookings, setBookings] = useState<any[]>(initialBookings);
    const [wishlist, setWishlist] = useState<any[]>(initialWishlist);
    const [isMutating, setIsMutating] = useState<string | null>(null);

    // Cancel a trip booking
    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;
        setIsMutating(bookingId);
        try {
            await cancelMyBooking(bookingId);
            setBookings((prev) => prev.filter((b) => b._id !== bookingId));
            toast.success("Booking cancelled successfully", { timeout: 3000 });
        } catch (err: any) {
            toast.error(err.message || "Failed to cancel booking");
        } finally {
            setIsMutating(null);
        }
    };

    // Remove item from wishlist
    const handleRemoveWishlist = async (wishlistId: string) => {
        setIsMutating(wishlistId);
        try {
            await removeFromWishlist(wishlistId);
            setWishlist((prev) => prev.filter((w) => w._id !== wishlistId));
            toast.success("Removed from your wishlist");
        } catch (err: any) {
            toast.error(err.message || "Failed to remove item");
        } finally {
            setIsMutating(null);
        }
    };

    return (
        <div className="space-y-8">

            {/* Dynamic Welcome Heading */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Welcome back, <span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">{user.name.split(" ")[0]}</span>!
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Manage your upcoming experiences, pinned destinations, and written stories.
                </p>
            </div>

            {/* ─── QUICK METRICS GRID ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Bookings Counter */}
                <Card className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-row items-center gap-4 rounded-2xl">
                    <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl text-teal-600 dark:text-teal-400">
                        <Compass size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block">My Bookings</span>
                        <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{bookings.length}</span>
                    </div>
                </Card>

                {/* Wishlist Counter */}
                <Card className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-row items-center gap-4 rounded-2xl">
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-500 dark:text-rose-400">
                        <Heart size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block">My Wishlist</span>
                        <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{wishlist.length}</span>
                    </div>
                </Card>

                {/* Travel Stories Counter */}
                <Card className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-row items-center gap-4 rounded-2xl">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block">My Stories</span>
                        <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{initialStories.length}</span>
                    </div>
                </Card>

                {/* Account Status Badge */}
                <Card className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-row items-center gap-4 rounded-2xl">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400">
                        <Clock size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block">Account Type</span>
                        <span className="text-md font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block mt-0.5">Verified Traveler</span>
                    </div>
                </Card>
            </div>

            {/* ─── MAIN COLUMN / SIDE CONTENT SPLIT ─── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

                {/* Left Columns (Bookings) */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                            <Compass size={20} className="text-teal-600" />
                            My Travel Bookings
                        </h2>
                        <Link
                            href="/destinations">
                            <Button size="sm" className="bg-teal-600 text-white font-semibold rounded-xl">
                                Browse places <ArrowRight size={14} />
                            </Button>
                        </Link>
                    </div>

                    {bookings.length === 0 ? (
                        <Card className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[1.5rem]">
                            <p className="text-sm text-zinc-500">You don't have any travel bookings listed yet.</p>
                            <div className="mt-4">
                                <Link
                                    href="/destinations"
                                >
                                    <Button size="sm" className="bg-teal-600 text-white font-semibold rounded-xl">
                                        Start Booking Trips
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ) : (
                        <Table aria-label="Bookings Table" className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden" shadow="none">
                            <TableHeader>
                                <TableColumn className="font-bold text-zinc-500">PLACE</TableColumn>
                                <TableColumn className="font-bold text-zinc-500">DATE & TIME</TableColumn>
                                <TableColumn className="font-bold text-zinc-500 text-center">SEATS</TableColumn>
                                <TableColumn className="font-bold text-zinc-500">STATUS</TableColumn>
                                <TableColumn className="font-bold text-zinc-500 text-right">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((booking) => (
                                    <TableRow key={booking._id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                        <TableCell className="font-semibold text-zinc-900 dark:text-zinc-150">
                                            {booking.placeId?.title || "Unknown Destination"}
                                        </TableCell>
                                        <TableCell className="text-zinc-650 dark:text-zinc-400 text-xs">
                                            <div className="font-medium text-zinc-800 dark:text-zinc-350">{booking.departureDate}</div>
                                            <div>{booking.departureTime}</div>
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-zinc-850 dark:text-zinc-200">
                                            {booking.seats}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color={booking.status === "confirmed" ? "success" : booking.status === "pending" ? "warning" : "danger"}
                                                className="font-bold uppercase tracking-wide text-[9px] px-2 rounded-lg"
                                            >
                                                {booking.status}
                                            </Chip>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="danger"
                                                onClick={() => handleCancelBooking(booking._id)}
                                                isLoading={isMutating === booking._id}
                                                isDisabled={booking.status === "cancelled"}
                                                className="rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                            >
                                                <TrashBin size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Right Column (Wishlist) */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                            <Heart size={20} className="text-rose-500" />
                            My Wishlist
                        </h2>
                    </div>

                    {wishlist.length === 0 ? (
                        <Card className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[1.5rem]">
                            <p className="text-xs text-zinc-400">Your wishlist is empty.</p>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {wishlist.map((item) => (
                                <Card key={item._id} className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl flex flex-row items-center justify-between gap-4 shadow-xs">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                            {item.placeId?.title}
                                        </span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-zinc-500">{item.placeId?.location}</span>
                                            <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                                                <Star size={10} className="fill-current" />
                                                {item.placeId?.rating ?? "4.5"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            as={Link}
                                            href={`/destinations/${item.placeId?._id}`}
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            className="rounded-lg text-teal-600"
                                        >
                                            <ArrowRight size={16} />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                            onClick={() => handleRemoveWishlist(item._id)}
                                            isLoading={isMutating === item._id}
                                            className="rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                        >
                                            <TrashBin size={16} />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}