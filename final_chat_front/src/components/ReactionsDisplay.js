import React from 'react';

const ReactionsDisplay = ({ reactions, onReactionClick, currentUser }) => {
    if (!reactions) return null;

    // Mapping reaction types to their respective emojis
    const reactionTypeToEmojiMap = {
        likes: '👍',
        hearts: '❤️',
        laughs: '😂',
        sads: '😢',
    };

    return (
        <div className="flex items-center space-x-2">
            {Object.entries(reactions).map(([reactionType, reactionData]) => (
                reactionData.count > 0 && (
                    <span
                        key={reactionType}
                        className={`flex items-center border border-gray-400 rounded-md px-2 py-1 cursor-pointer hover:bg-gray-300 transition duration-200 ${
                            reactionData.users.includes(currentUser._id) ? 'bg-green-300' : 'bg-gray-200'
                        }`}
                        onClick={() => onReactionClick(reactionTypeToEmojiMap[reactionType])}
                    >
                        {reactionTypeToEmojiMap[reactionType]} {/* Display the corresponding emoji */}
                        <span className="ml-1 text-black">{reactionData.count}</span>
                    </span>
                )
            ))}
        </div>
    );
};

export default ReactionsDisplay;
