
"use client";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { signUp } from '../Services/userService';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const SignUpPage = () => {
    const router = useRouter();
    const [submitData, setSubmitData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        if (!submitData.name.trim()) newErrors.name = "Name is required.";
        if (!submitData.email.trim()) newErrors.email = "Email is required.";
        if (!submitData.password.trim()) newErrors.password = "Password is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitData = async (event) => {
        event.preventDefault();
        setErrors({});
        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await signUp(submitData);
            toast.success("Signup Successfully", {
                position: 'top-center',
                autoClose: 5000,
                pauseOnHover: true,
            });
            setSubmitData({
                name: "",
                email: "",
                password: "",
            });
            router.push("/login");
        } catch (error) {
            console.error(error);
            toast.error(`Error Creating the user: ${error.response?.data?.message || 'Unknown error'}`, {
                position: 'top-center',
                autoClose: 5000,
                pauseOnHover: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4 py-12">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 sm:p-12 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
                    Create an Account
                </h2>
                <form onSubmit={handleSubmitData} className="space-y-6">
                    <div>
                        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full Name
                        </label>
                        <input
                            id="user_name"
                            name="name"
                            value={submitData.name}
                            onChange={(event) => setSubmitData({ ...submitData, name: event.target.value })}
                            disabled={loading}
                            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <input
                            id="user_email"
                            type="email"
                            name="email"
                            value={submitData.email}
                            onChange={(event) => setSubmitData({ ...submitData, email: event.target.value })}
                            disabled={loading}
                            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="user_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="user_password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={submitData.password}
                                onChange={(event) => setSubmitData({ ...submitData, password: event.target.value })}
                                disabled={loading}
                                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 hover:scale-[1.02] text-white font-semibold text-sm rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                        )}
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;