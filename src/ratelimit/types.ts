/**
 * Types for ratelimit-components
 * All types use primitives only - NO external dependencies
 */

// =============================================================================
// UsageDashboard Types
// =============================================================================

/**
 * Color variants for usage bars
 */
export type UsageBarColor = 'blue' | 'green' | 'yellow' | 'red' | 'purple';

/**
 * Configuration for a single usage bar
 */
export interface UsageBarConfig {
  /** Period label (e.g., "Hourly", "Daily", "Monthly") */
  label: string;
  /** Current usage count */
  used: number;
  /** Limit for this period (null = unlimited) */
  limit: number | null;
  /** Optional color variant */
  color?: UsageBarColor;
  /** When this counter resets (ISO 8601 string) */
  resetsAt?: string;
}

/**
 * Labels for UsageDashboard localization
 */
export interface UsageDashboardLabels {
  /** Dashboard title */
  title?: string;
  /** Label for "used" count */
  usedLabel?: string;
  /** Label for "limit" */
  limitLabel?: string;
  /** Text to show for unlimited */
  unlimitedLabel?: string;
  /** Label for remaining count */
  remainingLabel?: string;
  /** Label prefix for reset time (e.g., "Resets") */
  resetsLabel?: string;
}

/** Tracking data for UsageDashboard actions */
export interface UsageDashboardTrackingData {
  action: 'upgrade_click';
  trackingLabel?: string;
  componentName?: string;
}

/**
 * Props for UsageDashboard component
 */
export interface UsageDashboardProps {
  /** Array of usage bars to display */
  usageBars: UsageBarConfig[];
  /** Current tier display name */
  currentTierName?: string;
  /** Labels for localization */
  labels?: UsageDashboardLabels;
  /** Callback when upgrade is clicked (shows upgrade button if provided) */
  onUpgradeClick?: () => void;
  /** Upgrade button label */
  upgradeButtonLabel?: string;
  /** Additional CSS classes */
  className?: string;
  /** Show percentage text on bars */
  showPercentage?: boolean;
  /** Show remaining count */
  showRemaining?: boolean;
  /** Optional tracking callback */
  onTrack?: (data: UsageDashboardTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

// =============================================================================
// TierComparisonTable Types
// =============================================================================

/**
 * Display data for a single tier
 */
export interface TierDisplayData {
  /** Tier identifier */
  id: string;
  /** Display name */
  name: string;
  /** Hourly limit (null = unlimited) */
  hourlyLimit: number | null;
  /** Daily limit (null = unlimited) */
  dailyLimit: number | null;
  /** Monthly limit (null = unlimited) */
  monthlyLimit: number | null;
  /** Whether this is the current user's tier */
  isCurrent?: boolean;
  /** Whether to highlight this tier */
  isHighlighted?: boolean;
}

/**
 * Labels for TierComparisonTable localization
 */
export interface TierComparisonLabels {
  /** Table title */
  title?: string;
  /** Header for tier column */
  tierHeader?: string;
  /** Header for hourly column */
  hourlyHeader?: string;
  /** Header for daily column */
  dailyHeader?: string;
  /** Header for monthly column */
  monthlyHeader?: string;
  /** Text for unlimited values */
  unlimitedLabel?: string;
  /** Badge text for current tier */
  currentTierBadge?: string;
}

/** Tracking data for TierComparisonTable actions */
export interface TierComparisonTableTrackingData {
  action: 'tier_select';
  trackingLabel?: string;
  componentName?: string;
}

/**
 * Props for TierComparisonTable component
 */
export interface TierComparisonTableProps {
  /** Array of tiers to display */
  tiers: TierDisplayData[];
  /** Labels for localization */
  labels?: TierComparisonLabels;
  /** Callback when a tier is selected */
  onTierSelect?: (tierId: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Custom number formatter (e.g., 1000 -> "1,000") */
  formatNumber?: (n: number) => string;
  /** Optional tracking callback */
  onTrack?: (data: TierComparisonTableTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

// =============================================================================
// UsageHistoryChart Types
// =============================================================================

/**
 * A single history entry for chart visualization
 */
export interface HistoryEntryData {
  /** Period start timestamp (ISO 8601 string) */
  periodStart: string;
  /** Period end timestamp (ISO 8601 string) */
  periodEnd: string;
  /** Request count in this period */
  requestCount: number;
  /** Limit for this period (null = unlimited) */
  limit: number | null;
}

/**
 * Period type for chart display
 */
export type PeriodType = 'hour' | 'day' | 'month';

/**
 * Labels for UsageHistoryChart localization
 */
export interface UsageHistoryLabels {
  /** Chart title */
  title?: string;
  /** Label for requests axis/legend */
  requestsLabel?: string;
  /** Label for limit line legend */
  limitLabel?: string;
  /** Label for period axis */
  periodLabel?: string;
  /** Text when no data available */
  noDataLabel?: string;
}

/**
 * Props for UsageHistoryChart component
 */
export interface UsageHistoryChartProps {
  /** History entries to display */
  entries: HistoryEntryData[];
  /** Period type for labeling */
  periodType: PeriodType;
  /** Labels for localization */
  labels?: UsageHistoryLabels;
  /** Chart height in pixels */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Custom date formatter */
  formatDate?: (date: string, periodType: PeriodType) => string;
  /** Bar color (CSS color) */
  barColor?: string;
  /** Limit line color (CSS color) */
  limitLineColor?: string;
  /** Show limit line on chart */
  showLimitLine?: boolean;
}
