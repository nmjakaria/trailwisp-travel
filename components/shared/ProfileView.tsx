"use client";

import React, { useState, useTransition, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Avatar,
} from "@heroui/react";
import { User as UserIcon, Image as ImageIcon, Save, CheckCircle2, AlertCircle, X } from "lucide-react";

// The shape representing the structure returned by getUserSession()
interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface ProfileViewProps {
  role: "admin" | "user";
  initialUser: SessionUser;
}

// Mock update API call - substitute with your actual endpoint or Server Action
async function updateProfileApi(data: { name: string; imageUrl: string }) {
  return new Promise<{ success: boolean; data: typeof data }>((resolve, reject) => {
    setTimeout(() => {
      if (data.name.trim().length === 0) {
        reject(new Error("Name cannot be empty"));
      }
      resolve({ success: true, data });
    }, 1200);
  });
}

export default function ProfileView({ role, initialUser }: ProfileViewProps) {
  const [name, setName] = useState(initialUser.name || "");
  const [imageUrl, setImageUrl] = useState(initialUser.image || "");
  const [avatarPreview, setAvatarPreview] = useState(initialUser.image || "");
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Auto-dismiss Toast notifications
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync state if initialUser changes on the server side
  useEffect(() => {
    setName(initialUser.name || "");
    setImageUrl(initialUser.image || "");
    setAvatarPreview(initialUser.image || "");
  }, [initialUser]);

  // Keep the avatar preview updated when the image URL changes
  useEffect(() => {
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      setAvatarPreview(imageUrl);
    }
  }, [imageUrl]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        await updateProfileApi({ name, imageUrl });
        setToast({ type: "success", message: "Your profile was updated successfully!" });
      } catch (err: any) {
        setToast({ type: "error", message: err.message || "Failed to update profile settings." });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 relative">
      
      {/* Toast System */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300">
          <Card className={`p-4 border shadow-xl flex flex-row items-center gap-3 min-w-[300px] ${
            toast.type === "success" 
              ? "bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200" 
              : "bg-rose-50/95 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
          }`}>
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            )}
            <div className="text-sm font-medium pr-4">{toast.message}</div>
            <button 
              type="button"
              onClick={() => setToast(null)} 
              className="ml-auto text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          My Account
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Customize your public presence, details, and dynamic avatar preview.
        </p>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <Card className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm rounded-2xl space-y-6">
          
          {/* Avatar Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-zinc-100 dark:border-zinc-800/50">
            <img 
              src={avatarPreview || undefined} 
              className="w-20 h-20 text-large font-bold ring-4 ring-indigo-500/20 shrink-0" 
              name={name || "U"}
            />
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Profile Picture</h3>
              <p className="text-xs text-zinc-400 max-w-xs">
                Provide a secure, direct link to your photo. We currently support hosting integrations like Unsplash, Imgur, or cloud storage links.
              </p>
              <div className="pt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                  role === "admin" 
                    ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400" 
                    : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                }`}>
                  {role} Account
                </span>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                Email Address
              </label>
              <Input
                // isDisabled = true
                type="email"
                value={initialUser.email || ""}
                className="w-full opacity-70 disabled"
              />
              <p className="text-[11px] text-zinc-400 pl-1">
                Account emails are verified and cannot be changed manually.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                Display Name
              </label>
              <Input
                isRequired
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                startContent={<UserIcon className="w-4 h-4 text-zinc-400 pointer-events-none" />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                Avatar Image Link
              </label>
              <Input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full"
                startContent={<ImageIcon className="w-4 h-4 text-zinc-400 pointer-events-none" />}
              />
            </div>

          </div>

          <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
            <Button
              type="submit"
              color="primary"
              className="font-bold text-xs"
              isLoading={isPending}
              startContent={!isPending && <Save className="w-4 h-4" />}
            >
              {isPending ? "Saving changes..." : "Save Profile Settings"}
            </Button>
          </div>

        </Card>
      </form>
    </div>
  );
}