"use client";

import ChatBox from '@/components/ChatBox';
import {useParams} from "next/navigation"; // Import your ChatBox component

const RoomDetail = () => {

    const { roomId } = useParams();

    if (!roomId) {
        return <p>Loading...</p>; // Optionally, show a loading indicator
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded shadow-md">
            <div>
                {/* Use ChatBox with type public */}
                <ChatBox type={"public"} roomId={roomId}/> {/* Pass roomId to ChatBox if necessary */}
            </div>
        </div>
    );
};

export default RoomDetail;
