
import React, { useState, useEffect } from 'react';
import type { StoryStep } from '../types';

interface GameScreenProps {
  scene: StoryStep | null;
  onChoice: (choice: string) => void;
  disabled: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ scene, onChoice, disabled }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (scene) {
      setVisible(false);
      // Timeout to allow fade-out, then update content and fade-in
      const timer = setTimeout(() => {
        setVisible(true);
      }, 100); // short delay to trigger transition
      return () => clearTimeout(timer);
    }
  }, [scene]);

  if (!scene) {
    return null; 
  }

  return (
    <div className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 rounded-lg overflow-hidden shadow-2xl shadow-black/50 border-2 border-gray-700">
          <img
            src={`data:image/png;base64,${scene.imageBase64}`}
            alt="Scene visual"
            className="w-full h-auto object-cover aspect-video"
          />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 mb-6">
          <p className="text-gray-300 text-lg leading-relaxed font-serif">
            {scene.sceneDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scene.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onChoice(choice)}
              disabled={disabled}
              className="px-6 py-4 bg-gray-700 text-white font-semibold rounded-lg border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 text-left"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
