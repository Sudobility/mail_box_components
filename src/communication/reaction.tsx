import React, { useState } from 'react';
import { cn } from '../index';
import { colors, ui } from '@sudobility/design';

export interface EmojiReaction {
  emoji: string;
  count: number;
  users?: string[];
  reacted?: boolean;
}

/** Tracking data for Reaction actions */
export interface ReactionTrackingData {
  action: 'react' | 'toggle_picker';
  trackingLabel?: string;
  componentName?: string;
}

export interface ReactionProps {
  /** Available reactions */
  reactions: EmojiReaction[];
  /** Reaction click handler */
  onReact?: (emoji: string) => void;
  /** Show picker */
  showPicker?: boolean;
  /** Available emojis for picker */
  availableEmojis?: string[];
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: ReactionTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Reaction Component
 *
 * Emoji reaction picker and display.
 * Shows reaction counts and allows users to add reactions.
 *
 * @example
 * ```tsx
 * <Reaction
 *   reactions={[
 *     { emoji: '👍', count: 5, reacted: true },
 *     { emoji: '❤️', count: 3 },
 *     { emoji: '😊', count: 2 }
 *   ]}
 *   availableEmojis={['👍', '❤️', '😊', '🎉', '🔥', '👏']}
 *   onReact={(emoji) => handleReaction(emoji)}
 *   showPicker
 * />
 * ```
 */
export const Reaction: React.FC<ReactionProps> = ({
  reactions,
  onReact,
  showPicker = true,
  availableEmojis = ['👍', '❤️', '😊', '🎉', '🔥', '👏', '👀', '🚀'],
  className,
  onTrack,
  trackingLabel,
  componentName = 'Reaction',
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleReactionClick = (emoji: string) => {
    onTrack?.({ action: 'react', trackingLabel, componentName });
    if (onReact) {
      onReact(emoji);
    }
  };

  const handleTogglePicker = () => {
    onTrack?.({ action: 'toggle_picker', trackingLabel, componentName });
    setIsPickerOpen(!isPickerOpen);
  };

  return (
    <div
      className={cn('relative flex flex-wrap items-center gap-2', className)}
    >
      {/* Existing reactions */}
      {reactions.map(reaction => (
        <button
          key={reaction.emoji}
          onClick={() => handleReactionClick(reaction.emoji)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all',
            'border-2',
            reaction.reacted
              ? `${colors.component.badge.primary.base} ${colors.component.badge.primary.dark} border-primary`
              : `${colors.component.button.secondary.base} ${colors.component.button.secondary.dark} border-transparent`
          )}
        >
          <span className='text-lg leading-none'>{reaction.emoji}</span>
          <span
            className={cn(
              'text-sm font-medium',
              reaction.reacted ? ui.text.info : ui.text.label
            )}
          >
            {reaction.count}
          </span>
        </button>
      ))}

      {/* Add reaction button */}
      {showPicker && (
        <div className='relative'>
          <button
            onClick={handleTogglePicker}
            className={cn(
              'inline-flex items-center justify-center w-8 h-8 rounded-full',
              colors.component.button.ghost.base,
              colors.component.button.ghost.dark,
              ui.transition.default
            )}
          >
            <svg
              className='w-5 h-5 text-muted-foreground'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4v16m8-8H4'
              />
            </svg>
          </button>

          {/* Emoji picker */}
          {isPickerOpen && (
            <>
              {/* Backdrop */}
              <div
                className='fixed inset-0 z-10'
                onClick={() => setIsPickerOpen(false)}
              />

              {/* Picker */}
              <div
                className={cn(
                  'absolute z-20 bottom-full mb-2 right-0 border p-2',
                  ui.background.surface,
                  ui.border.default,
                  ui.border.radius,
                  ui.shadow.lg
                )}
              >
                <div className='grid grid-cols-4 gap-1'>
                  {availableEmojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => {
                        handleReactionClick(emoji);
                        setIsPickerOpen(false);
                      }}
                      className={cn(
                        'w-10 h-10 flex items-center justify-center text-2xl rounded',
                        colors.component.button.ghost.base,
                        colors.component.button.ghost.dark,
                        ui.transition.default
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
