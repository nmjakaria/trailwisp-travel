"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Link, TextField, Label, InputGroup, Input, toast } from "@heroui/react";
import { Eye, EyeSlash, At, ShieldKeyhole } from "@gravity-ui/icons";
import { authClient, signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function SigninPage(): React.JSX.Element {
    // Form fields
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";
    const message = searchParams.get("message");

    useEffect(() => {
        if (message === "login_required") {
            toast.warning("Authentication Required", {
                description: "Please sign in to access that page.",
                timeout: 3000,
            });

            // clear the message parameter from the browser history for clean URL
            const newUrl = window.location.pathname +
                (redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : "");
            window.history.replaceState({}, "", newUrl);
        }
    }, [message, redirectTo]);

    // UI States
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const toggleVisibility = (): void => setIsVisible(!isVisible);

    const handleSignin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const { error: authError } = await signIn.email({
                email: email.trim(),
                password,
            });

            if (authError) {
                setError(authError.message || "Invalid email or password.");
            } else {
                setSuccess("Signed in successfully! Redirecting...");
                toast.success("Welcome back!", {
                    description: "You have been logged into your account.",
                    timeout: 2000,
                });
                setEmail("");
                setPassword("");
                router.push(redirectTo);
            }
        } catch (err) {
            setError("An unexpected network error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const signInGoogle = async (): Promise<void> => {
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
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 bg-stone-50 dark:bg-zinc-950 transition-colors items-stretch">

            {/* ─── LEFT SIDE: INTERACTIVE FORM CHAMBER ─── */}
            <div className="flex flex-col justify-center items-center px-4 py-12 sm:px-6 md:px-12 lg:px-16 bg-stone-50 dark:bg-zinc-950 transition-colors w-full">
                <Card className="w-full max-w-md p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">

                    {/* Header Container */}
                    <div className="flex flex-col items-center justify-center gap-1 pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-6 text-center">
                        <Link href="/" className="flex flex-col items-center gap-2 group mb-3">
                            {/* Logo Visual Icon - Trailwisp Deep Teal to Sunset Orange */}
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-orange-500 shadow-lg group-hover:scale-105 transition-transform duration-200">
                                <span className="text-xl font-bold text-white">T</span>
                            </div>
                            {/* Brand Name Text */}
                            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                                Trail<span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">wisp</span>
                            </span>
                        </Link>

                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Welcome back</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Enter your credentials to explore real trips and honest stories</p>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSignin} className="flex flex-col gap-5">

                        {/* Email Field */}
                        <TextField isRequired name="email" type="email" className="flex flex-col gap-1.5">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</Label>
                            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-teal-600 transition-colors">
                                <At className="text-zinc-400 pointer-events-none" size={16} />
                                <Input
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                                />
                            </InputGroup>
                        </TextField>

                        {/* Password Field */}
                        <TextField isRequired name="password" className="flex flex-col gap-1.5">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</Label>
                            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-teal-600 transition-colors">
                                <ShieldKeyhole className="text-zinc-400 pointer-events-none" size={16} />
                                <Input
                                    type={isVisible ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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

                        {/* Action Buttons Container */}
                        <div className="flex flex-col gap-2 mt-2">
                            <Button
                                type="submit"
                                color="primary"
                                className="w-full font-semibold rounded-xl text-sm h-12 bg-teal-600 hover:bg-teal-700 text-white"
                                isLoading={isLoading}
                                isDisabled={isLoading}
                            >
                                Sign In
                            </Button>

                        </div>

                        {/* Social Splitter */}
                        <div className="relative flex items-center gap-4 py-1">
                            <div className="h-px bg-zinc-200 dark:bg-zinc-800 grow" />
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">or connect with</span>
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
                            New to Trailwisp?{" "}
                            <Link href={`/auth/signup?redirect=${redirectTo}`} className="font-medium cursor-pointer text-sm text-teal-600 dark:text-teal-400">
                                Create an account
                            </Link>
                        </div>

                    </form>
                </Card>
            </div>

            {/* ─── RIGHT SIDE: STICKY VISUAL PANEL ─── */}
            <div className="hidden md:flex sticky top-0 h-screen p-4 items-center justify-center">
                <div
                    className="w-full h-full rounded-[2.5rem] bg-cover bg-center shadow-md border border-zinc-200/50 dark:border-zinc-900"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1626239889138-a7e4f971059e?q=80&w=1600&auto=format&fit=crop')`
                    }}
                >
                    <div className="w-full h-full bg-gradient-to-tr from-black/60 via-black/20 to-transparent rounded-[2.5rem] flex items-center justify-center p-10">
                        {/* Floating Glassmorphism Content Card with New Tagline */}
                        <div className="backdrop-blur-md bg-white/10 dark:bg-black/30 p-8 rounded-2xl border border-white/10 max-w-sm shadow-xl text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-white">Real trips. Real stories.</h2>
                            <p className="mt-2 text-sm text-zinc-200/90 leading-relaxed">
                                Avoid marketing traps and book experiences backed by honest, user-written travel stories.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}