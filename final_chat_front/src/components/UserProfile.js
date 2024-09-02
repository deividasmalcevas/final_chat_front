import React, { useState, useEffect } from 'react';
import http from "@/plugins/http";
import sendNotification from '@/plugins/notification'; // Adjust the import path as necessary

const UserProfile = ({ user }) => {
    const [friendStatus, setFriendStatus] = useState('not a friend'); // Initial status is 'not a friend'

    // Function to check the friendship status
    const checkFriendStatus = async () => {
        try {
            const response = await http.post('/private/check-friend', {
                userId: user._id
            });
            if (response.success) {
                setFriendStatus(response.status); // Set the status based on the response
            }
        } catch (error) {
            console.error("Error checking friend status:", error);
        }
    };

    // Function to handle adding a friend
    const handleAddFriend = async () => {
        try {
            const response = await http.post('/private/add-friend', {
                userIdToAdd: user._id
            });

            if (response.success) {
                // Check the status from the response
                if (response.status === 'pending') {
                    await sendNotification(user._id, "You have a new friend request", "friend_request");
                } else if (response.status === 'accepted') {
                    await sendNotification(user._id, "You have a new friend!", "friend_request");
                }
            }

            checkFriendStatus(); // Refresh the friend status
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };


    const renderFriendButton = () => {
        const buttonClasses = "flex-1 rounded-full text-white antialiased font-bold px-4 py-2 w-32"; 
        if (friendStatus === 'accepted') {
            return (
                <button className={`${buttonClasses} bg-green-600`} disabled>
                    Friends
                </button>
            );
        } else if (friendStatus === 'pending') {
            return (
                <button className={`${buttonClasses} bg-yellow-600`} disabled>
                    Pending
                </button>
            );
        } else if (friendStatus === 'declined') {
            return (
                <button className={`${buttonClasses} bg-red-600`} disabled>
                    Declined
                </button>
            );
        } else {
            return (
                <button
                    onClick={handleAddFriend}
                    className={`${buttonClasses} bg-blue-600 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-900`}
                >
                    Add
                </button>
            );
        }
    };

    // Function to render the user's status circle
    const renderStatusCircle = () => {
        let statusClass = '';
        switch (user.status) {
            case 'online':
                statusClass = 'bg-green-500';
                break;
            case 'busy':
                statusClass = 'bg-red-500';
                break;
            case 'away':
                statusClass = 'bg-yellow-500';
                break;
            default:
                statusClass = 'bg-gray-400'; // Offline or unknown status
                break;
        }
        
        return (
            <div className="ms-1.5 flex items-center gap-2">
                <span className={`inline-block text-black w-3 h-3 rounded-full ${statusClass}`}></span>
                <span className="text-black dark:text-white">
                    <strong className='text-black' >{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</strong>
                </span>
            </div>
        );
    };

    useEffect(() => {
        checkFriendStatus(); // Check the friendship status when the component mounts
    }, [user]); // Adding user to dependencies

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg mx-auto flex flex-col md:flex-row">
            <div className="flex flex-col items-center md:items-start md:w-1/3">
                <img
                    src={user.avatar || 'https://via.placeholder.com/150'}
                    alt={user.username}
                    className="w-32 h-32 rounded-full mb-4"
                />
                <h1 className="text-2xl text-black font-bold mb-2">{user.username}</h1>
                {/* Render User Status Circle */}
                {renderStatusCircle()}
                <div className="flex items-center mb-4">
                    <svg
                        className="h-6 w-6 text-gray-600 dark:text-gray-400"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                    >
                        <path
                            d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"
                        />
                    </svg>
                    <span className="text-gray-600 ml-2">{user.friends.filter(friend => friend.status === "accepted").length || 0} Friends</span>
                </div>

                {/* Render the friendship button here */}
                {renderFriendButton()}
            </div>
            <div className="mt-6 md:mt-0 md:ml-8 md:w-2/3">
                <h2 className="text-xl text-black font-bold mb-2">About Me</h2>
                <p className="text-gray-600 text-sm">{user.bio || 'This user has no bio.'}</p>
            </div>
        </div>
    );
};

export default UserProfile;
