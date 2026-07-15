/* eslint-disable react/no-unescaped-entities */
// ─── CLIENT COMPONENTS ───
"use client";

import { useState } from "react";
import { Card, Button, Table, Chip, toast, Modal } from "@heroui/react";
import { Compass, TrashBin, ArrowRight } from "@gravity-ui/icons";
import { cancelMyBooking } from "@/lib/api/bookings";
import Link from "next/link";

export default function BookingsManagerView({ initialBookings }: { initialBookings: any[] }) {
    const [bookings, setBookings] = useState<any[]>(initialBookings);
    const [isMutating, setIsMutating] = useState<string | null>(null);

    // Modal control state matching the composite modal API structure
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [targetBookingId, setTargetBookingId] = useState<string | null>(null);

    // Triggers the confirm modal
    const initiateCancellation = (bookingId: string) => {
        setTargetBookingId(bookingId);
        setIsModalOpen(true);
    };

    // Executes backend API call on user confirmation
    const handleConfirmCancel = async () => {
        if (!targetBookingId) return;

        setIsModalOpen(false); // Close modal immediately to maintain UI responsiveness
        setIsMutating(targetBookingId);

        try {
            await cancelMyBooking(targetBookingId);
            setBookings((prev) => prev.filter((b) => b._id !== targetBookingId));
            toast.success("Booking cancelled successfully");
        } catch (err: any) {
            toast.warning(err.message || "Failed to cancel booking");
        } finally {
            setIsMutating(null);
            setTargetBookingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <Compass className="text-teal-600" /> My Bookings
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Track, check status, or manage your upcoming reservation details.
                    </p>
                </div>
                <Link href="/destinations">
                    <Button size="sm" className="bg-teal-600 text-white font-semibold rounded-xl">
                        Explore More Places <ArrowRight size={14} />
                    </Button>
                </Link>
            </div>

            {bookings.length === 0 ? (
                <Card className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[1.5rem]">
                    <p className="text-sm text-zinc-500">You don't have any travel bookings listed yet.</p>
                </Card>
            ) : (
                <Table className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Bookings Sub-Table">
                            <Table.Header>
                                <Table.Column isRowHeader className="font-bold text-zinc-500">PLACE</Table.Column>
                                <Table.Column className="font-bold text-zinc-500">DATE & TIME</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-center">SEATS</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-right">AMOUNT</Table.Column>
                                <Table.Column className="font-bold text-zinc-500">STATUS</Table.Column>
                                <Table.Column className="font-bold text-zinc-500 text-right">ACTIONS</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {bookings.map((booking) => (
                                    <Table.Row key={booking._id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                        <Table.Cell className="font-semibold text-zinc-900 dark:text-zinc-150">
                                            {booking.placeId?.title || "Unknown Destination"}
                                        </Table.Cell>
                                        <Table.Cell className="text-zinc-650 dark:text-zinc-400 text-xs">
                                            <div className="font-medium text-zinc-800 dark:text-zinc-350">{booking.departureDate}</div>
                                            <div>{booking.departureTime}</div>
                                        </Table.Cell>
                                        <Table.Cell className="text-center font-bold text-zinc-850 dark:text-zinc-200">
                                            {booking.seats}
                                        </Table.Cell>
                                        <Table.Cell className="text-right font-bold text-zinc-800 dark:text-zinc-200">
                                            ৳{booking.totalPrice?.toLocaleString("en-BD") || "N/A"}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Chip
                                                size="sm"
                                                variant="outline"
                                                color={booking.status === "confirmed" ? "success" : booking.status === "pending" ? "warning" : "danger"}
                                                className="font-bold uppercase tracking-wide text-[9px] px-2 rounded-lg"
                                            >
                                                {booking.status}
                                            </Chip>
                                        </Table.Cell>
                                        <Table.Cell className="text-right">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="outline"
                                                color="danger"
                                                onClick={() => initiateCancellation(booking._id)}
                                                isLoading={isMutating === booking._id}
                                                isDisabled={booking.status === "cancelled"}
                                                className="rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                            >
                                                <TrashBin size={16} />
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            )}

            {/* Custom Confirm Deletion Modal Backdrop Layer */}
            <Modal isOpen={isModalOpen} onOpenChange={(open: boolean) => { if (!open) setIsModalOpen(false); }}>
                <Modal.Backdrop>
                    <Modal.Container placement="auto">
                        <Modal.Dialog className="sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                            <Modal.CloseTrigger />

                            <Modal.Header className="p-6 pb-2">
                                <Modal.Heading className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                    Cancel Booking
                                </Modal.Heading>
                                <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">
                                    Are you sure you want to cancel this booking? This action cannot be undone.
                                </p>
                            </Modal.Header>
                            <Modal.Footer className="p-6 pt-4 flex gap-2 justify-end">
                                <Button
                                    variant="secondary"
                                    className="rounded-xl"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    No, Keep Booking
                                </Button>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                                    onClick={handleConfirmCancel}
                                >
                                    Yes, Cancel Booking
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}