/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Spinner, toast } from "@heroui/react";
import {
    ChevronLeft,
    MapPin,
    Clock,
    Layers3Diagonal,
    StarFill,
    Tag,
    CircleCheck,
    ArrowUpRight,
    Heart,
    HeartFill,
    Bookmark,
    BookmarkFill
} from "@gravity-ui/icons";
import { getPlaceById } from "@/lib/api/places";
import CommentSection from "@/components/destinations/CommentSection";
import BookingModal from "@/components/destinations/BookingModal";
import { toggleLike } from "@/lib/api/likes";
import { getMyWishlist, addToWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { getUserSession, requireAuth, requireNotBlocked } from "@/lib/core/session";
import { useSession } from "@/lib/auth-client";
import { createBooking } from "@/lib/api/bookings";


interface Place {
    _id: string;
    title: string;
    location: string;
    price: number;
    category: string;
    duration: string;
    images: string[];
    rating?: number;
    shortDescription?: string;
    description?: string;
    highlights?: string[];
    included?: string[];
}

export default function DestinationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [place, setPlace] = useState<Place | null>(null);
    const [activeImage, setActiveImage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Interactive Core States
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
    const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

    const { data: session, isPending: isSessionLoading } = useSession();
    const isLoggedIn = !!session?.user;
    const currentUserId = session?.user?.id;


    useEffect(() => {
        if (!id) return;

        async function loadDestinationDetails() {
            try {
                setIsLoading(true);

                const res = await getPlaceById(id);
                const data = res?.data || (Array.isArray(res) ? res[0] : res);

                if (data) {
                    setPlace(data);
                    if (data.images && data.images.length > 0) {
                        setActiveImage(data.images[0]);
                    }
                } else {
                    setError("Destination parameters could not be retrieved.");
                }
            } catch (err) {
                console.error("Error reading single package details structure:", err);
                setError("Failed to resolve destination framework data nodes.");
            } finally {
                setIsLoading(false);
            }
        }

        loadDestinationDetails();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        async function checkWishlistStatus() {
            try {
                const res = await getMyWishlist();
                const items = res?.data || (Array.isArray(res) ? res : []);
                const existing = items.find(
                    (item: any) => (item.placeId?._id || item.placeId) === id
                );
                if (existing) {
                    setIsWishlisted(true);
                    setWishlistItemId(existing._id);
                }
            } catch (err) {
                console.error("Failed to check wishlist status:", err);
            }
        }

        checkWishlistStatus();
    }, [id]);

    const handleToggleLike = async () => {
        await requireAuth();
        await requireNotBlocked();
        try {
            await toggleLike(id, 'place');
            setIsLiked(!isLiked);
            toast.success(`Adventure profile ${isLiked ? "unliked" : "liked"} successfully!`);
        } catch (err) {
            console.error("Failed adjusting like state mapping metrics:", err);
        }
    };

    const handleToggleWishlist = async () => {
        await requireAuth();
        await requireNotBlocked();
        try {
            if (isWishlisted && wishlistItemId) {
                await removeFromWishlist(wishlistItemId);
                setIsWishlisted(false);
                setWishlistItemId(null);
                toast.success("Removed from wishlist.");
            } else {
                const created = await addToWishlist(id);
                const newItem = created?.data || created;
                setIsWishlisted(true);
                setWishlistItemId(newItem?._id || null);
                toast.success("Added to wishlist!");
            }
        } catch (err) {
            console.error("Failed adjusting wishlist toggle:", err);
            toast.warning("Could not update wishlist.");
        }
    };

    const handleProcessBookingRequest = async (bookingData: any): Promise<boolean> => {
        await requireAuth();
        await requireNotBlocked();
        try {
            await createBooking(bookingData);
            toast.success("Booking request submitted successfully!");
            return true;
        } catch (err: any) {
            console.error("API submission error inside reservation module mapping:", err);
            toast.warning(err.message || "Failed to submit booking request.");
            return false;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <Spinner size="lg" color="teal" />
                <p className="text-sm font-medium text-zinc-500">Retrieving adventure profile metadata...</p>
            </div>
        );
    }

    if (error || !place) {
        return (
            <div className="max-w-md mx-auto my-20 text-center px-4">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Adventure Profile Offline</h2>
                <p className="text-sm text-zinc-500 mb-6">{error || "The destination layout could not be verified."}</p>
                <Button
                    variant="outline"
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 font-semibold"
                    onClick={() => router.push("/destinations")}
                >
                    Return to Catalog
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

            {/* Navigation Header Action Controls */}
            <div className="flex items-center justify-between">
                <Button
                    onClick={() => router.push("/destinations")}
                    variant="outline"
                    className="group flex items-center gap-2 font-semibold text-zinc-600 dark:text-zinc-400 hover:text-teal-600 transition-colors px-0 bg-transparent min-w-0"
                >
                    <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
                    Back to Catalog
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        isIconOnly
                        variant="outline"
                        radius="full"
                        onClick={handleToggleLike}
                        className={isLiked ? "text-red-500 border-red-500 bg-red-50 dark:bg-red-950/20" : "text-zinc-400 border-zinc-300 dark:border-zinc-600"}
                    >
                        {isLiked ? <HeartFill className="size-5" /> : <Heart className="size-5" />}
                    </Button>

                    <Button
                        isIconOnly
                        variant="outline"
                        radius="full"
                        onClick={handleToggleWishlist}
                        className={isWishlisted ? "text-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-950/20" : "text-zinc-400 border-zinc-300 dark:border-zinc-600"}
                    >
                        {isWishlisted ? <BookmarkFill className="size-5" /> : <Bookmark className="size-5" />}
                    </Button>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30 ml-2">
                        <Tag className="size-3.5" /> {place.category}
                    </span>
                </div>
            </div>

            {/* Title & Core Meta Stack Banner */}
            <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {place.title}
                </h1>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5 font-medium">
                        <MapPin className="text-teal-600 size-4 shrink-0" /> {place.location}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="text-teal-600 size-4 shrink-0" /> {place.duration}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200">
                        <StarFill className="text-amber-500 size-4 shrink-0" />
                        {place.rating ? place.rating.toFixed(1) : "4.8"} <span className="text-zinc-400 font-normal">(Verified Evaluation)</span>
                    </span>
                </div>
            </div>

            {/* Interactive Image Gallery Grid Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-9 aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 relative shadow-sm">
                    {activeImage ? (
                        <img
                            src={activeImage}
                            alt={place.title}
                            className="w-full h-full object-cover transition-all duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">No Preview Display Array Linked</div>
                    )}
                </div>

                <div className="lg:col-span-3 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto max-h-fit lg:max-h-[500px] scrollbar-none pb-2 lg:pb-0">
                    {place.images?.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(img)}
                            className={`relative aspect-[4/3] w-24 sm:w-32 lg:w-full shrink-0 overflow-hidden rounded-2xl border transition-all ${activeImage === img
                                ? "border-teal-600 ring-2 ring-teal-600/20 shadow-md scale-[0.98]"
                                : "border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100"
                                }`}
                        >
                            <img src={img} alt={`Gallery grid leaf key reference #${index}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Split Column Information Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                            <Layers3Diagonal className="text-teal-600 size-5" /> Expedition Blueprint
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base whitespace-pre-line">
                            {place.description || place.shortDescription || "Comprehensive program framework descriptions are dynamically configured for live deployments."}
                        </p>
                    </div>

                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">Key Experience Milestones</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                            {(place.highlights || [
                                "Curated professional orientation parameters.",
                                "Exclusive local heritage entry protocols.",
                                "All transport framework modules accounted.",
                                "Certified continuous emergency support nodes."
                            ]).map((highlight, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                    <CircleCheck className="text-teal-600 size-4.5 shrink-0 mt-0.5" />
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <CommentSection targetId={id} currentUserId={currentUserId} />
                </div>

                {/* Sticky Conversion Sidebar Interface Panel */}
                <div className="h-fit lg:sticky lg:top-24">
                    <Card className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-sm space-y-6 overflow-hidden">

                        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 flex items-baseline justify-between">
                            <div>
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Investment Basis</span>
                                <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                                    ৳{place.price.toLocaleString("en-BD")}
                                </span>
                            </div>
                            <span className="text-xs font-bold text-zinc-500 uppercase bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
                                Per Person
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-center text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-2xl border border-zinc-150 dark:border-zinc-800/40">
                                <span className="text-zinc-450 block font-normal mb-0.5">Duration Track</span>
                                <span className="text-zinc-800 dark:text-zinc-200 text-sm font-bold">{place.duration}</span>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-2xl border border-zinc-150 dark:border-zinc-800/40">
                                <span className="text-zinc-450 block font-normal mb-0.5">Category Class</span>
                                <span className="text-zinc-800 dark:text-zinc-200 text-sm font-bold truncate max-w-full block px-1">{place.category}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-md shadow-teal-600/10 transition-all flex items-center justify-center gap-2 text-sm"
                            onClick={() => setIsBookingOpen(true)}
                        >
                            Initiate Booking Protocol
                            <ArrowUpRight className="size-4" />
                        </Button>

                        <p className="text-center text-[11px] font-medium text-zinc-400 px-2 leading-normal">
                            Fares locked under active seasonal schedules. Secure your dynamic reservation block safely.
                        </p>
                    </Card>
                </div>
            </div>

            {/* Render Modal via New Composite Layout Structural Geometry */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                placeId={id}
                placeTitle={place.title}
                pricePerPerson={place.price}
                availableDates={place.availableDates || []}  // ← যোগ করুন

                onSubmitBooking={handleProcessBookingRequest}
            />
        </div>
    );
}