"use client";

import React, { useState } from "react";
import { Card, Button, Link, TextField, Label, InputGroup, Input } from "@heroui/react";
import { Radio, RadioGroup } from "@heroui/react";

import { Eye, EyeSlash, Person, At, ShieldKeyhole, Picture } from "@gravity-ui/icons";
import { authClient, signUp } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export default function SignupPage(): React.JSX.Element {
    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [image, setImage] = useState("");
    const [isBlocked, setIsBlocked] = useState("no");

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";

    // UI States
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setIsLoading(true);

        // Sanitary payload check
        if (!image.trim()) {
            setError("Profile image URL is required.");
            setIsLoading(false);
            return;
        }

        const plan = role === "user" ? "user_free" : "admin";

        try {
            const { error: authError } = await signUp.email({
                email: email.trim(),
                password,
                name: name.trim(),
                image: image.trim(), // Explicitly passing to standard Better Auth payload mapper
                role,
                plan,
                isBlocked: isBlocked === "yes",
            });

            if (authError) {
                setError(authError.message || "Something went wrong during signup.");
            } else {
                setSuccess("Account created successfully! Welcome.");
                setName("");
                setEmail("");
                setPassword("");
                setImage("");
                router.push(redirectTo);
            }
        } catch (err) {
            setError("An unexpected network error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const signInGoogle = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: redirectTo
            });
        } catch (err) {
            console.error("Google sign in failed", err);
        }
    };

    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 bg-zinc-50 dark:bg-zinc-950 transition-colors items-stretch">

            {/* ─── LEFT SIDE: STICKY VISUAL PANEL ─── */}
            {/* Added sticky top-0 and items-center/justify-center to perfectly center the glass container */}
            <div className="hidden md:flex sticky top-0 h-screen p-4 items-center justify-center">
                <div
                    className="w-full h-full rounded-[2.5rem] bg-cover bg-center shadow-md border border-zinc-200/50 dark:border-zinc-900"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1751809850108-18914e8a3862?q=80&w=1600&auto=format&fit=crop')`
                    }}
                >
                    {/* Centered layout inside image panel */}
                    <div className="w-full h-full bg-gradient-to-tr from-black/60 via-black/20 to-transparent rounded-[2.5rem] flex items-center justify-center p-10">
                        {/* Floating Glassmorphism Content Card */}
                        <div className="backdrop-blur-md bg-white/10 dark:bg-black/30 p-8 rounded-2xl border border-white/10 max-w-sm shadow-xl text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-white">Map. Write. Discover.</h2>
                            <p className="mt-2 text-sm text-zinc-200/90 leading-relaxed">
                                Join our global community of passionate wanderers documenting authentic journeys. Your next adventure is waiting.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── RIGHT SIDE: FORM CONTAINER CHAMBER ─── */}
            {/* Kept min-h-screen flexibility with flex centering to handle scrolling contents properly */}
            <div className="flex flex-col justify-center items-center px-4 py-12 sm:px-6 md:px-12 lg:px-16 bg-zinc-50 dark:bg-zinc-950 transition-colors w-full">
                <Card className="w-full max-w-md p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">

                    {/* Header Container */}
                    <div className="flex flex-col items-center justify-center gap-1 pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-6 text-center">
                        {/* Application Identity Logo Branding */}
                        <Link href="/" className="flex flex-col items-center gap-2 group mb-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 group-hover:scale-105 transition-transform duration-200">
                                <Image
                                    alt="Trailwisp Logo"
                                    src="/trailwisp-logo.png"
                                    // src="https://fastly.4sqi.net/img/general/600x600/170077684_WurW-saVWWTofqkCCrMb8YKNOocyqgaB34fc9AQrI4Q.png"
                                    width={35}
                                    height={35}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                                Trail<span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">wisp</span>
                            </span>
                        </Link>
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Join Trailwisp</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Fill in the fields below to get started</p>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSignup} className="flex flex-col gap-5">

                        {/* Name Field */}
                        <TextField isRequired name="name" className="flex flex-col gap-1.5">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</Label>
                            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-primary transition-colors">
                                <Person className="text-zinc-400 pointer-events-none" size={16} />
                                <Input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                                />
                            </InputGroup>
                        </TextField>

                        {/* Email Field */}
                        <TextField
                            isRequired
                            name="email"
                            type="email"
                            className="flex flex-col gap-1.5"
                            validate={(value) => {
                                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                    return "Please enter a valid email address";
                                }
                                return null;
                            }}
                        >
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</Label>
                            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-primary transition-colors">
                                <At className="text-zinc-400 pointer-events-none" size={16} />
                                <Input
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                                />
                            </InputGroup>
                        </TextField>

                        {/* Password Field */}
                        <TextField
                            isRequired
                            name="password"
                            className="flex flex-col gap-1.5"
                            validate={(value) => {
                                if (value.length < 6) {
                                    return "Password must be at least 6 characters";
                                }
                                if (!/[A-Z]/.test(value)) {
                                    return "Password must contain at least one uppercase letter";
                                }
                                if (!/[0-9]/.test(value)) {
                                    return "Password must contain at least one number";
                                }
                                return null;
                            }}
                        >
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</Label>
                            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-primary transition-colors">
                                <ShieldKeyhole className="text-zinc-400 pointer-events-none" size={16} />
                                <Input
                                    type={isVisible ? "text" : "password"}
                                    placeholder="Choose a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                                />
                                <button
                                    className="focus:outline-none text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                                    type="button"
                                    onClick={toggleVisibility}
                                    aria-label="toggle password visibility"
                                >
                                    {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </button>
                            </InputGroup>
                        </TextField>

                        {/* Image Field */}
                        <TextField isRequired name="image" type="url" className="flex flex-col gap-1.5">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Profile Image URL</Label>
                            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-primary transition-colors">
                                <Picture className="text-zinc-400 pointer-events-none" size={16} />
                                <Input
                                    placeholder="https://example.com/image.jpg"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                                />
                            </InputGroup>
                        </TextField>

                        {/* Role Selection */}
                        <div className="flex flex-col gap-3">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Subscription plan</Label>
                            <RadioGroup defaultValue="user" name="role" onChange={value => setRole(value)} orientation="horizontal" color="primary">
                                <Radio value="user">
                                    <Radio.Control>
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    <Radio.Content>
                                        <Label className="text-zinc-900 dark:text-zinc-100 cursor-pointer text-sm">User</Label>
                                    </Radio.Content>
                                </Radio>
                            </RadioGroup>
                        </div>

                        {/* Dynamic Status Badges */}
                        {error && (
                            <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                                <span className="font-semibold">Error:</span> {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3.5 text-xs font-medium rounded-xl bg-emerald-100/60 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                                <span className="font-semibold">Success:</span> {success}
                            </div>
                        )}

                        {/* Action Button */}
                        <Button
                            type="submit"
                            color="primary"
                            className="w-full font-semibold rounded-xl text-sm h-12 bg-teal-600 hover:bg-teal-700 text-white"
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        >
                            Sign Up
                        </Button>

                        {/* Social Register Splitter */}
                        <div className="relative flex items-center gap-4 py-1">
                            <div className="h-px bg-zinc-200 dark:bg-zinc-800 grow" />
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Join with</span>
                            <div className="h-px bg-zinc-200 dark:bg-zinc-800 grow" />
                        </div>

                        {/* Google Action Button */}
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                className="rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-zinc-900 dark:text-zinc-100 h-12 w-full gap-2 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                onPress={signInGoogle}
                            >
                                <FcGoogle className="text-lg" />
                                Continue with Google
                            </Button>
                        </div>

                        {/* Navigation Option */}
                        <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            Already have an account?{" "}
                            <Link href={`/auth/signin?redirect=${redirectTo}`} className="font-medium cursor-pointer text-sm text-blue-600 dark:text-blue-400">
                                Sign in instead
                            </Link>
                        </div>

                    </form>
                </Card>
            </div>
        </div>
    );
}