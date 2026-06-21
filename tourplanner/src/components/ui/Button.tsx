import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MotionButtonProps = ComponentPropsWithoutRef<typeof motion.button>;
interface ButtonProps extends MotionButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    whileHover,
    whileTap,
    transition,
    ...props
  }, ref) => {
    const baseClasses = cn(
      'relative inline-flex items-center justify-center gap-2 font-medium cursor-pointer',
      'transition-all duration-200 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
      'active:scale-[0.97]',
      {
        'rounded-lg': size !== 'icon',
        'rounded-full': size === 'icon',
        'h-8 px-3 text-xs': size === 'sm',
        'h-10 px-4 text-sm': size === 'md',
        'h-12 px-6 text-base': size === 'lg',
        'h-10 w-10': size === 'icon',
      },
      {
        'bg-accent text-accent-foreground shadow-sm': variant === 'primary',
        'hover:bg-accent-hover hover:shadow-md': variant === 'primary',
        'bg-secondary text-secondary-foreground border border-border/80': variant === 'secondary',
        'hover:bg-secondary/80 hover:border-border': variant === 'secondary',
        'bg-transparent text-foreground': variant === 'ghost',
        'hover:bg-accent/10 hover:text-accent': variant === 'ghost',
        'bg-destructive text-destructive-foreground': variant === 'destructive',
        'hover:bg-destructive/90': variant === 'destructive',
        'border-2 border-border bg-transparent text-foreground': variant === 'outline',
        'hover:border-accent hover:text-accent hover:bg-accent/5': variant === 'outline',
      },
      className
    );

    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={isDisabled}
        whileHover={isDisabled ? { scale: 1 } : whileHover ?? { scale: 1.02 }}
        whileTap={isDisabled ? { scale: 1 } : whileTap ?? { scale: 0.97 }}
        transition={transition ?? { type: 'spring', stiffness: 400, damping: 25 }}
        {...props}
      >
        <>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {!loading && leftIcon}
          {loading && loadingText ? loadingText : children}
          {!loading && rightIcon}
        </>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
