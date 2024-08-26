// components/Toolbar.js

import React from 'react';
import Link from 'next/link';

const Toolbar = () => {
    return (
        <div className="bg-gray-800 text-white">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <div className="text-xl font-bold">
                    <Link href="/" className="hover:text-gray-300">
                        MyApp
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex space-x-4">
                    <Link href="/" className="hover:text-gray-300">Home</Link>
                    <Link href="/about" className="hover:text-gray-300">About</Link>
                    <Link href="/services" className="hover:text-gray-300">Services</Link>
                    <Link href="/contact" className="hover:text-gray-300">Contact</Link>
                </nav>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Action Button */}
                <Link href="/login">
                    <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Login
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Toolbar;
