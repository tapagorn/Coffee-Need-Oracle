/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Coffee, Play, Volume2, VolumeX, Sun, Moon, Sparkles } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface IntroScreenProps {
  onStart: (gender: 'male' | 'female' | 'unspecified') => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  soundPlaying: boolean;
  setSoundPlaying: (play: boolean) => void;
}

export default function IntroScreen({
  onStart,
  theme,
  toggleTheme,
  soundPlaying,
  setSoundPlaying,
}: IntroScreenProps) {
  const [typedTitle, setTypedTitle] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'unspecified' | null>(null);

  // Typewriter effect for "กาแฟบอกใจ"
  useEffect(() => {
    const fullText = 'กาแฟบอกใจ';
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx <= fullText.length) {
        setTypedTitle(fullText.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
        setShowButton(true);
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  const handleStartWithSound = () => {
    if (!selectedGender) return;
    // Play sound and trigger state transition
    audioSystem.playPour();
    onStart(selectedGender);
  };

  const handleToggleSound = () => {
    const state = audioSystem.toggleAmbient();
    setSoundPlaying(state);
    if (state) {
      audioSystem.playTink();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden text-center">
      {/* Floating Header Controls */}
      <div className="w-full max-w-4xl flex justify-between items-center z-10 transition-colors duration-500">
        <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-500/20">
          <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
          <span className="font-serif text-xs uppercase tracking-widest text-gold-500 font-semibold">
            Coffee Need Oracle
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sounds Toggle */}
          <button
            onClick={handleToggleSound}
            id="toggle-sound-btn"
            className={`p-2.5 rounded-full transition-all duration-300 ${
              soundPlaying
                ? 'bg-gold-500/30 text-gold-300 oracle-pulse border border-gold-500/50'
                : 'bg-black/30 text-cream-500 hover:text-white border border-transparent'
            }`}
            title="เปิด/ปิด เสียงร้านกาแฟ"
          >
            {soundPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            id="toggle-theme-btn"
            className="p-2.5 rounded-full bg-black/30 hover:bg-black/50 text-gold-500 hover:text-gold-300 border border-gold-500/20 transition-all duration-300"
            title={theme === 'dark' ? 'เปลี่ยนเป็นธีม คาราเมลไลท์' : 'เปลี่ยนเป็นธีม เอสเพรซโซ่ดาร์ก'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Coffee Steam and Oracle Logo */}
      <div className="my-auto py-10 flex flex-col items-center justify-center relative max-w-lg z-10">
        
        {/* Steam Ring and Floating Cup Visual */}
        <div className="relative mb-8 group cursor-pointer">
          {/* Outer glowing aura */}
          <div className="absolute inset-x-0 -inset-y-6 w-56 h-56 mx-auto bg-gold-500/10 rounded-full blur-[40px] animate-pulse-slow"></div>
          
          {/* Mystical rings */}
          <div className="absolute inset-0 border-2 border-dashed border-gold-500/20 rounded-full w-56 h-56 mx-auto animate-spin-slow"></div>
          <div className="absolute inset-4 border border-cream-500/10 rounded-full w-48 h-48 mx-auto animate-[spin_15s_linear_infinite_reverse]"></div>

          {/* Cup container */}
          <div className="relative w-52 h-52 mx-auto flex items-center justify-center animate-float">
            
            {/* Animated SVG Cup */}
            <svg viewBox="0 0 100 100" className="w-36 h-36 drop-shadow-[0_10px_30px_rgba(212,175,55,0.4)]">
              {/* Floating Coffee Steam paths with keyframe sway */}
              <path
                d="M38,22 Q43,10 39,2 Q35,10 40,22 Z"
                className="fill-cream-300/45 animate-pulse"
                style={{ transformOrigin: '40px 22px', animationDuration: '3s' }}
              />
              <path
                d="M50,25 Q56,12 48,2 Q42,12 49,25 Z"
                className="fill-cream-400/60 animate-pulse"
                style={{ transformOrigin: '50px 25px', animationDuration: '4s', animationDelay: '1s' }}
              />
              <path
                d="M62,22 Q58,10 64,2 Q68,10 61,22 Z"
                className="fill-cream-300/45 animate-pulse"
                style={{ transformOrigin: '62px 22px', animationDuration: '3.5s', animationDelay: '0.5s' }}
              />

              {/* Coffee Cup Body */}
              <path
                d="M20,35 C20,35 25,75 50,75 C75,75 80,35 80,35 Z"
                fill={theme === 'dark' ? '#2A140E' : '#FAF6F1'}
                stroke={theme === 'dark' ? '#D4AF37' : '#8E6F57'}
                strokeWidth="2.5"
              />

              {/* Gold Ornament/Emblem on cup */}
              <circle cx="50" cy="53" r="8" fill="transparent" stroke="#D4AF37" strokeWidth="1.5" />
              <polygon points="50,49 53,55 47,55" fill="#D4AF37" />

              {/* Cup Handle */}
              <path
                d="M80,42 C88,42 90,52 80,56"
                fill="transparent"
                stroke={theme === 'dark' ? '#D4AF37' : '#8E6F57'}
                strokeWidth="2.5"
              />

              {/* Cup Saucer */}
              <path
                d="M10,75 C10,75 25,82 50,82 C75,82 90,75 90,75 C90,75 80,86 50,86 C20,86 10,75 10,75 Z"
                fill={theme === 'dark' ? '#3C2016' : '#E2D7CC'}
                stroke={theme === 'dark' ? '#D4AF37' : '#8E6F57'}
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Dynamic Typography and Slogans */}
        <h1 className="font-serif text-5xl md:text-6xl font-black text-gold-500 mb-3 tracking-wide drop-shadow-md flex items-center justify-center">
          {typedTitle}
          <span className="w-1.5 h-10 ml-1 bg-gold-400 animate-pulse inline-block" />
        </h1>

        <p className="text-sm font-mono tracking-widest text-cream-400/90 uppercase mb-8">
          - Coffee Need Oracle -
        </p>

        <p className="font-sans text-lg md:text-xl text-cream-100 font-light max-w-md mx-auto leading-relaxed mb-10 px-4">
          สายลมพัดกลิ่นหอมกรุ่น... ให้จิตใต้สำนึกของคุณเลือกเมนู
          <br />
          <span className="text-gold-300 font-medium font-serif italic">“วันนี้ใจคุณกำลังเรียกกร้องส่งสัญญาณอะไร?”</span>
        </p>

        {/* Gender Selection */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`w-full max-w-sm mx-auto mb-8 px-5 py-4 rounded-2xl border transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-black/25 border-gold-500/10 backdrop-blur-md'
                : 'bg-white/40 border-cream-300/60 backdrop-blur-md shadow-sm'
            }`}
          >
            <p className={`font-sans text-xs tracking-widest mb-3 font-semibold ${
              theme === 'dark' ? 'text-gold-400' : 'text-coffee-600'
            }`}>
              — เลือกเพศของคุณเพื่อเริ่มเกม —
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'male', label: 'ชาย' },
                { id: 'female', label: 'หญิง' },
                { id: 'unspecified', label: 'ไม่ระบุ' }
              ].map((item) => {
                const isActive = selectedGender === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedGender(item.id as any);
                      audioSystem.playTink();
                    }}
                    id={`gender-select-${item.id}`}
                    type="button"
                    className={`py-2 px-1 rounded-lg font-sans text-sm font-medium transition-all duration-300 border cursor-pointer focus:outline-none ${
                      isActive
                        ? 'bg-gold-500 text-coffee-950 border-gold-400 font-bold shadow-md shadow-gold-500/20'
                        : theme === 'dark'
                          ? 'bg-coffee-950/40 hover:bg-coffee-900/40 text-cream-300 border-coffee-800/60 hover:border-gold-500/20'
                          : 'bg-cream-50/60 hover:bg-cream-100/80 text-coffee-900 border-cream-300 hover:border-gold-500/20'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Start Ritual button */}
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={handleStartWithSound}
            disabled={!selectedGender}
            id="start-ritual-btn"
            className={`group relative px-8 py-4 font-sans tracking-wide font-semibold text-lg rounded-xl shadow-2xl transition-all duration-300 overflow-hidden border ${
              selectedGender
                ? 'bg-gradient-to-r from-coffee-700 via-coffee-600 to-coffee-800 hover:from-gold-600 hover:to-gold-700 text-cream-50 border-gold-500/50 cursor-pointer active:scale-98'
                : 'bg-cream-300/10 text-cream-400/40 border-cream-300/10 cursor-not-allowed opacity-50'
            }`}
          >
            {selectedGender && (
              /* Ripple backgrounds */
              <span className="absolute inset-0 bg-white/10 scale-0 rounded-xl group-hover:scale-100 transition-transform duration-700 origin-center pointer-events-none"></span>
            )}
            
            <span className="flex items-center justify-center space-x-3 relative z-10">
              <Play className={`w-5 h-5 fill-current ${selectedGender ? 'text-gold-300 group-hover:text-white' : 'text-cream-400/20'}`} />
              <span>{selectedGender ? 'เริ่มเกม' : 'โปรดเลือกเพศก่อนเริ่มเกม'}</span>
            </span>
          </motion.button>
        )}
      </div>

      {/* Decorative Warm Footer */}
      <div className="z-10 mt-auto">
        <p className="text-xs text-cream-600/70 font-light font-sans">
          เกมนี้จัดทำขึ้นเพื่อความบันเทิงเท่านั้น (For Entertainment Purposes Only)
          ผลลัพธ์เป็นการตีความเชิงสัญลักษณ์ ไม่สามารถใช้วินิจฉัยบุคลิกภาพจริงตามหลักวิทยาศาสตร์ได้
        </p>
      </div>
    </div>
  );
}
