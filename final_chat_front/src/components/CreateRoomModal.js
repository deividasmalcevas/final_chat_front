import React, { useState } from 'react';
import http from "@/plugins/http";
import ErrorPopup from "@/components/ErrorPopup"; // Ensure the path is correct

const CreateRoomModal = ({ isOpen, toggleModal, fetchRooms }) => {
    const [roomName, setRoomName] = useState('');
    const [bio, setBio] = useState(''); // State for bio
    const [error, setError] = useState('');

    const handleClose = () => {
        setError(null);
    };

    const handleCreateRoom = async () => {
        if (!roomName) {
            setError('Room name is required.');
            return;
        }

        if (!bio) {
            setError('Bio is required.');
            return;
        }

        try {
            const res = await http.post('/private/create-room', { roomName, bio });
            if (res.success) {
                toggleModal();
                fetchRooms(1);
            } else {
                setError(res.error);
            }
        } catch (err) {
            console.error('Error creating room:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 rounded shadow-lg z-50">
                <h2 className="text-xl font-bold mb-4">Create Public Room</h2>
                {error && <ErrorPopup message={error} onClose={handleClose} />}

                <input
                    type="text"
                    placeholder="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded mb-4"
                />
                <textarea
                    placeholder="Room Bio (required)"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded mb-4"
                    rows="3"
                />

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={toggleModal}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateRoom}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Create
                    </button>
                </div>
            </div>
            <div className="fixed inset-0 bg-black opacity-50" onClick={toggleModal}></div>
        </div>
    );
};

export default CreateRoomModal;
