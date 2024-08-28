import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:1010');

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [user] = useState({ id: '1', name: 'John Doe' }); // Example user

    useEffect(() => {
        // Emit user login only once when the component mounts
        socket.emit('user_login', user);
        console.log(`User logged in: ${user.name} with ID: ${user.id}`);

        // Listen for new messages
        socket.on('new_message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            // Emit user logout only once when the component unmounts
            socket.emit('user_logout', { id: user.id });
            console.log(`User logged out with ID: ${user.id}`);
            socket.off('new_message'); // Clean up the message listener
        };
    }, [user]);

    const sendMessage = () => {
        if (message.trim()) {
            const messageObject = {
                text: message,
                sender: user.name,
            };
            socket.emit('send_message', messageObject);
            setMessage(''); // Clear the input field after sending the message
        }
    };

    return (
        <div className="chat-room">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}: </strong>
                        {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;
