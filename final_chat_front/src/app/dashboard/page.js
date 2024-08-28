"use client";

import React, {useEffect} from 'react';
import { useRouter } from 'next/navigation';
import ChatRoom from "@/components/ChatRoom";
import http from '@/plugins/http';
import {checkLoginStatus} from "@/plugins/login";
import useAuthStore from "@/stores/authStore";

const Dashboard = () => {
    const router = useRouter();
    const { setIsLoggedIn } = useAuthStore();

    const getProtectedData = async () => {
        try {
            const data = await http.get('/private/protected', true);

            console.log(data.message);
        } catch (error) {
            if (!checkLoginStatus()) {
                setIsLoggedIn(false)
                router.push('/login');
            }
            console.error('Error fetching protected data:', error);
        }
    };
    useEffect(() => {
        if (!checkLoginStatus()) {
            setIsLoggedIn(false)
            router.push('/login');
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white text-black rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Dashboard</h2>
                <p className="text-center text-gray-600">
                    Welcome to your dashboard! Here you can manage your account and settings.
                </p>
                <button onClick={getProtectedData} >a</button>
                <ChatRoom />
            </div>
        </div>
    );
};

export default Dashboard;
