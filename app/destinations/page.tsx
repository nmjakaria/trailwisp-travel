/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Input, Select, ListBox, Label } from "@heroui/react";
import { Magnifier, ChevronLeft, ChevronRight, Sliders, StarFill } from "@gravity-ui/icons";
import DestinationCard from "@/components/shared/DestinationCard";
import { getPlaces } from "@/lib/api/places";

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
}

const SORT_OPTIONS = [
    { label: "Newest Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Highest Rated", value: "rating" },
    { label: "Most Popular", value: "popular" },
];

export default function DestinationsPage() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [dbCategories, setDbCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Active Query Parameters state
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [locationFilter, setLocationFilter] = useState<string>("");
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [minRating, setMinRating] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("newest");

    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const itemsPerPage = 12;

    // Debounce effect for text-based filters
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Fetch dynamic category list on initial render mount
    useEffect(() => {
        async function loadInitialCategories() {
            try {
                // Fetch unfiltered data scope to parse existing dynamic categories
                const res = await getPlaces({ limit: "100" });
                const basePlaces: Place[] = res?.data || (Array.isArray(res) ? res : []);

                // Extract unique values, trim spaces, and ensure pristine string arrays
                const uniqueCategories = Array.from(
                    new Set(basePlaces.map(p => p.category?.trim()))
                ).filter(Boolean);

                setDbCategories(uniqueCategories);
            } catch (err) {
                console.error("Could not build dynamic layout category array matches:", err);
            }
        }
        loadInitialCategories();
    }, []);

    const fetchDestinations = useCallback(async () => {
        try {
            setIsLoading(true);

            const queryParams: Record<string, any> = {
                page: String(currentPage),
                limit: String(itemsPerPage),
                sort: sortBy,
            };

            if (debouncedSearch.trim()) queryParams.search = debouncedSearch;

            if (selectedCategory) queryParams.category = selectedCategory.trim();
            console.log('Query params sent:', queryParams); // ← যোগ করুন


            if (locationFilter.trim()) queryParams.location = locationFilter;
            if (minPrice) queryParams.minPrice = minPrice;
            if (maxPrice) queryParams.maxPrice = maxPrice;
            if (minRating) queryParams.rating = minRating;

            const res = await getPlaces(queryParams);

            if (res && res?.data) {
                setPlaces(res?.data || []);
                setTotalPages(res.totalPages || 1);
            } else if (res && Array.isArray(res)) {
                setPlaces(res);
                setTotalPages(1);
            } else {
                setPlaces([]);
            }
        } catch (err) {
            console.error("Failed to load global destinations context array.", err);
            setPlaces([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, selectedCategory, locationFilter, minPrice, maxPrice, minRating, sortBy]);

    useEffect(() => {
        fetchDestinations();
    }, [fetchDestinations]);

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("");
        setLocationFilter("");
        setMinPrice("");
        setMaxPrice("");
        setMinRating("");
        setSortBy("newest");
        setCurrentPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* 1. Left Sidebar Filter Stack */}
            <div className="space-y-6 w-full max-w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl h-fit shadow-sm lg:sticky lg:top-24 overflow-hidden">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                        <Sliders className="text-teal-600 size-5" /> Filters
                    </h2>
                    <button onClick={handleResetFilters} className="text-xs font-semibold text-teal-600 hover:underline">
                        Clear All
                    </button>
                </div>

                {/* Destination Location Text Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Target Area/Country</label>
                    <Input
                        type="text"
                        placeholder="e.g. Cox's Bazar, Sylhet"
                        value={locationFilter}
                        onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }}
                        variant="bordered"
                        radius="xl"
                        className="w-full"
                    />
                </div>

                {/* Category Dropdown - Updated syntax layout structure matches keys exactly */}
                <div className="space-y-2 relative-select-wrapper">
                    <Select
                        placeholder="Choose Category"
                        selectedKeys={selectedCategory ? new Set([selectedCategory]) : new Set()}
                        onSelectionChange={(keys) => {
                            const value = typeof keys === 'string' ? keys : (Array.from(keys)[0] as string);
                            setSelectedCategory(value || "");
                            setCurrentPage(1);
                        }}
                    >
                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Atmosphere Theme</Label>
                        <Select.Trigger className="w-full min-h-10 px-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-transparent dark:text-zinc-200 flex items-center justify-between">
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl shadow-lg">
                                {dbCategories.map((cat) => (
                                    <ListBox.Item id={cat} key={cat} textValue={cat} className="flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 data-[selected=true]:bg-teal-50 dark:data-[selected=true]:bg-teal-950/40 text-zinc-700 dark:text-zinc-300 data-[selected=true]:text-teal-600">
                                        {cat}
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>

                {/* Price Range Fields */}
                <div className="space-y-2 w-full">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Price Framework (BDT)</label>
                    <div className="grid grid-cols-2 gap-2 w-full min-w-0">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                            variant="bordered"
                            radius="xl"
                            className="w-full min-w-0"
                        />
                        <Input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                            variant="bordered"
                            radius="xl"
                            className="w-full min-w-0"
                        />
                    </div>
                </div>

                {/* Rating Filter Dropdown */}
                <div className="space-y-2 relative-select-wrapper">
                    <Select
                        placeholder="Select Stars"
                        selectedKeys={minRating ? new Set([minRating]) : new Set()}
                        onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0] as string;
                            setMinRating(value || "");
                            setCurrentPage(1);
                        }}
                    >
                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Minimum Evaluation</Label>
                        <Select.Trigger className="w-full min-h-10 px-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-transparent dark:text-zinc-200 flex items-center justify-between">
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl shadow-lg">
                                {[4, 3, 2, 1].map((star) => (
                                    <ListBox.Item id={String(star)} key={String(star)} textValue={`${star} Stars & Up`} className="flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 data-[selected=true]:bg-teal-50 dark:data-[selected=true]:bg-teal-950/40 text-zinc-700 dark:text-zinc-300 data-[selected=true]:text-teal-600">
                                        <div className="flex items-center gap-2">
                                            <StarFill className="text-amber-500 size-4 shrink-0" />
                                            <span>{star} Stars & Up</span>
                                        </div>
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>
            </div>

            {/* 2. Main Right Showcase Field */}
            <div className="lg:col-span-3 space-y-6">

                {/* Search Bar & Sort Bar Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <span className="absolute inset-y-0 left-4 flex items-center text-zinc-400">
                            <Magnifier className="size-5" />
                        </span>
                        <input
                            type="text"
                            placeholder="Find matches by keyword name or city location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-sm transition-all"
                        />
                    </div>

                    {/* Sorting dropdown */}
                    <div className="w-full sm:w-56 relative-select-wrapper">
                        <Select
                            selectedKeys={new Set([sortBy])}
                            onSelectionChange={(keys) => {
                                const value = typeof keys === 'string' ? keys : (Array.from(keys)[0] as string);
                                if (value) setSortBy(value);
                            }}
                        >
                            <Select.Trigger className="w-full min-h-11 px-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 text-sm dark:text-zinc-200 flex items-center justify-between shadow-sm">
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl shadow-lg w-56">
                                    {SORT_OPTIONS.map((opt) => (
                                        <ListBox.Item id={opt.value} key={opt.value} textValue={opt.label} className="flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 data-[selected=true]:bg-teal-50 dark:data-[selected=true]:bg-teal-950/40 text-zinc-700 dark:text-zinc-300 data-[selected=true]:text-teal-600">
                                            {opt.label}
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>
                    </div>
                </div>

                {/* Cards Presentation Loop */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <Card key={n} className="h-96 w-full animate-pulse border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem]" />
                        ))}
                    </div>
                ) : places.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2rem]">
                        <p className="text-zinc-500 font-medium text-sm">We couldn't locate any adventure criteria packages fitting these selectors.</p>
                        <Button variant="outline" size="sm" className="mt-3 text-teal-600 font-bold" onClick={handleResetFilters}>Reset Setup</Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {places.map((place) => (
                                <DestinationCard key={place._id} place={place} />
                            ))}
                        </div>

                        {/* Interactive Pagination controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-10">
                                <Button
                                    isIconOnly
                                    variant="outline"
                                    className="rounded-xl border-zinc-200 dark:border-zinc-800 size-10 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                    isDisabled={currentPage === 1}
                                >
                                    <ChevronLeft className="size-5" />
                                </Button>

                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <Button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            className={`size-10 font-bold rounded-xl text-sm min-w-0 ${currentPage === p
                                                ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                                                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50"
                                                }`}
                                        >
                                            {p}
                                        </Button>
                                    ))}
                                </div>

                                <Button
                                    isIconOnly
                                    variant="outline"
                                    className="rounded-xl border-zinc-200 dark:border-zinc-800 size-10 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                    isDisabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="size-5" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}