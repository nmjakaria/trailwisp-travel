"use client";

import React, { useState } from "react";
import { Modal, Button, TextField, Label, Input, Surface } from "@heroui/react";
import { CircleCheck, Calendar, Clock } from "@gravity-ui/icons";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    placeId: string;
    placeTitle: string;
    pricePerPerson: number;
    availableDates: string[]; // 
    onSubmitBooking: (bookingData: any) => Promise<boolean>;
}

export default function BookingModal({
    isOpen,
    onClose,
    placeId,
    placeTitle,
    pricePerPerson,
    availableDates,
    onSubmitBooking
}: BookingModalProps) {
    const [seats, setSeats] = useState<number>(1);
    const [departureDate, setDepartureDate] = useState<string>("");
    const [departureTime, setDepartureTime] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            placeId,
            seats,
            departureDate,
            departureTime,
            contactInfo: {
                fullName,
                phone,
                email
            }
        };

        const success = await onSubmitBooking(payload);
        setIsSubmitting(false);
        if (success) {
            setIsSuccess(true);
        }
    };

    const handleCloseReset = () => {
        setIsSuccess(false);
        setSeats(1);
        setDepartureDate("");
        setDepartureTime("");
        setFullName("");
        setPhone("");
        setEmail("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={(open: boolean) => { if (!open) handleCloseReset(); }}>
            <Modal.Backdrop>
                <Modal.Container placement="auto">
                    <Modal.Dialog className="sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                        <Modal.CloseTrigger />

                        {isSuccess ? (
                            <div className="p-8 text-center space-y-4">
                                <div className="mx-auto size-12 bg-teal-50 dark:bg-teal-950/40 text-teal-600 rounded-full flex items-center justify-center">
                                    <CircleCheck className="size-6" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Reservation Requested</h3>
                                <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                                    Your booking protocol for <strong>{placeTitle}</strong> is pending confirmation.
                                </p>
                                <Button className="w-full bg-teal-600 text-white font-bold rounded-xl mt-2" onClick={handleCloseReset}>
                                    Dismiss Setup
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Modal.Header className="p-6 pb-2">
                                    <Modal.Heading className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Book Expedition</Modal.Heading>
                                    <p className="mt-1 text-xs text-zinc-400 block truncate">{placeTitle}</p>
                                </Modal.Header>

                                <Modal.Body className="px-6 py-2">
                                    <Surface variant="default" className="bg-transparent shadow-none border-0 p-0">
                                        <form id="modal-booking-form" onSubmit={handleSubmit} className="flex flex-col gap-4">

                                            <div className="grid grid-cols-3 gap-3">
                                                <TextField className="col-span-1" name="seats" variant="secondary">
                                                    <Label className="text-xs font-semibold mb-1 block text-zinc-500">Seats</Label>
                                                    <Input type="number" min={1} max={6} value={String(seats)} onChange={(e) => setSeats(Number(e.target.value))} required />
                                                </TextField>

                                                <TextField className="col-span-2" name="departureDate" variant="secondary">
                                                    <Label className="text-xs font-semibold mb-1 block text-zinc-500">Departure Date</Label>
                                                    <select
                                                        value={departureDate}
                                                        onChange={(e) => setDepartureDate(e.target.value)}
                                                        required
                                                        className="w-full h-10 px-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-transparent text-sm dark:text-zinc-200"
                                                    >
                                                        <option value="">Select a date</option>
                                                        {availableDates.map((date) => (
                                                            <option key={date} value={date}>
                                                                {new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </TextField>
                                            </div>

                                            <TextField name="departureTime" variant="secondary">
                                                <Label className="text-xs font-semibold mb-1 block text-zinc-500">Departure Time</Label>
                                                <Input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required />
                                            </TextField>

                                            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-1">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">Contact Context</span>
                                                <div className="flex flex-col gap-3">
                                                    <TextField name="fullName" variant="secondary">
                                                        <Label className="text-xs font-semibold mb-1 block text-zinc-500">Full Name</Label>
                                                        <Input placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                                    </TextField>

                                                    <TextField name="phone" variant="secondary">
                                                        <Label className="text-xs font-semibold mb-1 block text-zinc-500">Phone</Label>
                                                        <Input placeholder="Enter phone number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                                    </TextField>

                                                    <TextField name="email" variant="secondary">
                                                        <Label className="text-xs font-semibold mb-1 block text-zinc-500">Email Address</Label>
                                                        <Input placeholder="Enter email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                                    </TextField>
                                                </div>
                                            </div>

                                            <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800 p-3 rounded-xl flex justify-between items-center text-xs mt-1">
                                                <span className="text-zinc-500">Estimated Sum (৳{pricePerPerson.toLocaleString("en-BD")} × {seats}):</span>
                                                <span className="font-bold text-zinc-900 dark:text-zinc-50">৳{(pricePerPerson * seats).toLocaleString("en-BD")}</span>
                                            </div>
                                        </form>
                                    </Surface>
                                </Modal.Body>

                                <Modal.Footer className="p-6 pt-4 flex gap-2 justify-end">
                                    <Button variant="secondary" onClick={handleCloseReset} className="rounded-xl">
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        form="modal-booking-form"
                                        disabled={isSubmitting}
                                        className="bg-teal-600 text-white font-bold rounded-xl"
                                    >
                                        {isSubmitting ? "Processing..." : "Confirm Request"}
                                    </Button>
                                </Modal.Footer>
                            </>
                        )}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}