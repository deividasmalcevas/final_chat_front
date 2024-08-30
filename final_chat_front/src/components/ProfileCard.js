import React from 'react';
import { useRouter } from 'next/navigation';

const ProfileCard = ({ user }) => {
    const router = useRouter();

    // Function to handle navigation to the user's profile
    const handleNavigation = () => {
        router.push(`/user/${user.username}`);
    };

    return (
        <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <div className="border-b px-4 pb-6">
                <div className="text-center my-4">
                    {/* Avatar with onClick */}
                    <img
                        onClick={handleNavigation}
                        className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4 cursor-pointer"
                        src={user.avatar}
                        alt={`${user.username}'s avatar`}
                    />
                    <div className="py-2">
                        {/* Username with onClick */}
                        <h3
                            onClick={handleNavigation}
                            className="font-bold text-2xl text-gray-800 dark:text-white mb-1 cursor-pointer"
                        >
                            {user.username}
                        </h3>
                    </div>
                </div>
                <div className="flex gap-2 px-2">
                    <button className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2">
                        Friend
                    </button>
                    {/* Message button with onClick */}
                    <button
                        onClick={handleNavigation}
                        className="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2 cursor-pointer"
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
                            {user.friends ? user.friends : 0}
                        </strong> Friends
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
