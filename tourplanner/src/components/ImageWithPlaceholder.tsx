import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithPlaceholder({ src, alt, className }: ImageWithPlaceholderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={cn('bg-muted flex items-center justify-center', className)}>
        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <motion.img
        src={src}
        alt={alt}
        className={cn('w-full h-full object-cover', loaded ? 'blur-0' : 'blur-xl scale-110')}
        style={{ transition: 'filter 0.5s ease-out, transform 0.5s ease-out' }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0.5 }}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}
