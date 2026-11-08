/**
 * @sudobility/components
 *
 * A comprehensive React component library and design system.
 *
 * @author John Qiu Huang
 * @license MIT
 */

// === CORE UTILITIES ===
export { cn } from './lib/utils';

// === PRIMITIVES ===
export * from './primitives';

// === FORMS ===
export * from './forms';

// === UI COMPONENTS (not in categories) ===
export * from './ui/action-button';
export * from './ui/app-links';
export * from './ui/address-link';
export * from './ui/animated-section';
export * from './ui/backdrop';
export * from './ui/banner';
export * from './ui/button';
export * from './ui/level-slider';
export * from './ui/segmented-control';
export * from './ui/command';
export * from './ui/design-system-components';
export * from './ui/focus-indicator';
// Responsive form dialog: full-screen on phones, centred dialog from sm up.
// The deprecated `Modal` points here, so it has to be reachable from the root.
export * from './ui/form-modal';
export * from './ui/gradient-icon-container';
export * from './ui/icon-container';
export * from './ui/icon-text';
export * from './ui/item-list';
export * from './ui/info-box';
export * from './ui/keyboard-shortcut';
export * from './ui/logo';
export * from './ui/morph-transition';
export * from './ui/page-section-header';
export * from './ui/parallax-scroll';
export * from './ui/quick-actions';
export * from './ui/reveal-on-scroll';
export * from './ui/section-badge';
export * from './ui/section-header';
export * from './ui/settings-list';
export * from './ui/skip-navigation';
export * from './ui/select';
export * from './ui/sort-dropdown';
export * from './ui/version-badge';
export * from './ui/visually-hidden';
export * from './ui/text-input-modal';
export * from './ui/timer-display';
export * from './ui/confetti';

// === NAVIGATION ===
export * from './navigation';

// === DATA DISPLAY ===
export * from './data-display';

// === CHARTS ===
export * from './charts';

// === MEDIA ===
export * from './media';

// === MODALS ===
export * from './modals';

// === INTERACTIVE ===
export * from './interactive';

// === CORE COMPONENTS ===
export * from './core';

// === FEATURE COMPONENTS ===
export * from './features';

// === KYC COMPONENTS ===
export * from './kyc';

// === LAYOUT COMPONENTS ===
export * from './layout';

// === OPTIMIZATION COMPONENTS ===
export * from './optimization';

// === DEV TOOLS ===
export * from './dev-tools';

// === HOOKS ===
export * from './hooks';

// === UTILITIES ===
export {
  formatFileSize,
  convertFileSize,
  parseFileSize,
} from './utils/formatFileSize';

// Performance & Optimization utilities
export * from './utils';

// Performance monitoring
export {
  getPerformanceMonitor,
  initializePerformanceMonitoring,
  type PerformanceMetrics,
} from './optimization/performance-monitoring';

// === LEGACY EXPORTS (deprecated, use new paths) ===
// Note: Specialized domain components (Web3, Email, Fitness, Real Estate, etc.)
// have been moved to separate packages:
// - @sudobility/web3-components
// - @sudobility/email-components
// - @sudobility/fitness-components
// - @sudobility/realestate-components
// See migration guide for details.

// === DEFAULT EXPORT ===
import { cn } from './lib/utils';

export default {
  utils: {
    cn,
  },
};
