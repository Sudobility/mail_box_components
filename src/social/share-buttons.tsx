import React from 'react';
import { cn } from '../index';
import { ui } from '@sudobility/design';

export type SharePlatform =
  'twitter' | 'facebook' | 'linkedin' | 'reddit' | 'email' | 'copy';

export interface ShareButtonsProps {
  /** URL to share */
  url: string;
  /** Title to share */
  title?: string;
  /** Description to share */
  description?: string;
  /** Platforms to show */
  platforms?: SharePlatform[];
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Display variant */
  variant?: 'icons' | 'buttons';
  /** Additional className */
  className?: string;
}

/**
 * ShareButtons Component
 *
 * Social media share buttons for common platforms.
 * Supports Twitter, Facebook, LinkedIn, Reddit, email, and copy link.
 *
 * @example
 * ```tsx
 * <ShareButtons
 *   url="https://example.com/article"
 *   title="Check out this article!"
 *   platforms={['twitter', 'facebook', 'linkedin', 'copy']}
 *   variant="buttons"
 * />
 * ```
 */
export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title = '',
  description = '',
  platforms = ['twitter', 'facebook', 'linkedin', 'reddit', 'email', 'copy'],
  size = 'md',
  variant = 'icons',
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (platform: SharePlatform) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    const shareUrls: Record<SharePlatform, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      copy: url,
    };

    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const buttonSizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const platformConfig = {
    twitter: {
      name: 'Twitter',
      color: 'bg-[#1DA1F2] hover:bg-[#1a8cd8]',
      icon: '𝕏',
    },
    facebook: {
      name: 'Facebook',
      color: 'bg-[#1877F2] hover:bg-[#165ed0]',
      icon: 'f',
    },
    linkedin: {
      name: 'LinkedIn',
      color: 'bg-[#0A66C2] hover:bg-[#084d92]',
      icon: 'in',
    },
    reddit: {
      name: 'Reddit',
      color: 'bg-[#FF4500] hover:bg-[#e03d00]',
      icon: 'r',
    },
    email: {
      name: 'Email',
      color: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      icon: '✉',
    },
    copy: {
      name: copied ? 'Copied!' : 'Copy Link',
      color: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      icon: '🔗',
    },
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {platforms.map(platform => {
        const config = platformConfig[platform];

        if (variant === 'icons') {
          return (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className={cn(
                'rounded-full text-primary-foreground flex items-center justify-center',
                ui.transition.default,
                sizeClasses[size],
                config.color
              )}
              title={config.name}
            >
              {config.icon}
            </button>
          );
        }

        return (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className={cn(
              'rounded text-primary-foreground font-medium',
              ui.transition.default,
              buttonSizes[size],
              config.color
            )}
          >
            {config.name}
          </button>
        );
      })}
    </div>
  );
};

function useState<T>(initialValue: T): [T, (value: T) => void] {
  const [state, setState] = React.useState(initialValue);
  return [state, setState];
}
