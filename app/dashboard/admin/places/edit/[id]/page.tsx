"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    Input, 
    Label,
    TextArea, 
    Button, 
    Card, 
    Select, 
    ListBox, 
    Chip, 
    toast 
} from "@heroui/react";
import { ArrowLeft, FloppyDisk, TrashBin, Compass } from "@gravity-ui/icons";
import { getPlaceById, updatePlace } from "@/lib/api/places";

const CATEGORIES = [
    { label: "Beach", value: "Beach" },
    { label: "Mountain", value: "Mountain" },
    { label: "City", value: "City" },
    { label: "Adventure", value: "Adventure" },
    { label: "Cultural", value: "Cultural" },
];

interface EditPlacePageProps {
    params: Promise<{ id: string }>;
}

export default function EditPlacePage({ params }: EditPlacePageProps): React.JSX.Element {
    const router = useRouter();
    const { id } = use(params); // Unwrapping the dynamic route ID parameter
    
    // UI Loading & Uploading states
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [dateInput, setDateInput] = useState<string>("");
    
    // State matching form parameters
    const [formData, setFormData] = useState({
        title: "",
        shortDescription: "",
        fullDescription: "",
        images: [] as string[],
        price: "",
        location: "",
        category: "",
        duration: "",
        availableDates: [] as string[],
    });

    const [errors, setErrors] = useState<Record<string, string | null>>({
        images: null,
    });

    // 1. Fetch current place data on load
    useEffect(() => {
        const fetchPlaceDetails = async () => {
            try {
                setPageLoading(true);
                const data = await getPlaceById(id);
                
                // Extract values matching backend object structure payload
                const targetData = data?.data || data; 
                
                if (targetData) {
                    setFormData({
                        title: targetData.title || "",
                        shortDescription: targetData.shortDescription || "",
                        fullDescription: targetData.fullDescription || "",
                        images: targetData.images || [],
                        price: targetData.price?.toString() || "",
                        location: targetData.location || "",
                        category: targetData.category || "",
                        duration: targetData.duration || "",
                        availableDates: targetData.availableDates || [],
                    });
                }
            } catch (err) {
                toast.warning("Could not extract destination values.");
            } finally {
                setPageLoading(false);
            }
        };

        fetchPlaceDetails();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ImgBB Image Upload Strategy
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, images: "File size exceeds 3MB limit" }));
            toast.warning("File size exceeds 3MB limit");
            return;
        }

        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("image", file);

        try {
            const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: uploadFormData,
            });
            const data = await response.json();

            if (data.success) {
                setFormData((prev) => ({ ...prev, images: [...prev.images, data.data.url] }));
                setErrors((prev) => ({ ...prev, images: null }));
                toast.success("Image added to gallery!");
            } else {
                setErrors((prev) => ({ ...prev, images: "Upload failed." }));
            }
        } catch (err) {
            setErrors((prev) => ({ ...prev, images: "Network upload error." }));
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove),
        }));
    };

    const addAvailableDate = () => {
        if (!dateInput) return;
        if (formData.availableDates.includes(dateInput)) {
            toast.warning("Date already exists.");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            availableDates: [...prev.availableDates, dateInput],
        }));
        setDateInput("");
    };

    const removeAvailableDate = (dateToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            availableDates: prev.availableDates.filter((d) => d !== dateToRemove),
        }));
    };

    // 2. Form execution via PATCH method update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            toast.warning("At least one image placeholder is required.");
            return;
        }

        setIsLoading(true);
        try {
            // Build modifications payload string conversions
            const patchPayload = {
                ...formData,
                price: Number(formData.price),
            };

            // Triggers updatePlace which hits PATCH HTTP endpoint
            await updatePlace(id, patchPayload);
            toast.success("Destination tracking updated successfully!");
            router.push("/dashboard/admin/places");
        } catch (err: any) {
            toast.warning(err.message || "Failed to edit location entries.");
        } finally {
            setIsLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
                <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-zinc-500 font-medium">Loading destination context specs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4">
            
            {/* Context Header Row */}
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-2xl text-teal-600 dark:text-teal-400">
                    <Compass className="size-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Modify Destination Registry</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Edit attributes, modify operational pricing configurations, or amend parameters</p>
                </div>
            </div>

            <Card className="p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* 1. Title & Location Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="input-edit-title">Destination Title</Label>
                            <Input
                                id="input-edit-title"
                                name="title"
                                placeholder="e.g., Cox's Bazar Sandy Escape"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="input-edit-location">Geographic Location</Label>
                            <Input
                                id="input-edit-location"
                                name="location"
                                placeholder="e.g., Chittagong Division, Bangladesh"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* 2. Price, Duration & Category Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="input-edit-price">Expedition Price ($)</Label>
                            <Input
                                id="input-edit-price"
                                name="price"
                                type="number"
                                placeholder="e.g., 299"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="input-edit-duration">Duration</Label>
                            <Input
                                id="input-edit-duration"
                                name="duration"
                                placeholder="e.g., 3 Days, 2 Nights"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        {/* Custom Select Box Structure matching setup */}
                        <Select className="w-full" placeholder="Select theme">
                            <Label>Expedition Category</Label>
                            <Select.Trigger className="h-10 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-transparent">
                                <Select.Value>
                                    {formData.category || <span className="text-zinc-400">Select one</span>}
                                </Select.Value>
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-lg">
                                    {CATEGORIES.map((cat) => (
                                        <ListBox.Item 
                                            key={cat.value} 
                                            id={cat.value} 
                                            textValue={cat.label}
                                            onClick={() => setFormData((prev) => ({ ...prev, category: cat.value }))}
                                            className="px-3 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-sm text-zinc-800 dark:text-zinc-200 flex justify-between items-center"
                                        >
                                            {cat.label}
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>
                    </div>

                    {/* 3. Date Scheduler */}
                    <div className="space-y-2">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="input-edit-date">Available Tour Dates</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    id="input-edit-date"
                                    type="date"
                                    value={dateInput}
                                    onChange={(e) => setDateInput(e.target.value)}
                                    className="max-w-xs"
                                />
                                <Button 
                                    type="button" 
                                    onClick={addAvailableDate} 
                                    className="bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl h-10 px-4"
                                >
                                    Add Date
                                </Button>
                            </div>
                        </div>
                        {Array.isArray(formData.availableDates) && formData.availableDates.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {formData.availableDates.map((date) => (
                                    <Chip 
                                        key={date} 
                                        onClose={() => removeAvailableDate(date)} 
                                        variant="flat" 
                                        className="text-xs font-medium py-1"
                                    >
                                        {new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </Chip>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 4. Image Section */}
                    <div className="space-y-2">
                        <Label>Destination Images Gallery</Label>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <input
                                type="file"
                                accept="image/*"
                                id="imgbb-editor-uploader"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={isUploading}
                            />
                            <label
                                htmlFor="imgbb-editor-uploader"
                                className={`px-4 py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors inline-block text-center text-xs font-medium ${
                                    isUploading ? "pointer-events-none opacity-50" : ""
                                }`}
                            >
                                {isUploading ? "Uploading Replacement Image..." : "Upload additional photo to Gallery (Max 3MB)"}
                            </label>
                        </div>

                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                                {formData.images.map((url, index) => (
                                    <div key={url} className="relative group aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                        <img src={url} alt="Destination source" className="w-full h-full object-cover" />
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="ghost"
                                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-red-500"
                                            onClick={() => removeImage(index)}
                                        >
                                            <TrashBin size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 5. Short Description */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="textarea-edit-short-desc">Short Description</Label>
                        <TextArea
                            id="textarea-edit-short-desc"
                            name="shortDescription"
                            placeholder="Brief summaries displayed in listing cards..."
                            value={formData.shortDescription}
                            onChange={handleChange}
                            required
                            className="w-full h-20"
                        />
                    </div>

                    {/* 6. Full Description */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="textarea-edit-full-desc">Full Itinerary & Details</Label>
                        <TextArea
                            id="textarea-edit-full-desc"
                            name="fullDescription"
                            placeholder="Provide deep layout summary timelines, highlights, maps, inclusions..."
                            value={formData.fullDescription}
                            onChange={handleChange}
                            required
                            className="w-full h-36"
                        />
                    </div>

                    <hr className="border-zinc-200 dark:border-zinc-800" />

                    {/* Form Controls Footer Panel */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                        <Link href="/dashboard/admin/places" className="w-full sm:w-auto">
                            <Button type="button" variant="outline" className="w-full sm:w-auto font-semibold rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 h-11 px-5">
                                <ArrowLeft size={16} /> Cancel changes
                            </Button>
                        </Link>

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            isDisabled={isUploading}
                            className="w-full sm:w-auto bg-teal-600 text-white font-semibold rounded-xl h-11 px-6 shadow-md shadow-teal-600/10"
                        >
                            Save Updates <FloppyDisk size={16} />
                        </Button>
                    </div>

                </form>
            </Card>
        </div>
    );
}