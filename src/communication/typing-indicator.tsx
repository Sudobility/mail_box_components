import React from 'react';
import { cn } from '../index';
import { ui } from '@sudobility/design';

export interface TypingIndicatorProps {
  /** Show indicator */
  show?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * TypingIndicator Component
 *
 * Animated typing indicator for chat interfaces.
 * Shows three bouncing dots to indicate someone is typing.
 *
 * @example
 * ```tsx
 * <TypingIndicator show={isTyping} size="md" />
 * ```
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  show = true,
  size = 'md',
  className,
}) => {
  if (!show) return null;

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const containerSizes = {
    sm: 'px-3 py-2',
    md: 'px-4 py-2.5',
    lg: 'px-5 py-3',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-2xl',
        ui.background.muted,
        containerSizes[size],
        className
      )}
    >
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={cn('rounded-full bg-muted-foreground', sizeClasses[size])}
          style={{
            animation: 'typing-bounce 1.4s infinite ease-in-out',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
};
