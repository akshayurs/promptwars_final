'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'default';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyle = "glass-panel p-6 relative overflow-hidden transition-all duration-300";
    
    let variantStyle = "bg-white/10 dark:bg-black/20 text-foreground border-white/20";
    if (variant === 'primary') variantStyle = "bg-primary/20 dark:bg-primary/10 border-primary/30 text-foreground";
    if (variant === 'secondary') variantStyle = "bg-secondary/20 dark:bg-secondary/10 border-secondary/30 text-foreground";
    if (variant === 'accent') variantStyle = "bg-accent/20 dark:bg-accent/10 border-accent/30 text-foreground";

    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct);
      y.set(yPct);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(baseStyle, variantStyle, className)}
        {...props}
      >
        <div style={{ transform: "translateZ(30px)" }} className="w-full h-full relative z-10">
          {children as React.ReactNode}
        </div>
        
        {/* Shimmer effect for extra glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 pointer-events-none rounded-xl" />
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
