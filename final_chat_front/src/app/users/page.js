"use client";

import React, { useState, useEffect, useRef } from 'react';
import http from "@/plugins/http";
import ProfileCard from "@/components/ProfileCard";
import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading"; // Import the Loading component

const Users = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true); // State to manage loading
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
       
        setIsLoading(true); // Set loading to true when fetching starts
        try {
            const res = await http.get(`/private/users?page=${page}&limit=${usersPerPage}`, true);
            if (res.success) {
                const usersWithStatus = await Promise.all(res.data.users.map(async (user) => {
                    const statusResponse = await http.post('/private/check-friend', { userId: user._id });
                    return { ...user, friendStatus: statusResponse.status || 'not a friend' };
                }));
                setUsers(usersWithStatus);
                setTotalPages(res.data.totalPages);
            } else {
                console.error('Failed to fetch users.');
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setIsLoading(false); // Set loading to false when fetching is complete
        }
    };

    const handleFriendStatusChange = (username, status) => {
       
        setUsers((prevUsers) =>
            prevUsers.map((user) => {
                if (user.username === username) {
                    return { ...user, friendStatus: status };
                }
                return user;
            })
        );
    };

    const handlePageChange = (page) => {
       
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (isLoading) {
        return <Loading message="Loading users..." />; // Render Loading component when loading
    }

    return (
        <div className="p-8 bg-gray-100 text-black min-h-screen">
            <h1 className="text-3xl flex justify-center items-center font-bold mb-6">Users</h1>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> 
                    {users.map((user) => (
                        <ProfileCard
                            user={user}
                            key={user.username}
                            friendStatus={user.friendStatus}
                            onFriendStatusChange={handleFriendStatusChange}
                        />
                    ))}
                </div>
            </div>
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
            />
        </div>
    );
};

export default Users;
