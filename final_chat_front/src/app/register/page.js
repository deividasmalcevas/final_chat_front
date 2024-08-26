"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import http from "@/plugins/http";

const Register = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [token, setToken] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            const res = await http.post("/auth/register", {
                email: email,
                username: username,
                password1: password,
                password2: confirmPassword,
            });

            if (res.message) {
                setIsRegistered(true);
                setSuccessMessage(res.message);
            } else {
                setError(res.error || 'An error occurred. Please try again.');
            }
        } catch (err) {
            setError('Failed to register. Please try again later.');
        }
    };

    const handleVerify = async () => {
        try {
            const res = await http.post("/auth/register-token", {
                token: token,
            });

            if (res.message) {
                await router.push('/login');
            } else {
                setError(res.error || 'Invalid token. Please try again.');
            }
        } catch (err) {
            setError('Failed to verify token. Please try again later.');
        }
    };


    const handleResendCode = async () => {
        setError('');
        try {
            const res = await http.post("/auth/register", {
                email: email,
                username: username,
                password1: password,
                password2: confirmPassword,
            });
            if (res.message) {
                setSuccessMessage(res.message);
                // Start the countdown
                setResendDisabled(true);
                setCountdown(30);
            } else {
                setError(res.error || 'An error occurred while resending the code.');
            }
        } catch (err) {
            setError('Failed to resend code. Please try again later.');
        }
    };

    useEffect(() => {
        let timer;
        if (resendDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        if (countdown === 0) {
            setResendDisabled(false);
        }
        return () => clearInterval(timer); // Cleanup timer on component unmount
    }, [resendDisabled, countdown]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white text-black rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Create an Account</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

                {!isRegistered ? (
                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition duration-300">
                            Register
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <p className="text-center text-sm text-gray-600">Enter the verification code sent to your email:</p>
                        <div>
                            <input
                                type="text"
                                required
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-between gap-2"> {/* Added gap here */}
                            <button onClick={handleVerify} className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md transition duration-300">
                                Submit Code
                            </button>
                            <button
                                onClick={handleResendCode}
                                className={`w-1/2 ${resendDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700'} text-white font-bold py-2 rounded-md transition duration-300`}
                                disabled={resendDisabled}
                            >
                                {resendDisabled ? `Resend Code (${countdown})` : 'Resend Code'}
                            </button>
                        </div>
                    </div>
                )}

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
