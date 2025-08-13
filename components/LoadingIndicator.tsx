
import React, { useState, useEffect } from 'react';
import { CompassIcon } from './icons';

const loadingMessages = [
    "The storyteller is weaving your fate...",
    "Painting the scene with digital ink...",
    "Consulting the ancient scrolls...",
    "Carving your path in the digital stone...",
    "The cosmos aligns for your next move...",
];

const LoadingIndicator: React.FC = () => {
    const [message, setMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fadeIn">
            <div className="text-center">
                <CompassIcon className="w-16 h-16 text-indigo-400 animate-spin-slow mb-6" />
                <p className="text-xl text-gray-300 font-semibold">{message}</p>
            </div>
        </div>
    );
};

export default LoadingIndicator;
