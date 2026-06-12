/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, RotateCcw, Share2, Heart, Shield, BookOpen, 
  Droplets, Zap, Target, Phone, Coffee, Smile, Calendar, 
  Gift, Sun, Gamepad2, Award, Scissors, Compass, Music, 
  EyeOff, CheckSquare, Wind, Shuffle, Ghost, Tv, 
  MessageSquare, Flame, ShieldAlert, ShieldOff, Palmtree,
  CheckCircle, ArrowDown
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { CoffeeMenu } from '../types';
import { CoffeeSVG } from './CoffeeSelection';
import { audioSystem } from '../utils/audioSystem';

interface ResultScreenProps {
  selectedCoffee: CoffeeMenu;
  onRestart: () => void;
  theme: 'dark' | 'light';
  gender?: 'male' | 'female' | 'unspecified' | null;
}

// Map strings to Lucide components for fully-safe runtime rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Shield, Droplets, Zap, Target, Heart, Phone, Coffee, Smile, 
  Calendar, Gift, Sun, Sparkles, Gamepad2, Award, Scissors, Compass, 
  Music, EyeOff, CheckSquare, Wind, Shuffle, Ghost, Tv, 
  MessageSquare, Flame, ShieldAlert, ShieldOff, Palmtree
};

function RemedyIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = iconMap[name] || Coffee;
  return <IconComponent className={className} />;
}

// วาง URL ของ Google Apps Script Web App ของคุณตรงนี้ เพื่อบันทึกข้อมูลเข้า Google Sheets แบบ Real-time
// ตัวอย่างเช่น: 'https://script.google.com/macros/s/AKfycb...YourScriptId.../exec'
export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfPL4MEpUD1KWTXiRz3Rm43OpjvQyIi3v_bwsYMg737UonA9mskrv1S_Ps8z_O65M9qQ/exec';

// Helper to get or generate unique Visitor ID
const getVisitorId = (): string => {
  let vid = localStorage.getItem('coffee_oracle_visitor_id');
  if (!vid) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let rand = '';
    for (let i = 0; i < 8; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    vid = `vid_${rand}_${Date.now().toString(36)}`;
    localStorage.setItem('coffee_oracle_visitor_id', vid);
  }
  return vid;
};

export default function ResultScreen({ selectedCoffee, onRestart, theme, gender }: ResultScreenProps) {
  const radarRef = useRef<HTMLCanvasElement | null>(null);
  const syncAttemptedRef = useRef(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const [radialAnimationFactor, setRadialAnimationFactor] = useState(0);

  // States for Google Sheet / Apps Script Sync
  const [visitorId, setVisitorId] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [appsScriptUrl, setAppsScriptUrl] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Sync function to Apps Script Web App
  const syncToGoogleSheets = async (url: string, vid: string, ua: string) => {
    if (!url) return;
    setSyncStatus('sending');
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        coffeeId: selectedCoffee.id,
        coffeeName: selectedCoffee.nameTh,
        coffeeNameEn: selectedCoffee.nameEn,
        gender: gender || 'unspecified',
        visitorId: vid,
        userAgent: ua,
        whatHeartWants: selectedCoffee.whatHeartWants
      };

      await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // standard cross-origin
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      setSyncStatus('success');
    } catch (e) {
      console.error('Apps Script Sync Error:', e);
      setSyncStatus('error');
    }
  };

  // Tracking initialization
  useEffect(() => {
    const vid = getVisitorId();
    setVisitorId(vid);
    setUserAgent(navigator.userAgent);

    const metaEnv = (import.meta as any).env;
    const envUrl = (metaEnv && metaEnv.VITE_APPS_SCRIPT_URL) || '';
    const localUrl = localStorage.getItem('coffee_oracle_apps_script_url') || '';
    const savedUrl = GOOGLE_APPS_SCRIPT_URL || envUrl || localUrl;
    setAppsScriptUrl(savedUrl);

    if (savedUrl && !syncAttemptedRef.current) {
      syncAttemptedRef.current = true;
      syncToGoogleSheets(savedUrl, vid, navigator.userAgent);
    }
  }, [selectedCoffee, gender]);

  // Trigger reveal sounds
  useEffect(() => {
    audioSystem.playChime();
    
    // Animate the radar chart filled region growing outward
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2s growth speed

    const animateRadar = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      setRadialAnimationFactor(progress);

      if (progress < 1) {
        requestAnimationFrame(animateRadar);
      }
    };

    requestAnimationFrame(animateRadar);
  }, [selectedCoffee]);

  // Render the Canvas Radar Chart
  useEffect(() => {
    const canvas = radarRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 320;
    canvas.width = size;
    canvas.height = size;

    const center = size / 2;
    const radius = 100;
    
    // Core stats based on coffee metadata
    const stats = [
      { key: 'พลังงาน (Energy)', value: selectedCoffee.radarStats.energy },
      { key: 'ความสงบ (Calm)', value: selectedCoffee.radarStats.calm },
      { key: 'สมาธิ (Focus)', value: selectedCoffee.radarStats.focus },
      { key: 'จินตนาการ (Creative)', value: selectedCoffee.radarStats.creativity },
      { key: 'ความสบาย (Comfort)', value: selectedCoffee.radarStats.comfort },
    ];

    const totalPoints = stats.length;
    const angleStep = (Math.PI * 2) / totalPoints;

    ctx.clearRect(0, 0, size, size);

    // Draw grid rings (100%, 66%, 33%)
    const ringLevels = [1, 0.66, 0.33];
    ctx.lineWidth = 1;
    
    ringLevels.forEach((level) => {
      ctx.strokeStyle = theme === 'dark' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(142, 111, 87, 0.25)';
      ctx.beginPath();
      for (let i = 0; i < totalPoints; i++) {
        const x = center + radius * level * Math.cos(i * angleStep - Math.PI / 2);
        const y = center + radius * level * Math.sin(i * angleStep - Math.PI / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    });

    // Draw axis lines from center to vertices
    ctx.strokeStyle = theme === 'dark' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(142, 111, 87, 0.15)';
    for (let i = 0; i < totalPoints; i++) {
      const x = center + radius * Math.cos(i * angleStep - Math.PI / 2);
      const y = center + radius * Math.sin(i * angleStep - Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw actual filled stat shape reflecting animated factor
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < totalPoints; i++) {
      const statVal = stats[i].value;
      const level = (statVal / 100) * radialAnimationFactor;
      const x = center + radius * level * Math.cos(i * angleStep - Math.PI / 2);
      const y = center + radius * level * Math.sin(i * angleStep - Math.PI / 2);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Fill region with beautiful gradient matching coffee theme
    const fillGrad = ctx.createRadialGradient(center, center, 10, center, center, radius);
    fillGrad.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
    fillGrad.addColorStop(1, 'rgba(142, 111, 87, 0.45)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Outline filled region
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.restore();

    // Draw little core circles on poly corners
    for (let i = 0; i < totalPoints; i++) {
      const statVal = stats[i].value;
      const level = (statVal / 100) * radialAnimationFactor;
      const x = center + radius * level * Math.cos(i * angleStep - Math.PI / 2);
      const y = center + radius * level * Math.sin(i * angleStep - Math.PI / 2);
      
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#D4AF37';
      ctx.fill();
    }

    // Print text labels around vertices carefully
    ctx.fillStyle = theme === 'dark' ? '#E1C9B7' : '#2A140E';
    ctx.font = 'bold 11px "Noto Sans Thai", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < totalPoints; i++) {
      const x = center + (radius + 24) * Math.cos(i * angleStep - Math.PI / 2);
      const y = center + (radius + 14) * Math.sin(i * angleStep - Math.PI / 2);
      
      // Fine tune position for edge labels
      const label = stats[i].key;
      ctx.fillText(label, x, y);
    }

  }, [selectedCoffee, radialAnimationFactor, theme]);

  // Snapshot Capture function
  const handleDownloadSnapshot = async () => {
    const cardEl = document.getElementById('oracle-result-capture-zone');
    if (!cardEl) return;

    setIsCapturing(true);
    audioSystem.playClickEcho();

    try {
      // Small pause to guarantee smooth rendering
      await new Promise((res) => setTimeout(res, 350));
      
      const canvas = await html2canvas(cardEl, {
        backgroundColor: theme === 'dark' ? '#160B08' : '#FAF6F1',
        scale: 2, // High DPI capture
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const dlLink = document.createElement('a');
      dlLink.download = `CoffeeOracle_Prediction_${selectedCoffee.id}.png`;
      dlLink.href = imgData;
      dlLink.click();

      setCaptureSuccess(true);
      setTimeout(() => setCaptureSuccess(false), 3000);
    } catch (e) {
      console.error('Failed generating coffee oracle card snapshot:', e);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-4 py-8 md:py-12 z-10 flex flex-col items-center">
      
      {/* Decorative Intro Header Sparkle */}
      <div className="mb-4 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-500 font-semibold flex items-center justify-center space-x-1.5 animate-pulse">
          <Sparkles className="w-4.5 h-4.5 text-gold-500 animate-spin-slow" />
          <span>The Oracle Reveals</span>
        </span>
      </div>

      {/* Main card capture wrap */}
      <div 
        id="oracle-result-capture-zone"
        className={`max-w-3xl w-full p-6 md:p-10 rounded-3xl shadow-3xl border text-left overflow-hidden transition-colors duration-500 relative ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-coffee-950/80 via-coffee-950/90 to-black/80 border-gold-500/30' 
            : 'bg-gradient-to-b from-cream-100/90 via-cream-50/95 to-cream-100/90 border-coffee-300'
        }`}
      >
        
        {/* Subtle decorative framing lines inside cards */}
        <div className="absolute inset-4 border border-gold-500/10 rounded-2xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
          
          {/* Column A: Coffee visual and stats */}
          <div className="col-span-1 md:col-span-5 flex flex-col items-center text-center">
            
            {/* Visual background rings */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-4">
              <div 
                className="absolute inset-0 rounded-full blur-2xl animate-pulse"
                style={{ 
                  backgroundColor: selectedCoffee.colorTheme.glow || 'rgba(212, 175, 55, 0.4)',
                  animationDuration: '3s'
                }}
              />
              <div className="absolute inset-0 border border-dashed border-gold-500/20 rounded-full animate-spin-slow"></div>
              
              <div className="relative z-10 scale-125">
                <CoffeeSVG id={selectedCoffee.id} active={true} />
              </div>
            </div>

            <h3 className="font-serif text-3xl font-extrabold text-gold-500 mt-2 mb-1">
              {selectedCoffee.nameTh}
            </h3>
            
            <p className="font-mono text-sm uppercase tracking-wider text-cream-500">
              {selectedCoffee.nameEn}
            </p>

            {/* Radar chart container panel */}
            <div className="w-full flex justify-center mt-4">
              <div className="relative">
                <canvas ref={radarRef} className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] drop-shadow-md" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                  <Coffee className="w-8 h-8 text-gold-400" />
                </div>
              </div>
            </div>

          </div>

          {/* Column B: Predition texts and remedies */}
          <div className="col-span-1 md:col-span-7 flex flex-col justify-center">
            
            {/* Predict Header */}
            <div className="mb-4">
              {gender && (
                <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-sans tracking-wide font-medium mb-2 border ${
                  theme === 'dark' 
                    ? 'bg-gold-500/10 border-gold-500/20 text-gold-300' 
                    : 'bg-coffee-900/5 border-coffee-900/10 text-coffee-800'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
                  <span>
                    {
                      gender === 'male' ? 'แด่ท่านสุภาพบุรุษ 🤵' :
                      gender === 'female' ? 'แด่ท่านสุภาพสตรี 👰' :
                      'แด่ผู้หลงใหลในกาแฟ 🔮'
                    }
                  </span>
                </div>
              )}
              <p className="font-mono text-[10px] text-gold-500 tracking-[0.2em] font-bold uppercase mb-1">
                สิ่งที่ใจเรียกร้องและปรารถนาที่สุดตอนนี้คือ...
              </p>
              <h2 className="font-sans text-xl md:text-2xl font-bold text-coral-500 text-gold-300">
                {selectedCoffee.whatHeartWants}
              </h2>
            </div>

            {/* Divider line */}
            <div className={`h-[1px] w-full my-3 ${theme === 'dark' ? 'bg-coffee-800/80' : 'bg-cream-300'}`} />

            {/* In-depth oracle review/story */}
            <p className={`font-sans text-sm md:text-base leading-relaxed mb-6 font-light ${theme === 'dark' ? 'text-cream-100' : 'text-cream-950'}`}>
              {selectedCoffee.insight}
            </p>

            {/* Coffee Remedies module */}
            <div>
              <p className="font-serif text-gold-400 text-xs tracking-widest uppercase font-bold mb-4 flex items-center space-x-1">
                <Sparkles className="w-4.5 h-4.5 text-gold-500" />
                <span>3 กุญแจกาแฟสลัดความล้า (COFFEE REMEDIES)</span>
              </p>

              <div className="space-y-4">
                {selectedCoffee.remedies.map((remedy, i) => (
                  <div 
                    key={i} 
                    className={`flex items-start space-x-3.5 p-3.5 rounded-xl border transition-all ${
                      theme === 'dark' 
                        ? 'bg-coffee-950/60 border-coffee-900/60 hover:bg-coffee-900/40' 
                        : 'bg-white/50 border-cream-200 hover:bg-white/80'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-gold-500/15 text-gold-500 shrink-0">
                      <RemedyIcon name={remedy.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-gold-400">
                        {remedy.title}
                      </h4>
                      <p className={`font-sans text-xs mt-0.5 font-light ${theme === 'dark' ? 'text-cream-300' : 'text-cream-700'}`}>
                        {remedy.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Small metadata watermark inside snapshot capture frame */}
        <div className="mt-8 pt-4 border-t border-gold-500/10 flex justify-between items-center text-[10px] font-mono text-cream-600/70">
          <span>COFFEE NEED ORACLE INITIATION</span>
          <span>© 2026 KA-FAE-BOK-JAI</span>
        </div>

      </div>

      {/* Button controls panel */}
      <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 z-10">
        
        {/* Restart/Try again */}
        <button
          onClick={onRestart}
          id="restart-ceremony-btn"
          className="w-full sm:w-auto px-7 py-3.5 bg-black/35 hover:bg-black/60 border border-gold-500/30 hover:border-gold-500/60 rounded-xl font-sans text-sm font-semibold text-cream-100 flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer shadow-lg"
        >
          <RotateCcw className="w-4.5 h-4.5 text-gold-500" />
          <span>เล่นเกมใหม่อีกครั้ง</span>
        </button>

      </div>

      {/* Floating toast notification for screenshot action */}
      <AnimatePresence>
        {captureSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 bg-green-900/90 text-green-100 px-5 py-3 rounded-xl border border-green-500/30 flex items-center space-x-2 shadow-2xl z-50 text-sm font-sans"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>ดาวน์โหลดภาพสัญลักษณ์ออราเคิลของคุณสำเร็จแล้วเรียบร้อย!</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
