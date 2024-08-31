import React from 'react';

const ReactionsMenu = ({ messageId, handleAddReaction, closeMenu }) => {
    return (
        <div className="absolute left-10 top-minus-25 py-1 w-50 bg-white border rounded shadow-lg flex flex-row">
            <button
                onClick={() => { handleAddReaction(messageId, '👍'); closeMenu(); }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                👍
            </button>
            <button
                onClick={() => { handleAddReaction(messageId, '❤️'); closeMenu(); }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                ❤️
            </button>
            <button
                onClick={() => { handleAddReaction(messageId, '😂'); closeMenu(); }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                😂
            </button>
            <button
                onClick={() => { handleAddReaction(messageId, '😢'); closeMenu(); }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                😢
            </button>
        </div>
    );
};

export default ReactionsMenu;
