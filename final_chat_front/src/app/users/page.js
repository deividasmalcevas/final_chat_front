"use client";

import React, { useState, useEffect, useRef } from 'react';
import http from "@/plugins/http";
import ProfileCard from "@/components/ProfileCard";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 12;
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        try {
            const res = await http.get(`/private/users?page=${page}&limit=${usersPerPage}`, true);
            if (res.success) {
                setUsers(res.data.users);
                setTotalPages(res.data.totalPages);
            } else {
                console.error('Failed to fetch users.');
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-8 bg-white text-black min-h-screen">
            <h1 className="text-3xl flex justify-center items-center font-bold mb-6">Users</h1>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {users.map((user) => (
                        <ProfileCard user={user} key={user.username}/>
                    ))}
                </div>
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
        </div>
    );
};

export default Users;
