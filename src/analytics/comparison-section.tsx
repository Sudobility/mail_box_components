import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../index';

const sectionVariants = cva('grid gap-8', {
  variants: {
    layout: {
      grid: 'grid-cols-1 md:grid-cols-2',
      stacked: 'grid-cols-1 space-y-8',
      cards: 'grid-cols-1 md:grid-cols-2 gap-6',
    },
    spacing: {
      sm: 'gap-4',
      md: 'gap-8',
      lg: 'gap-12',
    },
  },
  defaultVariants: {
    layout: 'grid',
    spacing: 'md',
  },
});

const cardVariants = cva('rounded-xl p-6 transition-all duration-300', {
  variants: {
    variant: {
      traditional:
        'bg-destructive/10 border-2 border-destructive/20 hover:border-destructive/40',
      web3: 'bg-success/10 border-2 border-success/20 hover:border-success/40',
      neutral: 'bg-card/50 border-2 border-border/30 hover:border-border',
      elevated: 'bg-card shadow-lg hover:shadow-xl border border-border',
    },
    animation: {
      none: '',
      hover: 'hover:transform hover:scale-[1.02]',
      float: 'hover:-translate-y-1',
    },
  },
  defaultVariants: {
    variant: 'traditional',
    animation: 'hover',
  },
});

const headerVariants = cva('text-lg font-bold mb-4 flex items-center gap-3', {
  variants: {
    variant: {
      traditional: 'text-destructive',
      web3: 'text-success',
      neutral: 'text-foreground',
      elevated: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'traditional',
  },
});

export interface ComparisonItem {
  text: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  subtext?: string;
}

export interface ComparisonData {
  title: string;
  icon?: React.ReactNode;
  items: ComparisonItem[];
  variant: 'traditional' | 'web3' | 'neutral' | 'elevated';
  badge?: {
    text: string;
    color?: 'red' | 'green' | 'blue' | 'gray';
  };
}

export interface ComparisonSectionProps extends VariantProps<
  typeof sectionVariants
> {
  className?: string;

  // Content
  title?: string;
  subtitle?: string;
  traditional: ComparisonData;
  web3: ComparisonData;

  // Styling
  cardAnimation?: 'none' | 'hover' | 'float';

  // Animation
  animate?: boolean;
  animationDelay?: number;

  // Custom icons
  traditionalIcon?: React.ReactNode;
  web3Icon?: React.ReactNode;
}

const defaultIcons = {
  traditional: '❌',
  web3: '✅',
  neutral: 'ℹ️',
  elevated: '⭐',
};

const badgeColors = {
  red: 'bg-destructive/10 text-destructive',
  green: 'bg-success/10 text-success',
  blue: 'bg-primary/10 text-primary',
  gray: 'bg-muted text-muted-foreground',
};

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  className,
  layout = 'grid',
  spacing = 'md',

  title,
  subtitle,
  traditional,
  web3,

  cardAnimation = 'hover',

  animate: _animate = true,
  animationDelay: _animationDelay = 0,

  traditionalIcon,
  web3Icon,
}) => {
  const renderComparisonCard = (data: ComparisonData, index: number) => {
    const cardContent = (
      <div
        className={cn(
          cardVariants({ variant: data.variant, animation: cardAnimation })
        )}
      >
        {/* Header */}
        <div className={cn(headerVariants({ variant: data.variant }))}>
          <span className='text-2xl'>
            {data.icon ||
              (index === 0 ? traditionalIcon : web3Icon) ||
              defaultIcons[data.variant]}
          </span>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <span>{data.title}</span>
              {data.badge && (
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-1 rounded-full',
                    badgeColors[data.badge.color || 'gray']
                  )}
                >
                  {data.badge.text}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <ul className='space-y-3'>
          {data.items.map((item, itemIndex) => (
            <li
              key={itemIndex}
              className={cn(
                'flex items-start gap-3 text-sm leading-relaxed',
                item.highlight && 'font-medium'
              )}
            >
              {item.icon && (
                <span className='flex-shrink-0 mt-0.5 text-base'>
                  {item.icon}
                </span>
              )}
              <div className='flex-1'>
                <span
                  className={cn(
                    data.variant === 'traditional'
                      ? 'text-muted-foreground'
                      : data.variant === 'web3'
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground'
                  )}
                >
                  {item.text}
                </span>
                {item.subtext && (
                  <p className='text-xs text-muted-foreground mt-1'>
                    {item.subtext}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );

    return <div key={data.title}>{cardContent}</div>;
  };

  const sectionContent = (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      {(title || subtitle) && (
        <div className='text-center space-y-4'>
          {title && (
            <h2 className='text-2xl sm:text-3xl font-bold text-foreground'>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Comparison Grid */}
      <div className={cn(sectionVariants({ layout, spacing }))}>
        {renderComparisonCard(traditional, 0)}
        {renderComparisonCard(web3, 1)}
      </div>
    </div>
  );

  return sectionContent;
};

// Helper function to create comparison data
export const createComparisonData = (
  title: string,
  items: (string | ComparisonItem)[],
  variant: 'traditional' | 'web3' | 'neutral' | 'elevated',
  options?: {
    icon?: React.ReactNode;
    badge?: ComparisonData['badge'];
  }
): ComparisonData => ({
  title,
  variant,
  items: items.map(item => (typeof item === 'string' ? { text: item } : item)),
  ...options,
});

// Predefined comparison examples - for backward compatibility
// Note: These should be moved to consuming application with proper localization
export const createEmailComparisonData = (labels?: {
  traditionalTitle?: string;
  web3Title?: string;
  traditionalItems?: { text: string; icon: string }[];
  web3Items?: { text: string; icon: string }[];
  traditionalBadge?: string;
  web3Badge?: string;
}) => {
  const defaultTraditionalItems = [
    { text: 'Create account with email/password', icon: '🔑' },
    { text: 'Remember multiple passwords', icon: '🧠' },
    { text: 'Verify email address', icon: '📧' },
    { text: 'Risk of password theft', icon: '⚠️' },
    { text: 'Data stored on company servers', icon: '🏢' },
    { text: 'Account can be locked/suspended', icon: '🔒' },
  ];

  const defaultWeb3Items = [
    { text: 'Connect your wallet', icon: '🔗' },
    { text: 'No passwords needed', icon: '🚫' },
    { text: 'Instant authentication', icon: '⚡' },
    { text: 'Cryptographically secure', icon: '🔐' },
    { text: 'You own your data', icon: '👑' },
    { text: 'Censorship resistant', icon: '🛡️' },
  ];

  return {
    traditional: createComparisonData(
      labels?.traditionalTitle || 'Traditional Email',
      labels?.traditionalItems || defaultTraditionalItems,
      'traditional',
      { badge: { text: labels?.traditionalBadge || 'Old Way', color: 'red' } }
    ),

    web3: createComparisonData(
      labels?.web3Title || 'Web3 Email',
      labels?.web3Items || defaultWeb3Items,
      'web3',
      { badge: { text: labels?.web3Badge || 'New Way', color: 'green' } }
    ),
  };
};
