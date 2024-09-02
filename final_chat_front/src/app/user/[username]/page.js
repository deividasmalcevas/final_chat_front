"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import http from "@/plugins/http";
import UserProfile from "@/components/UserProfile";
import ChatBox from "@/components/ChatBox";
import Loading from "@/components/Loading"; // Import the Loading component

const SingleUser = () => {
    const router = useRouter();
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        if (username) {
            fetchUserData(username);
        }
    }, [username, router]);

    const fetchUserData = async (username) => {
        setLoading(true); // Set loading to true before fetching data
        try {
            const res = await http.get(`/private/users/${username}`, true);
            if (res.same) return router.push('/profile'); // Redirect if the same user
            if (res.success) {
                setUser(res.data);
            } else {
                router.push('/users'); 
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        } finally {
            setLoading(false); // Set loading to false after fetching data
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded shadow-md">
            {loading ? ( // Render loading state if loading is true
                <Loading message="Loading user information..." />
            ) : (
                user ? (
                    <div>
                        <UserProfile user={user} />
                        <ChatBox user={user} type={"private"} />
                    </div>
                ) : (
                    <p>User not found</p>
                )
            )}
        </div>
    );
};

export default SingleUser;
