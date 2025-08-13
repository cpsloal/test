
import React, { useState } from 'react';

interface StartScreenProps {
  onStart: (theme: string) => void;
}

const placeholderThemes = [
    "A mysterious enchanted forest",
    "A cyberpunk city under neon lights",
    "A derelict spaceship adrift in the cosmos",
    "A forgotten kingdom of steampunk automatons",
    "A swashbuckling pirate adventure on the high seas"
];

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [theme, setTheme] = useState('');
  const [placeholder] = useState(placeholderThemes[Math.floor(Math.random() * placeholderThemes.length)]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (theme.trim()) {
      onStart(theme);
    } else {
      onStart(placeholder);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center animate-fadeIn">
      <h1 className="text-6xl md:text-8xl font-medieval text-indigo-300 mb-4">Gemini Adventure</h1>
      <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl">
        Craft a unique story with every choice. What world will you explore?
      </p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder={`E.g., "${placeholder}"`}
          className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
        />
        <button
          type="submit"
          className="mt-6 px-12 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors duration-300 shadow-lg shadow-indigo-600/30 transform hover:scale-105"
        >
          Begin Your Journey
        </button>
      </form>
    </div>
  );
};

export default StartScreen;
