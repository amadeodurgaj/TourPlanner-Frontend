import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'interactive' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children?: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, children, whileHover, whileTap, ...props }, ref) => {
    const variantClasses = cn(
      'rounded-xl border transition-all duration-250',
      {
        'bg-card border-border/60 shadow-sm': variant === 'default' || variant === 'interactive',
        'bg-card border-border/80 shadow-md': variant === 'elevated',
        'bg-card/80 backdrop-blur-xl border-border/40 shadow-lg': variant === 'glass',
        'p-0': padding === 'none',
        'p-4': padding === 'sm',
        'p-6': padding === 'md',
        'p-8': padding === 'lg',
        'hover:shadow-md hover:border-border/80 hover:-translate-y-0.5 cursor-pointer': hover || variant === 'interactive',
        'active:scale-[0.99]': variant === 'interactive',
      }
    );

    return (
      <motion.div
        ref={ref}
        className={cn(variantClasses, className)}
        whileHover={variant === 'interactive' ? (whileHover ?? { y: -2, transition: { duration: 0.2 } }) : undefined}
        whileTap={variant === 'interactive' ? (whileTap ?? { scale: 0.99 }) : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1.5 pb-4', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-lg font-semibold tracking-tight text-foreground', className)} {...props} />
);

export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center pt-4 mt-4 border-t border-border/50', className)} {...props} />
);
