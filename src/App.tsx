/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BackdropCanvas from './components/BackdropCanvas';
import IntroScreen from './components/IntroScreen';
import CoffeeSelection from './components/CoffeeSelection';
import BrewingRitual from './components/BrewingRitual';
import ResultScreen from './components/ResultScreen';
import { CoffeeMenu, SceneState } from './types';
import { audioSystem } from './utils/audioSystem';

export default function App() {
  const [scene, setScene] = useState<SceneState>('INTRO');
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeMenu | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [gender, setGender] = useState<'male' | 'female' | 'unspecified' | null>(null);

  // Read theme from local storage or set initial state
  useEffect(() => {
    const savedTheme = localStorage.getItem('coffee-oracle-theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('coffee-oracle-theme', nextTheme);
    audioSystem.playTink();
  };

  const handleStartSelection = (selectedGender: 'male' | 'female' | 'unspecified') => {
    setGender(selectedGender);
    setScene('SELECTION');
  };

  const handleSelectCoffee = (coffee: CoffeeMenu) => {
    setSelectedCoffee(coffee);
    setScene('BREWING');
  };

  const handleBrewingComplete = () => {
    setScene('RESULT');
  };

  const handleRestart = () => {
    audioSystem.playChime();
    setSelectedCoffee(null);
    setScene('SELECTION');
  };

  const handleBackToIntro = () => {
    audioSystem.playTink();
    setScene('INTRO');
  };

  // Get dynamic background aura glow based on current selection
  const getDynamicGlow = () => {
    if (scene === 'RESULT' && selectedCoffee) {
      // Return custom RGB values for the active coffee layout
      return selectedCoffee.id === 'latte' ? '236, 217, 204' :
             selectedCoffee.id === 'mocha' ? '227, 193, 93' :
             selectedCoffee.id === 'caramel' ? '244, 223, 167' :
             selectedCoffee.id === 'dirty' ? '170, 134, 42' :
             '212, 175, 55';
    }
    return undefined;
  };

  return (
    <div className={`min-h-screen text-cream-100 font-sans transition-colors duration-500 overflow-x-hidden relative ${
      theme === 'dark' ? 'bg-[#160B08] text-cream-100' : 'bg-[#FAF6F1] text-cream-950'
    }`}>
      
      {/* 1. Fluid Particle Backdrop Drawing Panel */}
      <BackdropCanvas 
        isResultScene={scene === 'RESULT'} 
        glowColor={getDynamicGlow()} 
      />

      {/* 2. Page Router Transition Canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full flex flex-col items-center justify-center min-h-screen relative z-10"
        >
          {scene === 'INTRO' && (
            <IntroScreen
              onStart={handleStartSelection}
              theme={theme}
              toggleTheme={handleToggleTheme}
              soundPlaying={soundPlaying}
              setSoundPlaying={setSoundPlaying}
            />
          )}

          {scene === 'SELECTION' && (
            <CoffeeSelection
              onSelect={handleSelectCoffee}
              onBack={handleBackToIntro}
              theme={theme}
            />
          )}

          {scene === 'BREWING' && selectedCoffee && (
            <BrewingRitual
              selectedCoffee={selectedCoffee}
              onComplete={handleBrewingComplete}
              theme={theme}
            />
          )}

          {scene === 'RESULT' && selectedCoffee && (
            <ResultScreen
              selectedCoffee={selectedCoffee}
              onRestart={handleRestart}
              theme={theme}
              gender={gender}
            />
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}

