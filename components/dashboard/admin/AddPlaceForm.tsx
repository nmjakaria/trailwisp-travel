"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
    Input, 
    Label,
    TextArea, 
    Button, 
    Card, 
    Select, 
    ListBox, 
    Chip,
    toast, 
} from "@heroui/react";
import { ArrowLeft, FolderPlus, TrashBin } from "@gravity-ui/icons";
import { createPlace } from "@/lib/api/places";
import { useRouter } from "next/navigation";
import { PLACE_CATEGORIES } from "@/lib/constants/categories";

const CATEGORIES = PLACE_CATEGORIES.map((cat) => ({ label: cat, value: cat }));

export default function AddPlaceForm(): React.JSX.Element {
    const router = useRouter();
    
    // UI Statuses
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [dateInput, setDateInput] = useState<string>("");
    
    // Schema-aligned form state
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
                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, data.data.url],
                }));
                setErrors((prev) => ({ ...prev, images: null }));
                toast.success("Image uploaded successfully!");
            } else {
                setErrors((prev) => ({ ...prev, images: "Upload failed. Try again." }));
                toast.warning("Upload failed. Try again.");
            }
        } catch (err) {
            setErrors((prev) => ({ ...prev, images: "Network error during image upload" }));
            toast.warning("Network error during image upload");
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
            toast.warning("Date already listed.");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.shortDescription || !formData.fullDescription || !formData.price || !formData.location || !formData.category || !formData.duration) {
            toast.warning("Please fill in all required fields.");
            return;
        }

        if (formData.images.length === 0) {
            toast.warning("At least one image is required for this destination.");
            return;
        }

        if (formData.availableDates.length === 0) {
            toast.warning("Please provide at least one scheduled available date.");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                availableDates: formData.availableDates,
            };

            await createPlace(payload);
            toast.success("Destination created successfully!");
            router.push("/dashboard/admin/places");
        } catch (err: any) {
            toast.warning(err.message || "Failed to create destination place.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Title & Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="input-place-title">Destination Title</Label>
                        <Input
                            id="input-place-title"
                            name="title"
                            placeholder="e.g., Cox's Bazar Sandy Escape"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="input-place-location">Geographic Location</Label>
                        <Input
                            id="input-place-location"
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
                        <Label htmlFor="input-place-price">Expedition Price ($)</Label>
                        <Input
                            id="input-place-price"
                            name="price"
                            type="number"
                            placeholder="e.g., 299"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="input-place-duration">Duration</Label>
                        <Input
                            id="input-place-duration"
                            name="duration"
                            placeholder="e.g., 3 Days, 2 Nights"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {/* Select Field matching standard Anatomy */}
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
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>

                {/* 3. Date Scheduler */}
                <div className="space-y-2">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="input-place-date">Available Tour Dates</Label>
                        <div className="flex gap-2 items-center">
                            <Input
                                id="input-place-date"
                                type="date"
                                value={dateInput}
                                onChange={(e) => setDateInput(e.target.value)}
                                className="max-w-xs"
                            />
                            <Button 
                                type="button" 
                                onClick={addAvailableDate} 
                                className="bg-zinc-800 dark:bg-zinc-150 text-white dark:text-zinc-900 font-semibold rounded-xl h-10 px-4"
                            >
                                Add Date
                            </Button>
                        </div>
                    </div>
                    {formData.availableDates.length > 0 && (
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

                {/* 4. ImgBB Image Uploader Section */}
                <div className="space-y-2">
                    <Label>Destination Images (Required)</Label>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <input
                            type="file"
                            accept="image/*"
                            id="imgbb-uploader"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={isUploading}
                        />
                        <label
                            htmlFor="imgbb-uploader"
                            className={`px-4 py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl cursor-pointer hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors inline-block text-center text-xs font-medium ${
                                isUploading ? "pointer-events-none opacity-50" : ""
                            }`}
                        >
                            {isUploading ? "Uploading Image to ImgBB..." : "Click to select and upload picture (Max 3MB)"}
                        </label>
                    </div>

                    {errors.images && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.images}</p>
                    )}

                    {/* Image Previews */}
                    {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                            {formData.images.map((url, index) => (
                                <div key={url} className="relative group aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                    <img src={url} alt="Uploaded source" className="w-full h-full object-cover" />
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
                    <Label htmlFor="textarea-short-desc">Short Description</Label>
                    <TextArea
                        id="textarea-short-desc"
                        name="shortDescription"
                        placeholder="Brief description displaying in search results cards (Max 150 chars)..."
                        value={formData.shortDescription}
                        onChange={handleChange}
                        required
                        className="w-full h-20"
                    />
                </div>

                {/* 6. Full Detailed Description */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="textarea-full-desc">Full Itinerary & Details</Label>
                    <TextArea
                        id="textarea-full-desc"
                        name="fullDescription"
                        placeholder="Provide details about expectations, tour highlights, guidelines, inclusions, and accommodation specifications..."
                        value={formData.fullDescription}
                        onChange={handleChange}
                        required
                        className="w-full h-36"
                    />
                </div>

                <hr className="border-zinc-150 dark:border-zinc-800" />

                {/* Actions Panel */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                    <Link href="/dashboard/admin/places">
                        <Button type="button" variant="outline" className="w-full sm:w-auto font-semibold rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 h-11 px-5">
                            <ArrowLeft size={16} /> Back to Places
                        </Button>
                    </Link>

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        isDisabled={isUploading}
                        className="w-full sm:w-auto bg-teal-600 text-white font-semibold rounded-xl h-11 px-6 shadow-md shadow-teal-600/10"
                    >
                        Publish Destination <FolderPlus size={16} />
                    </Button>
                </div>

            </form>
        </Card>
    );
}