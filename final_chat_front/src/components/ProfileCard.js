import React from 'react';
import { useRouter } from 'next/navigation';
import http from "@/plugins/http"; // Ensure this path is correct
import sendNotification from '@/plugins/notification'; // Adjust the import path as necessary

const ProfileCard = ({ user, friendStatus, onFriendStatusChange }) => {
    const router = useRouter();

    const acceptedFriendsCount = user.friends.filter(friend => friend.status === 'accepted').length;

    const handleNavigation = () => {
        router.push(`/user/${user.username}`);
    };

    const handleAddFriend = async () => {
        try {
            const res = await http.post('/private/add-friend', { userIdToAdd: user._id });
            if (res.success) {
                // Check the status from the response and send notification
                if (res.status === 'pending') {
                    await sendNotification(user._id, "You have a new friend request", "friend_request");
                } else if (res.status === 'accepted') {
                    await sendNotification(user._id, "You have a new friend!", "friend_request");
                }
                onFriendStatusChange(user.username, 'pending'); // Notify parent to update the status
            } else {
                console.error('Failed to send friend request:', res.message);
            }
        } catch (err) {
            console.error('Error adding friend:', err);
        }
    };

    const renderFriendButton = () => {
        let buttonClasses = "flex-1 rounded-full text-white antialiased font-bold px-4 py-2 w-32"; 
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
        } else if (friendStatus === 'canceled') {
            return (
                <button className={`${buttonClasses} bg-red-600`} disabled>
                    Canceled
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
            <div className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${statusClass}`}></span>
                <span className="text-black dark:text-white">
                    <strong>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</strong>
                </span>
            </div>
        );
    };

    return (
        <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <div className="border-b px-4 pb-6">
                <div className="text-center my-4">
                    <img
                        onClick={handleNavigation}
                        className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4 cursor-pointer"
                        src={user.avatar}
                        alt={`${user.username}'s avatar`}
                    />
                    <div className="py-2">
                        <h3
                            onClick={handleNavigation}
                            className="font-bold text-2xl text-gray-800 dark:text-white mb-1 cursor-pointer"
                        >
                            {user.username}
                        </h3>
                    </div>
                </div>
                <div className="flex gap-2 px-2">
                    {renderFriendButton()}
                    {/* Message button with onClick */}
                    <button
                        onClick={handleNavigation}
                        className="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black hover:bg-gray-800 dark:text-white px-4 py-2 cursor-pointer w-32"
                    >
                        Message
                    </button>
                </div>
            </div>
            <div className="px-4 py-4">
                <div className="flex gap-2 items-center text-gray-800 dark:text-gray-300 mb-4">
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
                    <span>
                        <strong className="text-black dark:text-white">
                            {acceptedFriendsCount}
                        </strong> Friends
                    </span>
                </div>
                {/* User Status Display */}
                {renderStatusCircle()}
            </div>
        </div>
    );
};

export default ProfileCard;
