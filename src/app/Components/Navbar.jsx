"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import UserContext from "@/context/userContext";
import { logOut } from "@/app/Services/userService";
// import { toast } from "react-toastify";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const path = usePathname();
    const { user, setUser } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logOut();
            setUser({ name: "", email: "" });
            router.push("/login");
        } catch (err) {
            console.error(err);
            toast.error("Error logging out!");
        }
    };

    const linkClass = (href) => {
        const base = "text-lg font-medium transition-colors duration-200";
        const active =
            path === href
                ? "text-blue-700 underline underline-offset-4"
                : "text-gray-700 hover:text-blue-600";
        return `${base} ${active}`;
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    FinTrack
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-6">
                    <Link href="/dashboard" className={linkClass("/dashboard")}>
                        Dashboard
                    </Link>
                    <Link href="/markets" className={linkClass("/markets")}>
                        Markets
                    </Link>
                    {user.email && (
                        <Link href="/portfolio" className={linkClass("/portfolio")}>
                            Portfolio
                        </Link>
                    )}
                </div>

                {/* Auth Buttons & Mobile Toggle */}
                <div className="flex items-center space-x-4">
                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center space-x-2">
                        {user.email ? (
                            <>
                                <span className={linkClass("/profile")}>
                                    <Link href="/profile">{user.name}</Link>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-800 dark:text-gray-100 focus:outline-none"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-4 pb-4 space-y-3">
                    <Link href="/dashboard" className={linkClass("/dashboard") + " block"}>
                        Dashboard
                    </Link>
                    <Link href="/markets" className={linkClass("/markets") + " block"}>
                        Markets
                    </Link>
                    {user.email && (
                        <Link href="/portfolio" className={linkClass("/portfolio") + " block"}>
                            Portfolio
                        </Link>
                    )}
                    {user.email ? (
                        <>
                            <Link href="/profile" className={linkClass("/profile") + " block"}>
                                {user.name}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left text-red-500"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="block w-full text-white bg-blue-500 px-4 py-2 rounded-md">
                                Login
                            </Link>
                            <Link href="/signup" className="block w-full text-white bg-green-500 px-4 py-2 rounded-md">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
