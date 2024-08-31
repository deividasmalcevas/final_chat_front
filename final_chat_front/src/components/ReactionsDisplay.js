import React from 'react';

const ReactionsDisplay = ({ reactions, onReactionClick, currentUser }) => {
    if (!reactions) return null;

    return (
        <div className="flex items-center space-x-2">
            {Object.entries(reactions).map(([reactionType, reactionData]) => (
                reactionData.count > 0 && (
                    <span
                        key={reactionType}
                        className={`flex items-center border border-gray-400 rounded-md px-2 py-1 cursor-pointer hover:bg-gray-300 transition duration-200 ${
                            reactionData.users.includes(currentUser._id) ? 'bg-green-300' : 'bg-gray-200'
                        }`}
                        onClick={() => onReactionClick(reactionType)}
                    >
                        {reactionType === 'likes' && '👍'} {/* Emoji for likes */}
                        {reactionType === 'hearts' && '❤️'} {/* Emoji for hearts */}
                        {reactionType === 'laughs' && '😂'} {/* Emoji for laughs */}
                        {reactionType === 'sads' && '😢'} {/* Emoji for sads */}
                        <span className="ml-1 text-black">{reactionData.count}</span>
                    </span>
                )
            ))}
        </div>
    );
};

export default ReactionsDisplay;
