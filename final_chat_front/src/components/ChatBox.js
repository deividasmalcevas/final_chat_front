import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import http from "@/plugins/http";
import sendNotification from '@/plugins/notification';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ConfirmationPopup from './ConfirmationPopup';
import io from 'socket.io-client'; // Import Socket.IO

const ChatBox = ({ user, type, roomId }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [conID, setConID] = useState(null);
    const [conName, setConName] = useState(null);
    const [conOwner, setOwner] = useState(null);
    const [visibleMenuIndex, setVisibleMenuIndex] = useState(null);
    const [current, setCurrent] = useState([]);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const chatEndRef = useRef(null);
    const router = useRouter();
    
    // Initialize socket connection
    const socket = useRef(null); // Use ref to store socket instance

    useEffect(() => {
        // Connect to the server
        socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:1010'); // Update to your server URL
    
        // Emit user login event
        socket.current.emit('user_login', { _id: current._id, username: current.username });
    
        // Join the specific room for the conversation
        if (conID) {
            socket.current.emit('join_room', conID);
        }
    
        socket.current.on('message', (newMessage) => {
            setChatHistory((prevChatHistory) => {
                // Check if the message already exists
                const messageIndex = prevChatHistory.findIndex(message => message._id === newMessage._id);
        
                if (messageIndex > -1) {
                    // Update the existing message
                    const updatedHistory = [...prevChatHistory];
                    updatedHistory[messageIndex] = newMessage; // Update the message
                    return updatedHistory;
                } else {
                    // Add the new message if it doesn't exist
                    return [...prevChatHistory, newMessage];
                }
            });
        });

        socket.current.on('message_deleted', (messageId) => {
            setChatHistory((prevChatHistory) => 
                prevChatHistory.filter(message => message._id !== messageId)
            );
        });
    
        return () => {
            socket.current.emit('user_logout', { _id: current._id });
            socket.current.disconnect(); // Clean up on unmount
        };
    }, [user, conID]); 
    
  

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await http.get('/private/get-user', true);
                if (res.error) return console.error(res.error);
                setCurrent(res.data);
            } catch (error) {
                console.error('Error fetching protected data:', error);
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await GetConvoData();
        };
        fetchData();
    }, [type, roomId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return; // Prevent sending empty messages
    
        try {
            let res;
    
            if (type === 'private') {
                res = await http.post(`/private/send-private-msg`, { user, msg: message });
                if (res.success) {
                    const recipientId = user._id;
                    socket.current.emit('check_user_status', recipientId, async (isConnected) => {
                        if(!isConnected) return await sendNotification(user._id, "You have received a new private message.", "message");
                        return;
                    });
                    console.log('here')
                }
            } else if (type === 'public') {
                res = await http.post(`/private/send-public-msg`, { conID, msg: message });
            }
    
            if (res.success) {
                const newMessage = res.data.messages[res.data.messages.length - 1];
    
                setConID(res.data._id);
                setChatHistory(res.data.messages); // Update chat history
                setMessage('');
    
                // Emit message to the correct room
                socket.current.emit('message', { ...newMessage, conID }); // Include conID
            } else {
                console.error('Failed to send message.');
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const GetConvoData = async () => {
        try {
            let res;
            if (type === 'private') {
                res = await http.get(`/private/get-private-con/${user._id}`, true);
            } else if (type === 'public') {
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
        try {
            const res = await http.post(`/private/add-msg-reaction`, { conID, messageId, reaction });
            
            if (res.success) {
                const updatedMessage = res.data;
    
                setChatHistory((prevChatHistory) => {
                    return prevChatHistory.map((message) => {
                        if (message._id === updatedMessage._id) {
                            return updatedMessage; 
                        }
                        return message; 
                    });
                });
    
                updatedMessage.conID = conID;
                socket.current.emit('reaction', updatedMessage);
            }
        } catch (err) {
            console.error('Failed to add reaction:', err);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const res = await http.post(`/private/del-msg`, { conID, messageId });
            if (res.success) {
                socket.current.emit('delete_message', { conID, messageId });
                return GetConvoData(); // Optionally refresh the conversation data
            }
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
    };

    const handleDeleteConversation = async () => {
        try {
            let res;
            if (type === 'private') {
                res = await http.post(`/private/del-convo`, { conID });
            } else if (type === 'public') {
                res = await http.post(`/private/delete-room`, { conID });
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

    const getConfirmationMessage = () => {
        if (type === "private") {
            return `Are you sure you want to delete this conversation with ${user.username}?`;
        } else if (type === "public") {
            return "Are you sure you want to delete this room?";
        }
    };

    const navigateToUser = (username) => {
        router.push(`/user/${username}`);
    };

    const navigateToRooms = () => {
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

            <MessageList
                chatHistory={chatHistory}
                currentUser={current}
                onDeleteMessage={handleDeleteMessage}
                onAddReaction={handleAddReaction}
                onNavigateToUser={navigateToUser}
                onToggleReactionMenu={setVisibleMenuIndex}
                visibleMenuIndex={visibleMenuIndex}
            />
            <MessageInput
                message={message}
                onMessageChange={(e) => setMessage(e.target.value)}
                onSendMessage={handleSendMessage}
            />
            {showConfirmPopup && (
                <ConfirmationPopup
                    onDelete={handleDeleteConversation}
                    onCancel={() => setShowConfirmPopup(false)}
                    message={getConfirmationMessage()}
                />
            )}
            <div ref={chatEndRef} />
        </div>
    );
};

export default ChatBox;
