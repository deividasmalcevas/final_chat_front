"use client";

import React, { useEffect, useState } from 'react';
import ChatBox from '@/components/ChatBox';
import Loading from '@/components/Loading'; // Import the Loading component
import { useParams, useRouter } from "next/navigation";
import { checkLoginStatus } from "@/plugins/login";

const RoomDetail = () => {
    const { roomId } = useParams();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(null); // Initialize with null to indicate loading

    useEffect(() => {
        const loginStatus = checkLoginStatus();
        setIsLoggedIn(loginStatus);

        if (!loginStatus) {
            router.push('/login');
        }
    }, [router]);

    if (isLoggedIn === null || !roomId) {
        // Render the Loading component while checking login status or loading room data
        return <Loading message="Loading room details..." />;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded shadow-md">
            <div>
                <ChatBox type={"public"} roomId={roomId} />
            </div>
        </div>
    );
};

export default RoomDetail;
