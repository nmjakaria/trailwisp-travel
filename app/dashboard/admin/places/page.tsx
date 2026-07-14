/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, Button, toast } from "@heroui/react";
import { Plus, Compass, Magnifier, ChevronLeft, ChevronRight } from "@gravity-ui/icons";
import { getPlaces, deletePlace, updatePlace } from "@/lib/api/places";
import PlaceCard from "@/components/dashboard/admin/PlaceCard";
import DeleteModal from "@/components/dashboard/admin/DeleteModal";

interface Place {
    _id: string;
    title: string;
    location: string;
    price: number;
    category: string;
    duration: string;
    images: string[];
    isFeatured?: boolean;
}

export default function AdminPlacesPage() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Server-driven States
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const itemsPerPage = 6; 

    // Deletion Modal States
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); 
        }, 400);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const fetchDestinations = useCallback(async () => {
        try {
            setIsLoading(true);
            
            const queryParams: Record<string, any> = {
                page: String(currentPage),
                limit: String(itemsPerPage),
            };
            
            if (debouncedSearch.trim()) {
                queryParams.search = debouncedSearch;
            }

            const res = await getPlaces(queryParams);
            
            if (res && res.data) {
                setPlaces(res.data || []);
                setTotalPages(res.totalPages || 1);
            } else if (res && Array.isArray(res)) {
                setPlaces(res);
                setTotalPages(1);
            } else {
                setPlaces([]);
            }
        } catch (err) {
            toast.warning("Failed to download destinations grid.");
            setPlaces([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        fetchDestinations();
    }, [fetchDestinations]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Keep input typing smooth locally
    };

    const handleToggleFeatured = async (place: Place) => {
        try {
            const updatedStatus = !place.isFeatured;
            setPlaces(prev => prev.map(p => p._id === place._id ? { ...p, isFeatured: updatedStatus } : p));
            await updatePlace(place._id, { isFeatured: updatedStatus });
            toast.success(`${place.title} updated successfully!`);
        } catch (err) {
            setPlaces(prev => prev.map(p => p._id === place._id ? { ...p, isFeatured: place.isFeatured } : p));
            toast.warning("Could not alter featured status.");
        }
    };

    const openDeleteConfirmation = (place: Place) => {
        setSelectedPlace(place);
        setIsDeleteOpen(true);
    };

    const confirmDeletePlace = async () => {
        if (!selectedPlace) return;
        setIsActionLoading(true);
        try {
            await deletePlace(selectedPlace._id);
            toast.success("Destination deleted successfully.");
            setIsDeleteOpen(false);
            fetchDestinations(); 
        } catch (err) {
            toast.warning("Failed to remove target item location.");
        } finally {
            setIsActionLoading(false);
            setSelectedPlace(null);
        }
    };

    return (
        <div className="space-y-6 p-4 max-w-7xl mx-auto">
            
            {/* Top Header layout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <Compass className="size-6 text-teal-600" /> Administrative Destinations Panel
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Manage existing packages, update featured spotlights, or create new listings</p>
                </div>
                <Link href="/dashboard/admin/places/add">
                    <Button className="bg-teal-600 text-white font-semibold rounded-xl h-11 px-5 shadow-md shadow-teal-600/10">
                        <Plus size={16} /> Add Destination
                    </Button>
                </Link>
            </div>

            {/* Live Backend Search Bar */}
            <div className="relative w-full max-w-md">
                <span className="absolute inset-y-0 left-4 flex items-center text-zinc-400">
                    <Magnifier className="size-5" />
                </span>
                <input
                    type="text"
                    placeholder="Search titles via backend indexing..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all shadow-sm"
                />
            </div>

            {/* List and Grid Presentation Wrapper */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                    {[1, 2, 3].map((n) => (
                        <Card key={n} className="h-80 w-full animate-pulse border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem]" />
                    ))}
                </div>
            ) : places.length === 0 ? (
                <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2rem] border border-dashed border-zinc-300 dark:border-zinc-800">
                    <p className="text-zinc-500 font-medium">No system entries found matching criteria parameters.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {places.map((place) => (
                            <PlaceCard
                                key={place._id}
                                place={place}
                                onToggleFeatured={handleToggleFeatured}
                                onDeleteClick={openDeleteConfirmation}
                            />
                        ))}
                    </div>

                    {/* Server-Side Synchronized Pagination Buttons */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-8">
                            <Button
                                isIconOnly
                                variant="outline"
                                className="rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 size-10"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                isDisabled={currentPage === 1}
                            >
                                <ChevronLeft className="size-5" />
                            </Button>

                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                                    <Button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`size-10 font-bold rounded-xl text-sm min-w-0 ${
                                            currentPage === page
                                                ? "bg-teal-600 text-white"
                                                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                        }`}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                isIconOnly
                                variant="outline"
                                className="rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 size-10"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                isDisabled={currentPage === totalPages}
                            >
                                <ChevronRight className="size-5" />
                            </Button>
                        </div>
                    )}
                </>
            )}

            <DeleteModal
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                selectedPlace={selectedPlace}
                onConfirm={confirmDeletePlace}
                isLoading={isActionLoading}
            />
        </div>
    );
}