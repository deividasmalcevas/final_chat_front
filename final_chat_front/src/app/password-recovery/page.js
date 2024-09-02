"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import http from "@/plugins/http";
import ErrorPopup from "@/components/ErrorPopup"; // Import the ErrorPopup component

const PasswordRecovery = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null); // Change initial state to null
    const [successMessage, setSuccessMessage] = useState('');
    const [timer, setTimer] = useState(300); // 300 seconds = 5 minutes

    useEffect(() => {
        if (step === 2 && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else if (timer === 0) {
            setError('Verification code expired. Please request a new code.');
            setStep(1);
        }
    }, [step, timer]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state
        setSuccessMessage('');

        try {
            const res = await http.post("/auth/password-recovery", { email });
            if (res.success) {
                setSuccessMessage('Verification code sent! Please check your email.');
                setStep(2);
                setTimer(300); // Reset timer to 5 minutes
            } else {
                setError(res.error || 'Failed to send verification code. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to send verification code. Please try again later.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state
        setSuccessMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const res = await http.post("/auth/password-reset", {
                email,
                code: verificationCode,
                password: newPassword,
            });
            if (res.success) {
                setSuccessMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(res.error || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to reset password. Please try again later.');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleCloseError = () => {
        setError(null); // Close the error popup
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white text-black rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">
                    {step === 1 ? 'Password Recovery' : 'Verify and Reset Password'}
                </h2>
                {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

                {step === 1 && (
                    <form className="space-y-6" onSubmit={handleEmailSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition duration-300">
                            Send Verification Code
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form className="space-y-6" onSubmit={handleResetPassword}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                            <input
                                type="text"
                                required
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <p className="text-center text-sm text-gray-600">Time remaining: {formatTime(timer)}</p>
                        <button type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition duration-300">
                            Reset Password
                        </button>
                    </form>
                )}
            </div>

            {error && <ErrorPopup message={error} onClose={handleCloseError} />} {/* Render ErrorPopup if error exists */}
        </div>
    );
};

export default PasswordRecovery;
