"use client";

import React, { useState, useEffect, useRef } from 'react';
import http from "@/plugins/http";
import RoomCard from "@/components/RoomCard";
import CreateRoomModal from "@/components/CreateRoomModal";
import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading"; // Import the Loading component
import { useRouter } from 'next/navigation';
import { checkLoginStatus } from "@/plugins/login"; // Import the checkLoginStatus function

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); // State to manage loading
    const roomsPerPage = 20;
    const isFirstRender = useRef(true);
    const router = useRouter();

    useEffect(() => {
        cookies();

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fetchRooms(currentPage);
    }, [currentPage, router]);

    const cookies = () => {
        if (!checkLoginStatus()) {
            router.push('/login'); // Redirect to login if not authenticated
            return; // Prevent further execution
        }
    };

    const fetchRooms = async (page) => {
        cookies();
        setLoading(true); // Set loading to true before starting the fetch
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
        } finally {
            setLoading(false); // Set loading to false once fetching is complete
        }
    };

    const handlePageChange = (page) => {
        cookies();
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const toggleModal = () => {
        cookies();
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="p-8 bg-gray-100 text-black min-h-screen">
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
                {loading ? (
                    <Loading message="Loading rooms..." />
                ) : rooms.length > 0 ? (
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

            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
            />

            {isModalOpen && (
                <CreateRoomModal isOpen={isModalOpen} toggleModal={toggleModal} fetchRooms={fetchRooms} />
            )}
        </div>
    );
};

export default Rooms;
