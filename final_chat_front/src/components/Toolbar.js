"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import useAuthStore from '@/stores/authStore';
import http from '@/plugins/http';
import { useRouter } from 'next/navigation';
import NotificationsDropdown from './NotificationsDropdown';
import StatusDropdown from './StatusDropdown'; 
import { io } from 'socket.io-client';

const Toolbar = () => {
    const router = useRouter();
    const { isLoggedIn, checkLoginStatus, logout, change } = useAuthStore();
    const [error, setError] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [Id, setId] = useState(null);
    const [username, setUsername] = useState(null);
    const [status, setStatus] = useState('offline');
    const [menuOpen, setMenuOpen] = useState(false);

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
    const menuRef = useRef(null);
    const socket = useRef(null);
   

    useEffect(() => {
        if (isLoggedIn) {
            // Initialize socket connection
            socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:1010'); 

            // Join the user's private room for notifications
            socket.current.emit('user_toolbar', Id);

            // Listen for incoming notifications
            socket.current.on('receive_notification', (count) => {
                setUnreadCount(count);
            });

            return () => {
                socket.current.disconnect();
            };
        }
    }, [isLoggedIn, Id]);


    useEffect(() => {
        if (isLoggedIn || change) {

            socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:1010');

            getNotify();
            const getUser = async () => {
                try {
                    const res = await http.get('/private/get-user', true);
                    if (res.error) return setError(res.error);

                    setAvatar(res.data.avatar);
                    setUsername(res.data.username);
                    setStatus(res.data.status);
                    setId(res.data._id)
                } catch (error) {
                    console.error('Error fetching protected data:', error);
                }
            };
            getUser();
        } else {
            setAvatar(null);
            setId(null)
            setUsername(null);
            setStatus('offline');
        }
    }, [isLoggedIn, change]);

    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
                setDropdownOpen(false); // Close dropdown if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    const handleLogout = async () => {
        const res = await http.post('/private/logout', { username: username });
        if (res.error) return setError(res.error);
        logout();
        setMenuOpen(false);
        setAvatar(null);
        setUsername(null);
        setId(null)
        setStatus('offline');
        router.push('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleNotifications = async () => {
        setNotificationsOpen(!notificationsOpen);
        if (!notificationsOpen) {
            await getNotify();
        }
    };

    async function getNotify() {
        try {
            const res = await http.get('/private/get-notifications', true);
            if (res.success) {
                setNotifications(res.notifications);
                const unread = res.notifications.filter(notification => !notification.isRead).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleStatusChange = async (newStatuses) => {
        
        setStatus(newStatuses); // Update the local state

        try {
            const res = await http.post('/private/change-status', { status: newStatuses });
          
        } catch (error) {
            console.error('Error sending status to backend:', error);
        }
    
    };

    // Status color mapping
    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-500',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
        do_not_disturb: 'bg-purple-500',
    };

    return (
        <div className="bg-gray-800 text-white">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Clickable App Icon */}
                <div className="text-xl font-bold flex items-center">
                    <Link href="/" className="flex items-center">
                        <img src="https://i.imgur.com/W00cROn.png" alt="Logo" className="h-10 mr-2" />
                    </Link>
                </div>

                <nav className="flex space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/rooms" className="hover:text-gray-300">Rooms</Link>
                            <Link href="/users" className="hover:text-gray-300">Users</Link>
                        </>
                    ) : null /* Home link removed when not logged in */}
                </nav>

                {isLoggedIn ? (
                    <div className="relative flex items-center gap-3">
                        <div className="relative">
                            <button
                                onClick={toggleNotifications}
                                className="text-white hover:text-gray-300 focus:outline-none relative"
                            >
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405 1.405a1 1 0 01-1.415 0L15 17zm-6 0H4l1.405 1.405a1 1 0 001.415 0L9 17zm6-7V8a6 6 0 10-12 0v2l-1 1v3h14V11l-1-1z" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <NotificationsDropdown
                                notifications={notifications}
                                isOpen={notificationsOpen}
                                onClose={() => setNotificationsOpen(false)}
                            />
                        </div>

                        {/* User Status Indicator */}
                        <div className="relative">
                            <span className={`absolute top-0 right-0 block w-3 h-3 cursor-pointer rounded-full ${statusColors[status]}`} onClick={() => setDropdownOpen(!dropdownOpen)}></span>
                            <img
                                src={avatar}
                                alt="Avatar"
                                className="h-10 rounded-full cursor-pointer"
                                onClick={toggleMenu}
                            />
                        </div>

                        {menuOpen && (
                            <div
                                ref={menuRef}
                                className="absolute right-0 mt-60 w-48 bg-white rounded-lg shadow-lg py-2 text-black z-10"
                            >
                                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200" onClick={closeMenu}>Profile</Link>
                                <Link href="/conversations" className="block px-4 py-2 hover:bg-gray-200" onClick={closeMenu}>Conversations</Link>
                                <Link href="/friends" className="block px-4 py-2 hover:bg-gray-200" onClick={closeMenu}>Friends</Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                                    Logout
                                </button>
                            </div>
                        )}

                        {/* Render Status Dropdown */}
                        {dropdownOpen && (
                            <StatusDropdown
                                currentStatus={status}
                                onStatusChange={handleStatusChange}
                                closeDropdown={() => setDropdownOpen(false)}
                            />
                        )}
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <Link href="/register" className="hover:text-gray-300">
                            <button className="button-62" role="button">Register</button>
                        </Link>
                        <Link href="/login" className="hover:text-gray-300">
                            <button className="button-62" role="button">Login</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Toolbar;
