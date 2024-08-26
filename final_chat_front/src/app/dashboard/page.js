"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token
        router.push('/login'); // Redirect to the login page
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white text-black rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Dashboard</h2>
                <p className="text-center text-gray-600">
                    Welcome to your dashboard! Here you can manage your account and settings.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
