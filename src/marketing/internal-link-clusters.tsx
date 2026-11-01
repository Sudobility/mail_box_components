import { cn } from '../index';
import { ui, colors, textVariants } from '@sudobility/design';
import React from 'react';
import { Link } from 'react-router-dom';

export interface InternalLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
}

const linkVariants = {
  primary: cn(ui.text.link, 'font-medium'),
  secondary: 'text-success hover:text-success/80 underline font-medium',
  subtle: cn(ui.text.linkMuted),
};

export const InternalLink: React.FC<InternalLinkProps> = ({
  to,
  children,
  className,
  variant = 'primary',
}) => (
  <Link
    to={to}
    className={cn(linkVariants[variant], className)}
    aria-label={
      typeof children === 'string' ? `Navigate to ${children}` : undefined
    }
  >
    {children}
  </Link>
);

// Topic clusters for strategic internal linking
const WEB3_EMAIL_CLUSTERS = {
  // Getting Started cluster
  gettingStarted: {
    documentation: '/document#getting-started',
    connect: '/connect',
    features: '/document#email-management',
  },

  // Benefits cluster
  benefits: {
    users: '/web3-users',
    projects: '/web3-projects',
    security: '/document#technical-details',
    nameService: '/document#name-service-subscription',
  },

  // Technical cluster
  technical: {
    documentation: '/document',
    apiDocs: '/document#api-documentation',
    smartContracts: '/document#smart-contracts',
    security: '/document#technical-details',
  },

  // Integration cluster
  integration: {
    projects: '/web3-projects',
    delegation: '/document#email-delegation',
    nameService: '/document#name-service-subscription',
    troubleshooting: '/document#troubleshooting',
  },
};

export interface TopicClusterLinksProps {
  cluster: keyof typeof WEB3_EMAIL_CLUSTERS;
  context?: string;
  className?: string;
}

const TopicClusterLinks: React.FC<TopicClusterLinksProps> = ({
  cluster,
  context: _context = '',
  className,
}) => {
  const links = WEB3_EMAIL_CLUSTERS[cluster];

  const linkTexts = {
    gettingStarted: {
      documentation: 'Learn how it works',
      connect: 'Get started now',
      features: 'Explore features',
    },
    benefits: {
      users: 'Benefits for users',
      projects: 'For Web3 projects',
      security: 'Security details',
      nameService: 'ENS/SNS domains',
    },
    technical: {
      documentation: 'Full documentation',
      apiDocs: 'API reference',
      smartContracts: 'Smart contract integration',
      security: 'Technical security',
    },
    integration: {
      projects: 'Integration examples',
      delegation: 'Email delegation',
      nameService: 'Domain setup',
      troubleshooting: 'Troubleshooting guide',
    },
  };

  return (
    <span className={cn('text-sm', textVariants.label.helper(), className)}>
      {Object.entries(links).map(([key, url], index) => (
        <React.Fragment key={key}>
          <InternalLink to={url} variant='primary'>
            {
              linkTexts[cluster][
                key as keyof (typeof linkTexts)[typeof cluster]
              ]
            }
          </InternalLink>
          {index < Object.keys(links).length - 1 && ' • '}
        </React.Fragment>
      ))}
    </span>
  );
};

export interface RelatedLinksProps {
  title?: string;
  links: Array<{
    text: string;
    url: string;
    variant?: 'primary' | 'secondary' | 'subtle';
  }>;
  className?: string;
}

const RelatedLinks: React.FC<RelatedLinksProps> = ({
  title = 'Related:',
  links,
  className,
}) => (
  <div
    className={cn(
      'mt-4 p-3 rounded-lg border',
      colors.component.alert.info.base,
      colors.component.alert.info.dark,
      className
    )}
  >
    <span
      className={cn(
        'text-sm font-medium mr-2',
        colors.component.alert.info.icon
      )}
    >
      {title}
    </span>
    {links.map((link, index) => (
      <React.Fragment key={index}>
        <InternalLink to={link.url} variant={link.variant || 'primary'}>
          {link.text}
        </InternalLink>
        {index < links.length - 1 && ' • '}
      </React.Fragment>
    ))}
  </div>
);

// Context-aware linking suggestions
const generateContextualLinks = (pageType: string, _userStatus?: string) => {
  const baseLinks = {
    homepage: [
      { text: 'How it works', url: '/document#getting-started' },
      { text: 'User benefits', url: '/web3-users' },
      { text: 'For projects', url: '/web3-projects' },
    ],
    documentation: [
      { text: 'Get started', url: '/connect' },
      { text: 'User guide', url: '/web3-users' },
      { text: 'API docs', url: '/document#api-documentation' },
    ],
    users: [
      { text: 'Start now', url: '/connect' },
      { text: 'Documentation', url: '/document' },
      { text: 'For projects', url: '/web3-projects' },
    ],
    projects: [
      { text: 'API integration', url: '/document#api-documentation' },
      { text: 'Smart contracts', url: '/document#smart-contracts' },
      { text: 'User benefits', url: '/web3-users' },
    ],
  };

  return baseLinks[pageType as keyof typeof baseLinks] || [];
};

export { TopicClusterLinks, RelatedLinks, generateContextualLinks };
