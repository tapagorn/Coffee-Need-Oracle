/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';
import { CoffeeMenu } from '../types';
import { coffeeMenus } from '../data/coffeeData';
import { audioSystem } from '../utils/audioSystem';

interface CoffeeSelectionProps {
  onSelect: (coffee: CoffeeMenu) => void;
  onBack: () => void;
  theme: 'dark' | 'light';
}

// Inline custom SVG rendering of the precise receipt to guarantee beautiful, crispy graphics
export const CoffeeSVG = ({ id, active = false }: { id: string; active?: boolean }) => {
  const tiltClass = active ? 'scale-110 rotate-1' : 'group-hover:scale-105 group-hover:-rotate-1';
  
  switch (id) {
    case 'americano':
      return (
        <svg viewBox="0 0 100 100" className={`w-24 h-24 transition-transform duration-300 ${tiltClass}`}>
          {/* Americano: Sleek dark transparent coffee, black cup */}
          <ellipse cx="50" cy="80" rx="25" ry="8" fill="#110907" opacity="0.3" />
          <path d="M25,40 C25,40 28,78 50,78 C72,78 75,40 75,40 Z" fill="#20100a" stroke="#d4af37" strokeWidth="1.5" />
          <ellipse cx="50" cy="40" rx="25" ry="6" fill="#150805" stroke="#d4af37" strokeWidth="1" />
          <ellipse cx="50" cy="40" rx="21" ry="4" fill="#321a12" /> {/* liquid top */}
        </svg>
      );
    case 'espresso':
      return (
        <svg viewBox="0 0 100 100" className={`w-24 h-24 transition-transform duration-300 ${tiltClass}`}>
          {/* Espresso: Tiny classy espresso cup, dark crema */}
          <ellipse cx="50" cy="82" rx="20" ry="6" fill="#110907" opacity="0.4" />
          <path d="M30,48 C30,48 33,80 50,80 C67,80 70,48 70,48 Z" fill="#ffffff" stroke="#c59e35" strokeWidth="1.5" />
          <ellipse cx="50" cy="48" rx="20" ry="5" fill="#fcfbf7" stroke="#c59e35" strokeWidth="1" />
          <ellipse cx="50" cy="48" rx="17" ry="3.5" fill="#582d18" /> {/* crema */}
          {/* Crema swirl */}
          <path d="M42,47 C46,46 54,49 58,47.5" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.8" />
          <path d="M70,55 C76,55 77,65 70,68" fill="none" stroke="#ffffff" strokeWidth="1.5" /> {/* scale cup handle */}
        </svg>
      );
    case 'latte':
      return (
        <svg viewBox="0 0 100 100" className={`w-24 h-24 transition-transform duration-300 ${tiltClass}`}>
          {/* Latte: Latte Art Heart on foam */}
          <ellipse cx="50" cy="80" rx="26" ry="7" fill="#110907" opacity="0.3" />
          <path d="M24,36 C24,36 28,76 50,76 C72,76 76,36 76,36 Z" fill="#fdfcf7" stroke="#8e6f57" strokeWidth="1.5" />
          <ellipse cx="50" cy="36" rx="26" ry="6.5" fill="#8e6f57" stroke="#8e6f57" strokeWidth="1" />
          <ellipse cx="50" cy="35" rx="24" ry="5.5" fill="#d2af94" /> {/* coffee milk mixture */}
          {/* Milk foam heart */}
          <path d="M50,37 C46,33 42,35 50,39 C58,35 54,33 50,37 Z" fill="#fdfbf7" />
        </svg>
      );
    case 'cappuccino':
      return (
        <svg viewBox="0 0 100 100" className={`w-24 h-24 transition-transform duration-300 ${tiltClass}`}>
          {/* Cappuccino: Thick, fluffy, textured milk foam piled above rim, sprinkled cocoa */}
          <ellipse cx="50" cy="80" rx="26" ry="6" fill="#110907" opacity="0.3" />
          <path d="M22,38 C22,38 26,76 50,76 C74,76 78,38 78,38 Z" fill="#ebd3c8" stroke="#a88062" strokeWidth="1.5" />
          <ellipse cx="50" cy="38" rx="28" ry="6" fill="#ebd3c8" />
          {/* Fluffy foam cloud dome popping up */}
          <path d="M24,38 Q34,32 50,32 Q66,32 76,38" fill="#fcfbf7" opacity="0.9" />
          <ellipse cx="50" cy="35" rx="20" ry="4" fill="#faf9f5" />
          {/* Cinnamon sprinkles */}
          <circle cx="42" cy="34" r="1" fill="#754637" />
          <circle cx="48" cy="36" r="0.8" fill="#754637" />
          <circle cx="56" cy="33" r="1.2" fill="#754637" />
          <circle cx="51" cy="35" r="0.9" fill="#754637" />
          <circle cx="46" cy="33" r="1" fill="#754637" />
        </svg>
      );
    case 'mocha':
      return (
        <svg viewBox="0 0 100 100" className={`w-24 h-24 transition-transform duration-300 ${tiltClass}`}>
          {/* Mocha: Cocoa gradient, whipped cream, chocolate syrup */}
          <ellipse cx="50" cy="80" rx="24" ry="6" fill="#110907" opacity="0.3" />
          <path d="M26,35 C26,35 30,75 50,75 C70,75 74,35 74,35 Z" fill="#4a2e20" stroke="#d4af37" strokeWidth="1.5" />
          <ellipse cx="50" cy="35" rx="24" ry="5.5" fill="#32190e" />
          {/* Cream swirl */}
          <path d="M35,35 Q44,25 50,28 Q56,23 65,34" stroke="#fefdfa" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="48" cy="27" r="2" fill="#fefdfa" />
          {/* Syrup drip lines */}
          <path d="M30,36 C35,39 42,39 45,36" stroke="#1d1009" strokeWidth="1" fill="none" />
          <path d="M52,36 C58,38 64,38 68,36" stroke="#1d1009" strokeWidth="1" fill="none" />
        </svg>
      );
    case 'caramel':
      return (
        <svg viewBox="0 0 100 100" className={`w-24 h-24 transition-transform duration-300 ${tiltClass}`}>
          {/* Caramel Macchiato: Layered glass cup with crossgrid caramel drizzles */}
          <ellipse cx="50" cy="84" rx="22" ry="5" fill="#110907" opacity="0.3" />
          {/* Glass cup */}
          <path d="M28,30 Q30,76 50,78 Q70,76 72,30 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          {/* Layers: bottom milk, middle espresso, top vanilla foam */}
          <path d="M32,58 Q50,60 68,58 Q69,67 50,68 Q31,67 32,58 Z" fill="#faeed0" opacity="0.9" /> {/* milk bottom */}
          <path d="M30,42 Q50,44 70,42 L68,58 Q50,60 32,58 Z" fill="#6e4130" /> {/* espresso middle */}
          <path d="M28,30 Q50,32 72,30 L70,42 Q50,44 30,42 Z" fill="#faf6f1" opacity="0.95" /> {/* thick foam top */}
          
          {/* Crossgrid Caramel drizzle lines */}
          <path d="M36,31 L64,31 M38,34 L62,34 M42,37 L58,37" stroke="#d4af37" strokeWidth="1.5" />
          <path d="M42,30 L46,38 M48,30 L52,38 M54,30 L58,38" stroke="#d4af37" strokeWidth="1.2" />
        </svg>
      );
    case 'flatwhite':
      return (
        <svg viewBox="0 0 100 100" className={`w-24 h-24 transition-transform duration-300 ${tiltClass}`}>
          {/* Flat White: Sleek horizontal microfoam surface, classy sage/grey cup */}
          <ellipse cx="50" cy="78" rx="27" ry="6" fill="#110907" opacity="0.3" />
          <path d="M22,36 C22,36 26,76 50,76 C74,76 78,36 78,36 Z" fill="#6d5e52" stroke="#e2d7cc" strokeWidth="1.5" />
          <ellipse cx="50" cy="36" rx="28" ry="6" fill="#e2d7cc" stroke="#e2d7cc" strokeWidth="1" />
          <ellipse cx="50" cy="35.5" rx="26" ry="5" fill="#f5efe8" />
          {/* Subtle brown ring showing perfect crema integration */}
          <ellipse cx="50" cy="35.5" rx="25" ry="4.5" fill="none" stroke="#aa7360" strokeWidth="1.5" opacity="0.75" />
        </svg>
      );
    case 'affogato':
      return (
        <svg viewBox="0 0 100 100" className={`w-24 h-24 transition-transform duration-300 ${tiltClass}`}>
          {/* Affogato: Ice cream scoop sitting in espresso bath inside glass */}
          <ellipse cx="50" cy="82" rx="24" ry="5" fill="#110907" opacity="0.3" />
          <path d="M28,38 Q30,74 50,76 Q70,74 72,38 Z" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <ellipse cx="50" cy="38" rx="22" ry="5" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          
          {/* Espresso bath at the bottom */}
          <path d="M32,54 Q50,56 68,54 L69,70 Q50,74 31,70 Z" fill="#1f110b" />
          
          {/* Vanila Ice cream glob */}
          <circle cx="50" cy="52" r="14" fill="#faf2dd" stroke="#e2d7cc" strokeWidth="0.5" />
          {/* Drowning espresso sauce streams on icecream */}
          <path d="M42,42 C45,46 47,56 46,60 M52,39 C54,44 56,52 54,62" stroke="#32190e" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'dirty':
      return (
        <svg viewBox="0 0 100 100" className={`w-24 h-24 transition-transform duration-300 ${tiltClass}`}>
          {/* Dirty: Bleeding espresso patterns bleeding down into ice-cold milk */}
          <ellipse cx="50" cy="85" rx="22" ry="5" fill="#110907" opacity="0.3" />
          <path d="M28,28 L32,78 Q50,82 68,78 L72,28 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          
          {/* Ice cold white milk (bottom layer) */}
          <path d="M31,45 L32,78 Q50,82 68,78 L69,45 Q50,47 31,45 Z" fill="#fafbfd" />
          
          {/* Hot Espresso bleeding streams (dripping downwards) */}
          <path d="M28,28 Q50,30 72,28 L71,45 Q50,47 29,45 Z" fill="#1a0d0a" />
          <path d="M34,44 Q36,65 38,55 Q42,44 44,60 M52,44 Q54,72 58,45 Q62,44 64,58" fill="none" stroke="#2a140e" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'frappe':
      return (
        <svg viewBox="0 0 100 100" className={`w-24 h-24 transition-transform duration-300 ${tiltClass}`}>
          {/* Frappe: Tall cup, ice sludge, mountainous whipped cream, caramel drizzle */}
          <ellipse cx="50" cy="88" rx="20" ry="4" fill="#110907" opacity="0.3" />
          {/* Tall Cup */}
          <path d="M30,22 L35,82 Q50,85 65,82 L70,22 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          
          {/* Ice caramel sludge filling */}
          <path d="M30.5,26 L35,78 Q50,81 65,78 L69.5,26 Z" fill="#b47f6d" />
          {/* Mountain of whipped cream */}
          <path d="M28,26 Q50,10 72,26" fill="#fefefc" />
          <ellipse cx="50" cy="18" rx="16" ry="6" fill="#fcf9f2" />
          
          {/* Caramel Drizzle swirls on cream */}
          <path d="M40,14 C44,18 56,12 60,22" stroke="#d4af37" strokeWidth="1.8" fill="none" />
          {/* Green Straw */}
          <line x1="45" y1="2" x2="35" y2="30" stroke="#75b342" strokeWidth="3" />
        </svg>
      );
    default:
      return null;
  }
};

export default function CoffeeSelection({ onSelect, onBack, theme }: CoffeeSelectionProps) {
  const [intuitionRunning, setIntuitionRunning] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState<number | null>(null);

  // Intuition Blind Pick algorithm
  const startIntuitionPick = () => {
    if (intuitionRunning) return;
    setIntuitionRunning(true);
    audioSystem.playChime();

    let speed = 40; // Initial delay in ms
    let iterations = 0;
    let currentIdx = 0;

    const tick = () => {
      // Highlight a pseudo-random option sequence for suspense
      currentIdx = Math.floor(Math.random() * coffeeMenus.length);
      setHighlightedIdx(currentIdx);
      audioSystem.playTink();

      iterations++;
      if (iterations < 28) {
        // Increment delay to simulate decelleration
        speed += Math.floor(iterations * 0.8);
        setTimeout(tick, speed);
      } else {
        // Complete the selection
        setTimeout(() => {
          const finalSelect = coffeeMenus[currentIdx];
          audioSystem.playPour();
          onSelect(finalSelect);
          setIntuitionRunning(false);
          setHighlightedIdx(null);
        }, 800);
      }
    };

    setTimeout(tick, speed);
  };

  const handleCardClick = (coffee: CoffeeMenu) => {
    if (intuitionRunning) return;
    audioSystem.playPour();
    onSelect(coffee);
  };

  return (
    <div className="w-full min-h-screen px-4 py-8 md:py-12 z-10 flex flex-col items-center">
      
      {/* Floating navigation bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          id="selection-back-btn"
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm border border-gold-500/10 hover:border-gold-500/40 text-cream-200 hover:text-white transition-all cursor-pointer text-sm"
        >
          <ArrowLeft className="w-4 h-4 text-gold-500" />
          <span>ย้อนกลับ</span>
        </button>

        <div className="text-right">
          <p className="font-serif text-gold-500 text-xs tracking-widest uppercase font-semibold">
            Choose your intuitive brew
          </p>
        </div>
      </div>

      {/* Main heading */}
      <div className="text-center mb-8 max-w-xl">
        <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-gold-500 mb-3 drop-shadow-sm">
          เลือกกาแฟแก้วโปรดของคุณ
        </h2>
        <p className="font-sans text-sm md:text-base text-cream-200 font-light px-2">
          ปล่อยให้สมาธิชี้นำ คัดสรรจากรูปลักษณ์และส่วนผสมที่ "ดึงดูดสายตา" คุณในวินาทีนี้มากที่สุด...
        </p>
      </div>

      {/* Grid of 10 Coffee Menus */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5 w-full max-w-5xl mb-10">
        {coffeeMenus.map((coffee, idx) => {
          const isHighlighted = highlightedIdx === idx;
          return (
            <motion.div
              layoutId={`card-container-${coffee.id}`}
              key={coffee.id}
              onClick={() => handleCardClick(coffee)}
              id={`coffee-card-${coffee.id}`}
              className={`group flex flex-col items-center justify-between p-4 rounded-2xl cursor-pointer shadow-xl transition-all duration-300 relative border overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-coffee-950/40 hover:bg-coffee-900/60' 
                  : 'bg-cream-100/35 hover:bg-cream-200/50'
              } ${
                isHighlighted
                  ? 'border-gold-400 bg-gold-500/20 scale-105 shadow-gold-500/30'
                  : theme === 'dark'
                    ? 'border-coffee-800/60 hover:border-gold-500/40'
                    : 'border-cream-300 hover:border-gold-500/40'
              }`}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card visual highlight ring */}
              <AnimatePresence>
                {isHighlighted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 border-2 border-gold-400 rounded-2xl pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Coffee SVG Illustration */}
              <div className="h-28 flex items-center justify-center mb-2">
                <CoffeeSVG id={coffee.id} active={isHighlighted} />
              </div>

              {/* Title & Slogan */}
              <div className="text-center w-full mt-2">
                <h3 className="font-serif font-bold text-base text-gold-500 group-hover:text-gold-300 transition-colors">
                  {coffee.nameTh}
                </h3>
                <p className="font-sans text-[11px] text-cream-400 font-mono tracking-wide">
                  {coffee.nameEn}
                </p>
                <div className={`h-[1px] w-8 mx-auto my-1.5 ${theme === 'dark' ? 'bg-coffee-800' : 'bg-cream-400'}`}></div>
                <p className={`font-sans text-[10px] line-clamp-2 leading-tight ${theme === 'dark' ? 'text-cream-400' : 'text-cream-700'}`}>
                  {coffee.shortDesc}
                </p>
              </div>

              {/* Bottom Subtle Overlay */}
              <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Intuition Blind Pick Button */}
      <div className="w-full flex flex-col items-center justify-center max-w-md bg-black/25 backdrop-blur-md px-6 py-5 rounded-2xl border border-gold-500/25 shadow-2xl text-center z-10">
        <h4 className="font-serif font-bold text-gold-400 text-sm tracking-wide uppercase mb-1.5 flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-gold-500" />
          <span>หลับตาและปล่อยตัว</span>
        </h4>
        <p className="font-sans text-xs text-cream-300 max-w-sm leading-relaxed mb-4">
          หากรอยยิ้มพัดพาสองจิตสองใจ... ให้พลังแห่งดวงดาวและคลื่นเสียงร้านกาแฟเคี่ยวกรำสัญลักษณ์ที่หัวใจคุณต้องการแท้จริง!
        </p>

        <button
          onClick={startIntuitionPick}
          id="intuition-pick-btn"
          disabled={intuitionRunning}
          className={`px-6 py-3 w-full rounded-xl font-sans font-semibold tracking-wide text-xs uppercase flex items-center justify-center space-x-2 shadow-lg cursor-pointer border transition-all duration-300 ${
            intuitionRunning
              ? 'bg-coffee-950 border-coffee-800/80 text-cream-500 cursor-not-allowed'
              : 'bg-gold-500 hover:bg-gold-400 border-gold-300 text-coffee-950 font-bold hover:shadow-gold-500/30'
          }`}
        >
          <HelpCircle className={`w-4 h-4 ${intuitionRunning ? 'animate-bounce' : ''}`} />
          <span>{intuitionRunning ? 'กำลังสุ่มสัญชาตญาณ...' : 'สุ่มตาม INTUITION (BLIND PICK)'}</span>
        </button>
      </div>

    </div>
  );
}
