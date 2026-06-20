import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'default';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyle = "px-6 py-3 font-semibold tracking-wide text-sm outline-none cursor-pointer rounded-xl transition-colors shadow-lg backdrop-blur-md border border-white/20";
    
    let variantStyle = "bg-white/10 hover:bg-white/20 text-foreground";
    if (variant === 'primary') variantStyle = "bg-primary hover:bg-primary/90 text-primary-foreground";
    if (variant === 'secondary') variantStyle = "bg-secondary hover:bg-secondary/90 text-secondary-foreground";
    if (variant === 'accent') variantStyle = "bg-accent hover:bg-accent/90 text-accent-foreground";

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={cn(baseStyle, variantStyle, className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
