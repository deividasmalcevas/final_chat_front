import React, { useState } from 'react';
import ErrorPopup from "@/components/ErrorPopup";

const DeleteUserPopup = ({ onClose, onSubmitPasswordVerification, onSubmitDelete }) => {
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState(null);

    const handleNext = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            const response = await onSubmitPasswordVerification(password);
            if (response.error) {
                setError(response.error);
            } else {
                setStep(2);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    const handleVerificationSubmit = async () => {
        try {
            const response = await onSubmitDelete(verificationCode);
            if (response.error) {
                setError(response.error);
            } else {
                onClose();  // Close the popup on successful deletion
            }
        } catch (err) {
            setError('An unexpected error occurred during verification. Please try again.');
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
            {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
            <div className="fixed top-52 bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    &#x2715;
                </button>
                {step === 1 ? (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-4">Delete User - Step 1</h2>
                        <input
                            type="password"
                            className="border p-2 rounded w-full mb-3"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            className="border p-2 rounded w-full mb-3"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            className="bg-red-600 text-white py-1 px-3 rounded"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-4">Delete User - Step 2</h2>
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-lg">
                            <h6 className="font-medium">A verification code has been sent to your email.</h6>
                        </div>
                        <input
                            type="text"
                            className="border p-2 rounded w-full mb-3"
                            placeholder="Enter Verification Code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <button
                            className="bg-red-600 text-white py-1 px-3 rounded"
                            onClick={handleVerificationSubmit}
                        >
                            Delete Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeleteUserPopup;
