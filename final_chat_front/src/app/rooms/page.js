"use client";

import React, { useState, useEffect, useRef } from 'react';
import http from "@/plugins/http"; // Ensure the path is correct
import RoomCard from "@/components/RoomCard"; // Create a new RoomCard component similar to ProfileCard
import CreateRoomModal from "@/components/CreateRoomModal"; // Import the modal component

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const roomsPerPage = 20; // Limit to 20 rooms per page
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fetchRooms(currentPage);
    }, [currentPage]);

    const fetchRooms = async (page) => {
        try {
            const res = await http.get(`/private/conversations?page=${page}&limit=${roomsPerPage}`, true);
            if (res.success) {
                setRooms(res.data);
                setTotalPages(res.totalPages);
            } else {
                setRooms([]);
                setTotalPages(1);
            }
        } catch (err) {
            console.error('Failed to fetch rooms:', err);
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="p-8 bg-white text-black min-h-screen">
            <h1 className="text-3xl flex justify-center items-center font-bold mb-6">Public Rooms</h1>

            <div className="flex justify-center mb-4">
                <button
                    onClick={toggleModal}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Create Room
                </button>
            </div>

            <div className="container mx-auto">
                {rooms.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {rooms.map((room) => (
                            <RoomCard room={room} key={room._id} />
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center text-gray-500">
                        No rooms available.
                    </div>
                )}
            </div>

            <div className="flex justify-center items-center mt-4 space-x-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {/* Create Room Modal */}
            {isModalOpen && (
                <CreateRoomModal isOpen={isModalOpen} toggleModal={toggleModal} fetchRooms={fetchRooms} />
            )}
        </div>
    );
};

export default Rooms;
