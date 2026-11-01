import React, { useEffect, useState } from 'react';
import { cn } from '../index';
import { getStatusIndicatorColor } from '@sudobility/design';

export type SystemStatus = 'operational' | 'degraded' | 'major-outage';

export interface SystemStatusData {
  status: SystemStatus;
  version?: string;
  message?: string;
  incidents?: string[];
}

export interface SystemStatusIndicatorProps {
  statusPageUrl?: string;
  apiEndpoint?: string;
  refreshInterval?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  version?: string;
  onStatusChange?: (status: SystemStatusData) => void;
  /** Network online status - when false, overrides system status */
  isNetworkOnline?: boolean;
  /** Optional tracking callback */
  onTrack?: (action: string) => void;
}

const statusConfig = {
  operational: {
    color: `${getStatusIndicatorColor('success')}/80`,
    hoverColor: `hover:${getStatusIndicatorColor('success')}`,
    label: 'All systems operational',
  },
  degraded: {
    color: `${getStatusIndicatorColor('warning')}/80`,
    hoverColor: `hover:${getStatusIndicatorColor('warning')}`,
    label: 'Degraded performance',
  },
  'major-outage': {
    color: `${getStatusIndicatorColor('error')}/80`,
    hoverColor: `hover:${getStatusIndicatorColor('error')}`,
    label: 'Major outage',
  },
};

const sizeClasses = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = ({
  statusPageUrl = '/status',
  apiEndpoint,
  refreshInterval = 60000, // 1 minute default
  size = 'sm',
  className,
  version,
  onStatusChange,
  isNetworkOnline = true,
  onTrack,
}) => {
  const [statusData, setStatusData] = useState<SystemStatusData>({
    status: 'operational',
    version: version || '1.0.0',
    message: 'All systems operational',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!apiEndpoint) return;

      setIsLoading(true);
      try {
        const response = await fetch(apiEndpoint);
        if (response.ok) {
          const data = await response.json();

          // Transform StatusPage.io format if needed
          let transformedData: SystemStatusData;
          if (data.status?.indicator) {
            // StatusPage.io format
            const indicatorMap: Record<string, SystemStatus> = {
              none: 'operational',
              minor: 'degraded',
              major: 'major-outage',
              critical: 'major-outage',
            };
            transformedData = {
              status: indicatorMap[data.status.indicator] || 'operational',
              version: version,
              message: data.status.description,
            };
          } else {
            // Native format
            transformedData = data;
          }

          setStatusData(transformedData);
          onStatusChange?.(transformedData);
        }
      } catch {
        // Status fetch failed
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchStatus();

    // Set up polling if refreshInterval is provided
    if (refreshInterval > 0) {
      const interval = setInterval(fetchStatus, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [apiEndpoint, refreshInterval, onStatusChange, version]);

  // Override status if network is offline
  const displayStatus = !isNetworkOnline ? 'major-outage' : statusData.status;
  const config = statusConfig[displayStatus];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onTrack?.('status_click');

    // Show alert when network is offline
    if (!isNetworkOnline) {
      window.alert(
        'Network is not available. Please check your internet connection and try again later.'
      );
      return;
    }

    window.open(statusPageUrl, '_blank', 'noopener,noreferrer');
  };

  // Build tooltip text for native title attribute
  const tooltipText = !isNetworkOnline
    ? 'Network unavailable'
    : statusData.version
      ? `Version ${statusData.version} - ${statusData.message || config.label}`
      : statusData.message || config.label;

  return (
    <span
      role='button'
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
      title={tooltipText}
      className={cn(
        'inline-block rounded-full flex-shrink-0 transition-all duration-200 cursor-pointer',
        'ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2',
        config.color,
        config.hoverColor,
        sizeClasses[size],
        (isLoading || !isNetworkOnline) && 'animate-pulse',
        className
      )}
      aria-label={`System status: ${config.label}`}
    />
  );
};
