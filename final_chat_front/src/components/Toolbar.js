"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import useAuthStore from '@/stores/authStore';

const Toolbar = () => {
    const { isLoggedIn, setIsLoggedIn, logout } = useAuthStore();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [setIsLoggedIn]);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="bg-gray-800 text-white">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <div className="text-xl font-bold flex items-center">
                    <img src="https://i.imgur.com/W00cROn.png" alt="Logo" className="h-10 mr-2" />
                </div>

                {/* Navigation Links */}
                <nav className="flex space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/" className="hover:text-gray-300">Dashboard</Link>
                            <Link href="/profile" className="hover:text-gray-300">Profile</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/" className="hover:text-gray-300">Home</Link>
                        </>
                    )}
                </nav>

                {isLoggedIn ? (
                    <button className="button-62" role="button">
                        <Link href="/" onClick={handleLogout} className="hover:text-gray-300">Logout</Link>
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button className="button-62" role="button">
                            <Link href="/register" className="hover:text-gray-300">Register</Link>
                        </button>
                        <button className="button-62" role="button">
                            <Link href="/login" className="hover:text-gray-300">Login</Link>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Toolbar;
