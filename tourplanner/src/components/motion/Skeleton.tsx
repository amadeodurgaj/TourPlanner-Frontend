import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animate = true
}: SkeletonProps) {
  return (
    <motion.div
      className={cn(
        'bg-muted/60',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-none',
        variant === 'rounded' && 'rounded-lg',
        variant === 'text' && 'rounded-md',
        className
      )}
      style={{ width, height }}
      animate={animate ? { opacity: [0.4, 0.7, 0.4] } : undefined}
      transition={animate ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
    />
  );
}

export function TourCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={16} />
          <Skeleton width="50%" height={12} />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton width={60} height={20} className="rounded-full" />
        <Skeleton width={60} height={20} className="rounded-full" />
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
          <Skeleton variant="circular" width={48} height={48} />
          <Skeleton width="60%" height={32} />
          <Skeleton width="40%" height={14} />
        </div>
      ))}
    </div>
  );
}
