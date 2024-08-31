"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuthStore from '@/stores/authStore';
import http from '@/plugins/http';
import { useRouter } from 'next/navigation';

const Toolbar = () => {
    const router = useRouter();

    const { isLoggedIn, checkLoginStatus, logout, change } = useAuthStore();
    const [error, setError] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [username, setUsername] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false); // State to control dropdown visibility

    useEffect(() => {
        if (isLoggedIn || change) {
            const getUser = async () => {
                try {
                    const res = await http.get('/private/get-user', true);
                    if (res.error) return setError(res.error);
                    setAvatar(res.data.avatar);
                    setUsername(res.data.username);
                } catch (error) {
                    console.error('Error fetching protected data:', error);
                }
            };
            getUser();
        } else {
            setAvatar(null);
            setUsername(null);
        }
    }, [isLoggedIn, change]);

    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    const handleLogout = async ()  => {
        const res = await http.post('/private/logout', { username: username });
        if (res.error) return setError(res.error);
        logout();
        setMenuOpen(false)
        setAvatar(null)
        setUsername(null);
        router.push('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
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
                            <Link href="/rooms" className="hover:text-gray-300">Rooms</Link>
                            <Link href="/users" className="hover:text-gray-300">Users</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/" className="hover:text-gray-300">Home</Link>
                        </>
                    )}
                </nav>

                {isLoggedIn ? (
                    <div className="relative">
                        <div className="flex gap-3 items-center">
                            <img
                                src={avatar}
                                alt="Avatar"
                                className="h-10 mr-2 rounded-full cursor-pointer"
                                onClick={toggleMenu}
                            />
                        </div>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-black">
                                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
                                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-200">Settings</Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
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
