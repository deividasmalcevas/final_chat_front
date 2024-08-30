import React, { useState } from 'react';

const UserProfile = ({ user }) => {
    const [isFriend, setIsFriend] = useState(user.isFriend); // Assume 'isFriend' is a property of the user object

    const handleAddFriend = () => {
        // Logic to add the user as a friend
        setIsFriend(true); // Mock adding friend
        // Make an API call to add the user as a friend if required
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg  mx-auto flex flex-col md:flex-row">
            <div className="flex flex-col items-center md:items-start md:w-1/3">
                <img
                    src={user.avatar || 'https://via.placeholder.com/150'}
                    alt={user.username}
                    className="w-32 h-32 rounded-full mb-4"
                />
                <h1 className="text-2xl text-black font-bold mb-2">{user.username}</h1>
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
                    <span className="text-gray-600 ml-2">{user.friendsCount || 0} Friends</span>
                </div>
                {!isFriend && (
                    <button
                        onClick={handleAddFriend}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                    >
                        Add to Friends
                    </button>
                )}
                {isFriend && (
                    <p className="text-green-600 font-bold">You are friends with {user.username}!</p>
                )}
            </div>
            <div className="mt-6 md:mt-0 md:ml-8 md:w-2/3">
                <h2 className="text-xl text-black font-bold mb-2">About Me</h2>
                <p className="text-gray-600 text-sm">{user.bio || 'This user has no bio.'}</p>
            </div>
        </div>
    );
};

export default UserProfile;
