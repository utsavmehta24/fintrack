"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserContext from "@/context/userContext";
import { logIn } from "@/app/Services/userService";
import { toast } from "react-toastify";
import { Eye, EyeOff, Github } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email.");
            setLoading(false);
            return;
        }

        try {
            const response = await logIn({ email, password });

            if (!response.status) {
                setError(response.message);
                toast.error(response.message);
                setLoading(false);
                return;
            }

            setUser({ name: response.user.name, email: response.user.email });
            toast.success("Logged in successfully!");
            router.push("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            const msg = err.message || "Login failed. Please try again.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGithubSignIn = async () => {
        setLoading(true);
        setError("");
        try {
            const { data, error: ghError } = await logIn({ provider: "github" });
            if (ghError) throw ghError;
            setUser({ name: data.user.name, email: data.user.email });
            router.push("/");
        } catch (err) {
            console.error("GitHub login error:", err);
            const msg = err.message || "GitHub login failed.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
                    Sign In
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-sm text-center text-red-600 dark:text-red-400 font-medium -mt-2">
                            {error}
                        </div>
                    )}

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={!email || !password || loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] text-white font-semibold text-sm rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                        )}
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        Or continue with
                    </div>
                </div>

                {/* GitHub Login */}
                <button
                    type="button"
                    onClick={handleGithubSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 hover:scale-[1.02] transition"
                >
                    <Github className="w-5 h-5" />
                    {loading ? "Signing in..." : "Sign in with GitHub"}
                </button>

                {/* Links */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between text-sm gap-3">
                    <Link
                        href="/signup"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Create new account
                    </Link>
                    <Link
                        href="/forgot-password"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Forgot your password?
                    </Link>
                </div>
            </div>
        </div>
    );
}
