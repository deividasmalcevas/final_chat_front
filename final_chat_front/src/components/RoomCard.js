import React from 'react';
import Link from 'next/link';

const RoomCard = ({ room }) => {
    return (
        <Link href={`/room/${room._id}`} passHref>
            <div className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-300 cursor-pointer">
                <h2 className="text-lg font-bold">{room.RoomName || 'Room Title'}</h2>
                <h5 className="text-lg">Owner:</h5>
                <div className='flex items-center gap-2'>
                <img
                                src={room.owner.avatar}
                                alt={room.owner.username}
                                className="h-10 w-10 rounded-full border border-gray-300"
                            />
                <p className=" text-black">{room.owner.username}</p>
                </div>
           
                <p className="text-sm text-gray-600">Visitors: {room.participants.length}</p>
                <p className="text-sm text-gray-500">Status: {room.RoomStatus}</p>
                <p className="text-sm text-gray-500">About: {room.bio}</p>
            </div>
        </Link>
    );
};

export default RoomCard;