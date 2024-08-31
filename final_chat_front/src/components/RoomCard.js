import React from 'react';
import Link from 'next/link';

const RoomCard = ({ room }) => {
    return (
        <Link href={`/room/${room._id}`} passHref>
            <div className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-300 cursor-pointer">
                <h2 className="text-lg font-bold">{room.RoomName || 'Room Title'}</h2>
                <p className="text-sm text-gray-600">Visitors: {room.participants.length}</p>
                <p className="text-sm text-gray-500">Status: {room.RoomStatus}</p>
                <p className="text-sm text-gray-500">About: {room.bio}</p>
            </div>
        </Link>
    );
};

export default RoomCard;