"use client";

import React, { useEffect, useState } from 'react';
import ChatBox from '@/components/ChatBox';
import Loading from '@/components/Loading'; // Import the Loading component
import { useParams, useRouter } from "next/navigation";

const RoomDetail = () => {
    const { roomId } = useParams();
    
    if (!roomId) {
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
