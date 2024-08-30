"use client";

import React, { useEffect, useState } from 'react';
import {useParams, useRouter} from 'next/navigation';
import http from "@/plugins/http";
import UserProfile from "@/components/UserProfile";
import ChatBox from "@/components/ChatBox";

const SingleUser = () => {
    const router = useRouter();
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        if (username) {
            fetchUserData(username);
        }
    }, [username]);

    const fetchUserData = async (username) => {
        try {
            const res = await http.get(`/private/users/${username}`, true);
            if(res.same) return router.push('/profile');
            if (res.success) {
                setUser(res.data);
            } else {
                console.error('Failed to fetch user data.');
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };


    return (
        <div className="container mx-auto p-6 bg-white rounded shadow-md">
            {user ? (
                <div>
                    <UserProfile user={user} />

                    <ChatBox user={user} />

                </div>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
};

export default SingleUser;
