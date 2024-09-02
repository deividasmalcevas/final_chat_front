import React, { useEffect } from 'react';

const ErrorPopup = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="fixed top-5 bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    &#x2715; {/* X mark for close */}
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-800">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPopup;