
import React, { useState, useCallback } from 'react';
import type { GameState, StoryStep } from './types';
import { generateInitialScene, generateNextScene } from './services/geminiService';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import LoadingIndicator from './components/LoadingIndicator';

function App() {
  const [gameState, setGameState] = useState<GameState>('not_started');
  const [storyHistory, setStoryHistory] = useState<StoryStep[]>([]);
  const [currentScene, setCurrentScene] = useState<StoryStep | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartGame = useCallback(async (theme: string) => {
    setGameState('loading');
    setError(null);
    setStoryHistory([]);
    try {
      const initialScene = await generateInitialScene(theme);
      setCurrentScene(initialScene);
      setStoryHistory([initialScene]);
      setGameState('playing');
    } catch (err) {
      console.error(err);
      setError('The ancient spirits are slumbering. Failed to start the adventure. Please try again.');
      setGameState('error');
    }
  }, []);

  const handleMakeChoice = useCallback(async (choice: string) => {
    setGameState('loading');
    setError(null);

    const previousHistory = [...storyHistory];
    
    try {
      const nextScene = await generateNextScene(previousHistory, choice);
      setCurrentScene(nextScene);
      setStoryHistory(prev => [...prev, nextScene]);
      setGameState('playing');
    } catch (err) {
      console.error(err);
      setError('A mysterious fog has rolled in, obscuring the path forward. Please try making a choice again.');
      setGameState('playing'); // Revert to playing to allow another choice
    }
  }, [storyHistory]);

  const handleRestart = () => {
    setGameState('not_started');
    setCurrentScene(null);
    setStoryHistory([]);
    setError(null);
  };

  const renderContent = () => {
    switch (gameState) {
      case 'not_started':
        return <StartScreen onStart={handleStartGame} />;
      case 'loading':
        return (
          <>
            <GameScreen scene={currentScene} onChoice={handleMakeChoice} disabled={true} />
            <LoadingIndicator />
          </>
        );
      case 'playing':
        return <GameScreen scene={currentScene} onChoice={handleMakeChoice} disabled={false} />;
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-screen text-center p-4">
            <h2 className="text-2xl font-medieval text-red-400 mb-4">An Error Occurred</h2>
            <p className="text-gray-300 mb-8 max-w-md">{error}</p>
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors duration-300 shadow-lg"
            >
              Start a New Adventure
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 antialiased">
      <main className="container mx-auto p-4">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
