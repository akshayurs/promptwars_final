'use client';

import React, { useEffect, useRef } from 'react';

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let particles: Array<{ x: number, y: number, originX: number, originY: number, size: number }> = [];

    const initParticles = () => {
      particles = [];
      const spacing = 35; // Grid spacing
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          particles.push({
            x: x + Math.random() * 10 - 5,
            y: y + Math.random() * 10 - 5,
            originX: x,
            originY: y,
            size: Math.random() * 2 + 1 // Made dots slightly larger
          });
        }
      }
    };
    initParticles();

    const mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };
    window.addEventListener('resize', onResize);

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      // Increased opacity for much higher visibility
      ctx.fillStyle = 'rgba(128, 128, 128, 0.8)';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Repulsion logic
        const maxDistance = 120;

        if (distance < maxDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;

          // Push particles away from the mouse
          p.x -= forceDirectionX * force * 4;
          p.y -= forceDirectionY * force * 4;
        } else {
          // Smoothly return to origin
          p.x -= (p.x - p.originX) * 0.05;
          p.y -= (p.y - p.originY) * 0.05;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-30 dark:opacity-30" />;
};
