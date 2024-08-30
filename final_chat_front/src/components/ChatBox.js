import React, { useState, useEffect, useRef } from 'react';
import http from "@/plugins/http";

const ChatBox = ({ user }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const chatEndRef = useRef(null); // Create a ref to scroll to the end

    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {
            const res = await http.post(`/private/send-private-msg`, { username: user.username, msg: message });
            if (res.success) {
                if (message.trim()) {
                    setChatHistory(res.data.messages);
                    setMessage('');
                }
            } else {
                console.error('Failed to fetch users.');
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };
    const fetchUserData = async (username) => {
        try {
            const res = await http.get(`/private/get-private-con/${username}`, true);
            if (res.success) {
                setChatHistory(res.data.messages);
            } else {
                console.error('Failed to fetch conversation.');
            }
        } catch (err) {
            console.error('Error fetching conversation:', err);
        }
    };
    useEffect(() => {
        fetchUserData(user.username);
    }, [user.username]);

    // Scroll to the bottom of the chat whenever chatHistory changes
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory]);

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Chat with {user.username}</h2>
            <div className="border border-gray-300 rounded-md h-64 p-4 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`mb-2 ${user.username !== chat.sender ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center ${user.username !== chat.sender ? 'justify-end' : 'justify-start'}`}>
                            {user.username === chat.sender && (
                                <img src={chat.avatar} alt={`${chat.sender}'s avatar`} className="h-8 w-8 rounded-full mr-2" />
                            )}
                            <span className={`${user.username === chat.sender ? 'bg-green-800 text-white' : 'bg-blue-500 text-white'} p-2 rounded`}>
                                {chat.content}
                            </span>
                            {user.username !== chat.sender && (
                                <img src={chat.avatar} alt={`${chat.sender}'s avatar`} className="h-8 w-8 rounded-full ml-2" />
                            )}
                        </div>
                        {/* Display the timestamp below the message */}
                        <span className={`text-xs text-gray-500 ${user.username !== chat.sender ? 'text-right' : 'text-left'}`}>
                            {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                {/* This div will be scrolled into view when a new message is added */}
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
        </div>
    );
};

export default ChatBox;
