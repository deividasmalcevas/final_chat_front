"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import http from "@/plugins/http";
import useAuthStore from '@/stores/authStore';
import ErrorPopup from "@/components/ErrorPopup"; // Import the ErrorPopup component

const Login = () => {
    const router = useRouter();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Change initial state to null for better handling
    const [successMessage, setSuccessMessage] = useState('');
    const { setIsLoggedIn } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state on form submit
        setSuccessMessage('');

        try {
            const res = await http.post("/auth/login", {
                identifier: emailOrUsername,
                password: password,
            });
            if (res.success) {
                setIsLoggedIn(true);
                setSuccessMessage('Login successful! Redirecting...');
                await router.push('/profile');
            } else {
                setError(res.error || 'Invalid login credentials. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to login. Please try again later.');
        }
    };

    const handleCloseError = () => {
        setError(null); // Close the error popup
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white text-black rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email or Username</label>
                        <input
                            type="text"
                            required
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
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
                    <button type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition duration-300">
                        Login
                    </button>
                </form>
                <div>
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
                    </p>
                    <p className="text-center text-sm text-gray-600">
                        Forgot password?{' '}
                        <Link href="/password-recovery" className="text-blue-600 hover:underline">Password Recovery</Link>
                    </p>
                </div>
            </div>

            {error && <ErrorPopup message={error} onClose={handleCloseError} />} {/* Render ErrorPopup if error exists */}
        </div>
    );
};

export default Login;
