/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface BackdropCanvasProps {
  isResultScene?: boolean;
  glowColor?: string; // custom color based on selected coffee
}

export default function BackdropCanvas({ isResultScene = false, glowColor }: BackdropCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle Classes
    class CoffeeBean {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      rotSpeed: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height + height; // Start below or randomly
        this.size = Math.random() * 8 + 6; // 6 to 14 px
        this.speedY = -(Math.random() * 0.5 + 0.3); // float upwards safely
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.01;
        this.opacity = Math.random() * 0.25 + 0.1; // subtle opacity
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 80) * 0.15;
        this.angle += this.rotSpeed;

        // Reset if floats off top
        if (this.y < -30) {
          this.y = height + 30;
          this.x = Math.random() * width;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.beginPath();
        c.fillStyle = `rgba(62, 34, 26, ${this.opacity})`; // Dark brown roasted bean shade

        // Drawing a bean-like ellipse
        c.ellipse(0, 0, this.size, this.size * 0.65, 0, 0, Math.PI * 2);
        c.fill();

        // Draw the crease of the bean
        c.beginPath();
        c.strokeStyle = `rgba(26, 13, 10, ${this.opacity * 1.5})`;
        c.lineWidth = 1.2;
        c.beginPath();
        c.moveTo(-this.size * 0.9, 0);
        c.bezierCurveTo(
          -this.size * 0.3,
          -this.size * 0.15,
          this.size * 0.3,
          this.size * 0.15,
          this.size * 0.9,
          0
        );
        c.stroke();

        c.restore();
      }
    }

    class SteamParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      decay: number;
      wobbleSpeed: number;

      constructor(xCoord?: number, yCoord?: number) {
        this.x = xCoord !== undefined ? xCoord : Math.random() * width;
        this.y = yCoord !== undefined ? yCoord : height - Math.random() * 150;
        this.size = Math.random() * 30 + 30;
        this.speedY = -(Math.random() * 0.8 + 0.4);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.decay = Math.random() * 0.0005 + 0.0003;
        this.wobbleSpeed = Math.random() * 0.02;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 50) * 0.3;
        this.opacity -= this.decay;
        this.size += 0.05;

        if (this.opacity <= 0) {
          this.y = height + Math.random() * 100;
          this.x = Math.random() * width;
          this.size = Math.random() * 30 + 30;
          this.opacity = Math.random() * 0.15 + 0.05;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        const grad = c.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        grad.addColorStop(0, `rgba(226, 215, 204, ${this.opacity})`);
        grad.addColorStop(0.5, `rgba(226, 215, 204, ${this.opacity * 0.4})`);
        grad.addColorStop(1, 'rgba(226, 215, 204, 0)');

        c.fillStyle = grad;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    class LightFlare {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      color: string;
      pulseRate: number;
      angle: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 150 + 150;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = (Math.random() - 0.5) * 0.15;
        this.color = glowColor || 'rgba(212, 175, 55, 0.03)';
        this.pulseRate = Math.random() * 0.005 + 0.002;
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.pulseRate;

        // Bounce off bounds
        if (this.x < -100 || this.x > width + 100) this.speedX *= -1;
        if (this.y < -100 || this.y > height + 100) this.speedY *= -1;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        const currentRad = this.radius * (1 + Math.sin(this.angle) * 0.15);
        const grad = c.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          currentRad
        );
        
        const activeColor = glowColor || '212, 175, 55';
        grad.addColorStop(0, `rgba(${activeColor}, 0.06)`);
        grad.addColorStop(0.5, `rgba(${activeColor}, 0.02)`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        c.fillStyle = grad;
        c.beginPath();
        c.arc(this.x, this.y, currentRad, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // Populate arrays
    const beans: CoffeeBean[] = Array.from({ length: 22 }, () => new CoffeeBean());
    const steams: SteamParticle[] = Array.from({ length: 15 }, () => new SteamParticle());
    const flares: LightFlare[] = Array.from({ length: 3 }, () => new LightFlare());

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const render = () => {
      // Clear with dark atmospheric coffee tone background
      ctx.fillStyle = '#160B08'; // Rich super dark espresso background
      ctx.fillRect(0, 0, width, height);

      // Radial vignette overlay for cinematic experience
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      vignette.addColorStop(0, 'rgba(26, 13, 10, 0.1)');
      vignette.addColorStop(0.6, 'rgba(16, 7, 5, 0.85)');
      vignette.addColorStop(1, 'rgba(8, 3, 2, 0.99)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Flares
      flares.forEach((flare) => {
        flare.update();
        flare.draw(ctx);
      });

      // Steams
      steams.forEach((steam) => {
        steam.update();
        steam.draw(ctx);
      });

      // Beans
      beans.forEach((bean) => {
        bean.update();
        bean.draw(ctx);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [glowColor]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-50 pointer-events-none" />;
}
