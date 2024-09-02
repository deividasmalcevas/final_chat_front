import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import http from "@/plugins/http";
import sendNotification from '@/plugins/notification';
import ReactionsMenu from './ReactionsMenu';
import ReactionsDisplay from './ReactionsDisplay';
import { checkLoginStatus } from "@/plugins/login";

const ChatBox = ({ user, type, roomId }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [conID, setConID] = useState(null);
    const [conName, setConName] = useState(null);
    const [conOwner, setOwner] = useState(null);
    const [visibleMenuIndex, setVisibleMenuIndex] = useState(null);
    const chatEndRef = useRef(null);
    const [current, setCurrent] = useState([]);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const router = useRouter();

    const cookies = () => {
        if (!checkLoginStatus()) {
            router.push('/login'); // Redirect to login if not authenticated
            return; // Prevent further execution
        }
    };
    
    useEffect(() => {
        cookies()
        const getUser = async () => {
            try {
                const res = await http.get('/private/get-user', true);
                if (res.error) return setError(res.error);
                setCurrent(res.data);
            } catch (error) {
                console.error('Error fetching protected data:', error);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        cookies()
        const fetchData = async () => {
            await GetConvoData();
        };

        fetchData();
    }, [type, roomId]);

    useEffect(() => {
        cookies()
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        cookies()
        try {
            let res;
            if (type === 'private') {
                res = await http.post(`/private/send-private-msg`, { user, msg: message });
                if (res.success && message.trim()) {
                    await sendNotification(user._id, "You have received a new private message.", "message");
                }
            }
            if (type === 'public') {
                res = await http.post(`/private/send-prublic-msg`, { roomId: roomId, msg: message });
            }
            if (res.success) {
                if (message.trim()) {
                    setConID(res.data._id);
                    setChatHistory(res.data.messages);
                    setMessage('');
                }
            } else {
                console.error('Failed to send message.');
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const GetConvoData = async () => {
        cookies()
        try {
            let res;
            if (type === 'private') {
                res = await http.get(`/private/get-private-con/${user._id}`, true);
            }
            if (type === 'public') {
                res = await http.get(`/private/get-room/${roomId}`, true);
            }
            if (res.success) {
                if (type === 'public') {
                    setConName(res.data.RoomName);
                    setOwner(res.data.owner.id);
                }
                setConID(res.data._id);
                setChatHistory(res.data.messages);
            } else {
                if (type === 'public') console.log(res.error);
            }
        } catch (err) {
            console.error('Error fetching conversation:', err);
        }
    };

    const handleAddReaction = async (messageId, reaction) => {
        cookies()
        try {
            const res = await http.post(`/private/add-msg-reaction`, { conID, messageId, reaction });
            if (res.success) {
                return GetConvoData();
            }
        } catch (err) {
            console.error('Failed to add reaction:', err);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        cookies()
        try {
            const res = await http.post(`/private/del-msg`, { conID, messageId });
            if (res.success) {
                return GetConvoData();
            }
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
    };

    const handleReactionClick = (reactionType, messageId) => {
        cookies()
        const reactionMap = {
            'likes': '👍',
            'hearts': '❤️',
            'laughs': '😂',
            'sads': '😢',
        };

        const emoji = reactionMap[reactionType];
        if (emoji) {
            handleAddReaction(messageId, emoji);
        }
    };

    const toggleReactionMenu = (index) => {
        setVisibleMenuIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleDeleteConversation = async () => {
        cookies()
        try {
            let res;
            if (type === 'private') {
                res = await http.post(`/private/del-convo`, { conID });
            }
            if (type === 'public') {
                res = await http.post(`/private/delete-room`, { roomId });
            }
            if (res.success) {
                if (type === 'public') {
                    navigateToRooms();
                }
                setChatHistory([]);
                setConID(null);
                setShowConfirmPopup(false);
            } else {
                console.error('Failed to delete conversation.');
            }
        } catch (err) {
            console.error('Error deleting conversation:', err);
        }
    };

    const navigateToUser = (username) => {
        cookies()
        router.push(`/user/${username}`);
    };

    const navigateToRooms = () => {
        cookies()
        router.push(`/rooms`);
    };

    return (
        <div className="mt-8">
            {type === 'private' && conID && (
                <div className="flex justify-end mb-4">
                    <button
                        className="button-62 text-red-500"
                        onClick={() => setShowConfirmPopup(true)}
                    >
                        🗑️ Delete Conversation
                    </button>
                </div>
            )}
            {type === 'public' && conID && conOwner === current._id && (
                <div className="flex justify-end mb-4">
                    <button
                        className="button-62 text-red-500"
                        onClick={() => setShowConfirmPopup(true)}
                    >
                        🗑️ Delete Room
                    </button>
                </div>
            )}
            {type === 'public' && (
                <div className="flex justify-center mb-4">
                    <span className="text-black font-bold text-2xl">{conName}</span>
                </div>
            )}
            <div className="border bg-white border-gray-300 rounded-md h-64 p-4 overflow-y-auto">
                {chatHistory.map((chat, index) => {
                    const isSender = current._id === chat.senderId;

                    return (
                        <div key={index} className={`mb-2 ${!isSender ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center ${isSender ? 'justify-end' : 'justify-start'}`}>
                                {!isSender && (
                                    <img
                                        src={chat.avatar}
                                        alt={`${chat.sender}'s avatar`}
                                        className="h-8 w-8 rounded-full mr-2 cursor-pointer"
                                        onClick={() => navigateToUser(chat.sender)}
                                    />
                                )}
                                <span
                                    className={`font-bold text-black cursor-pointer`}
                                    onClick={() => navigateToUser(chat.sender)}
                                >
                                    {chat.sender}
                                </span>
                                {isSender && (
                                    <img
                                        src={chat.avatar}
                                        alt={`${chat.sender}'s avatar`}
                                        className="h-8 w-8 rounded-full ml-2 cursor-pointer"
                                        onClick={() => navigateToUser(chat.sender)}
                                    />
                                )}
                            </div>
                            <div className={`flex items-center ${isSender ? 'justify-end' : 'justify-start'}`}>
                                <span className={`${!isSender ? 'bg-green-800 text-white' : 'bg-blue-500 text-white'} p-2 rounded`}>
                                    {chat.content}
                                </span>
                            </div>
                            <div className={`flex items-center ${isSender ? 'justify-end' : 'justify-start'}`}>
                                {isSender && (
                                    <button
                                        className="text-red-500 ml-3"
                                        onClick={() => handleDeleteMessage(chat._id)}
                                    >
                                        🗑️
                                    </button>
                                )}
                                <span className="text-xs text-gray-500">
                                    {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {!isSender && (
                                    <div className="relative">
                                        <button className="text-gray-500 ml-3"
                                                onClick={() => toggleReactionMenu(index)}
                                        >
                                            ...
                                        </button>
                                        {visibleMenuIndex === index && (
                                            <ReactionsMenu
                                                messageId={chat._id}
                                                handleAddReaction={handleAddReaction}
                                                closeMenu={() => setVisibleMenuIndex(null)}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className={`flex items-center ${isSender ? 'justify-end' : 'justify-start'}`}>
                                <ReactionsDisplay
                                    reactions={chat.reactions}
                                    onReactionClick={(reactionType) => handleReactionClick(reactionType, chat._id)}
                                    currentUser={current}
                                />
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex mt-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="border border-gray-300 rounded-l-md p-2 flex-grow text-black"
                />
                <button type="submit" className="bg-blue-500 text-white rounded-r-md px-4">Send</button>
            </form>

            {showConfirmPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white text-black p-4 rounded shadow-lg">
                        {type === "private" && (
                            <p>Are you sure you want to delete this conversation with {user.username}?</p>
                        )}
                        {type === "public" && (
                            <p>Are you sure you want to delete this room?</p>
                        )}
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                onClick={handleDeleteConversation}
                            >
                                Yes, Delete
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                                onClick={() => setShowConfirmPopup(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
