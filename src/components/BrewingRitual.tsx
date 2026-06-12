/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { CoffeeMenu } from '../types';
import { audioSystem } from '../utils/audioSystem';

interface BrewingRitualProps {
  selectedCoffee: CoffeeMenu;
  onComplete: () => void;
  theme: 'dark' | 'light';
}

const ritualSteps = [
  'กำลังบดเมล็ดกาแฟ ค้นหาจุดสมดุลแห่งจิตใต้สำนึก...',
  'เตรียมน้ำอุ่นอุณหภูมิ 92°C บำบัดสติปัญญา...',
  'หยดสกัดของเหลวแห่งความปรารถนาทีละหยาดหยด...',
  'ผสานไอควันพยากรณ์และฟองนุ่มละมุนโอบอุ้มจิตใจ...',
  'เสร็จสิ้นพิธีกรรม... โปรดสดับฟังสิ่งที่หัวใจคุณเพรียกหา'
];

export default function BrewingRitual({ selectedCoffee, onComplete, theme }: BrewingRitualProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Play the pour sound immediately
    audioSystem.playPour();

    // Increment progress and step indices
    const totalDuration = 3600; // 3.6 seconds total
    const intervalTime = 40;
    const stepsCount = ritualSteps.length;
    
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (totalDuration / intervalTime));
        return next >= 100 ? 100 : next;
      });
    }, intervalTime);

    const stepInterval = totalDuration / stepsCount;
    const stepTimer = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < stepsCount - 1) {
          audioSystem.playTink();
          return prev + 1;
        }
        return prev;
      });
    }, stepInterval);

    // Complete action
    const completionTimeout = setTimeout(() => {
      onComplete();
    }, totalDuration + 200);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      clearTimeout(completionTimeout);
    };
  }, [onComplete]);

  return (
    <div className="w-full min-h-screen px-4 flex flex-col items-center justify-center z-10 text-center select-none relative overflow-hidden">
      
      {/* Background Magic Circle Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="border border-gold-500/20 rounded-full w-96 h-96 animate-spin-slow"></div>
        <div className="absolute border border-dashed border-gold-400/10 rounded-full w-[28rem] h-[28rem] animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>

      <div className="max-w-md w-full flex flex-col items-center justify-center relative">
        
        {/* Breathing Orbs and drip illustration */}
        <div className="relative mb-8 w-48 h-48 flex items-center justify-center">
          
          {/* Pulsating energy ring */}
          <div 
            className="absolute inset-0 rounded-full blur-xl animate-pulse"
            style={{ 
              backgroundColor: selectedCoffee.colorTheme.glow || 'rgba(212, 175, 55, 0.4)',
              animationDuration: '1.5s'
            }}
          />

          {/* Drip container */}
          <div className="relative z-10">
            <svg viewBox="0 0 100 100" className="w-28 h-28">
              {/* Dripping coffee filter */}
              <path d="M20,20 L50,65 L80,20 Z" fill="none" stroke="#d4af37" strokeWidth="2.5" />
              <line x1="30" y1="20" x2="70" y2="20" stroke="#d4af37" strokeWidth="4" />
              
              {/* Drip Droplet */}
              <motion.path
                d="M50,62 C48,62 46,65 46,68 C46,72 50,75 50,75 C50,75 54,72 54,68 C54,65 52,62 50,62 Z"
                fill="#2a140e"
                animate={{
                  y: [0, 25, 0],
                  scaleY: [1.2, 1.8, 1],
                  opacity: [1, 0.8, 0]
                }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />

              {/* Coffee ripples inside cup below */}
              <rect x="35" y="88" width="30" height="2" rx="1" fill="#d4af37" />
              <path d="M40,88 C40,88 45,86 50,86 C55,86 60,88 60,88" fill="none" stroke="#2a140e" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Selected Coffee Subtitle */}
        <div className="mb-4">
          <span className="font-sans font-medium text-[11px] uppercase tracking-[0.2em] text-gold-500 bg-gold-500/10 border border-gold-500/20 px-3 py-1 rounded-full animate-pulse">
            กำลังปรุง {selectedCoffee.nameTh} ({selectedCoffee.nameEn})
          </span>
        </div>

        {/* Informative Changing Ceremony Steps */}
        <div className="h-20 flex items-center justify-center px-4 mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStepIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="font-sans text-base md:text-lg text-cream-100 font-light drop-shadow-md"
            >
              {ritualSteps[currentStepIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Premium Progress Bar */}
        <div className="w-64 bg-black/30 backdrop-blur-md rounded-full h-2 border border-gold-500/20 overflow-hidden relative p-[1px]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        {/* Particle sparkles list */}
        <div className="absolute -top-10 left-10 space-y-4">
          <Sparkles className="w-4.5 h-4.5 text-gold-400/40 animate-pulse" />
        </div>
        <div className="absolute top-40 right-10 flex space-x-2">
          <Sparkles className="w-3 h-3 text-gold-300/30 animate-pulse" />
        </div>

      </div>
    </div>
  );
}
