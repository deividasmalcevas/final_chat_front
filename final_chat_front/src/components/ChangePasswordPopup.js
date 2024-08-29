import React, { useState } from 'react';
import ErrorPopup from "@/components/ErrorPopup";

const ChangePasswordPopup = ({ onClose, onSubmit }) => {
    const [newPassword, setNewPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = () => {
        if (password === confirmPassword) {
            onSubmit(newPassword, password);
        } else {
            setError('Passwords do not match!');
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
            {error && <ErrorPopup message={error} onClose={() => setError(null)}/>}
            <div className="fixed top-52 bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    &#x2715;
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <input
                        type="password"
                        className="border p-2 rounded w-full mb-3"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        className="border p-2 rounded w-full mb-3"
                        placeholder="Current Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        className="border p-2 rounded w-full mb-3"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white py-1 px-3 rounded"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPopup;
