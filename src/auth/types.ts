import type { Auth } from 'firebase/auth';
import type { ReactNode } from 'react';

// ============ Firebase Config ============

/**
 * Firebase configuration object
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
}

/**
 * Firebase auth configuration - either provide config to initialize or existing instance
 */
export type FirebaseAuthConfig =
  { type: 'config'; config: FirebaseConfig } | { type: 'instance'; auth: Auth };

// ============ Auth Provider Types ============

/**
 * Available authentication providers
 */
export type AuthProviderType = 'google' | 'apple' | 'email';

/**
 * Configuration for enabled auth providers
 */
export interface AuthProvidersConfig {
  /** Which providers to enable */
  providers: AuthProviderType[];
  /** Enable anonymous sign-in fallback */
  enableAnonymous?: boolean;
  /** Custom scopes for Google provider */
  googleScopes?: string[];
  /** Custom scopes for Apple provider */
  appleScopes?: string[];
}

// ============ User Types ============

/**
 * User information exposed by the auth context
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
  providerId: string | null;
}

// ============ Text Types (i18n) ============

/**
 * All text strings for auth components.
 * Consumer provides these for full i18n support.
 */
export interface AuthTexts {
  // Titles
  signInTitle: string;
  signInWithEmail: string;
  createAccount: string;
  resetPassword: string;

  // Buttons
  signIn: string;
  signUp: string;
  logout: string;
  login: string;
  continueWithGoogle: string;
  continueWithApple: string;
  continueWithEmail: string;
  sendResetLink: string;
  backToSignIn: string;
  close: string;

  // Labels
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;

  // Placeholders
  emailPlaceholder: string;
  passwordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  displayNamePlaceholder: string;

  // Links
  forgotPassword: string;
  noAccount: string;
  haveAccount: string;
  or: string;

  // Messages
  resetEmailSent: string;
  resetEmailSentDesc: string; // Supports {{email}} interpolation
  passwordMismatch: string;
  passwordTooShort: string;
  loading: string;
}

/**
 * Firebase error messages - parameterized for i18n
 * Maps Firebase error codes to translated messages
 */
export interface AuthErrorTexts {
  'auth/user-not-found': string;
  'auth/wrong-password': string;
  'auth/invalid-email': string;
  'auth/invalid-credential': string;
  'auth/email-already-in-use': string;
  'auth/weak-password': string;
  'auth/too-many-requests': string;
  'auth/network-request-failed': string;
  'auth/popup-closed-by-user': string;
  'auth/popup-blocked': string;
  'auth/account-exists-with-different-credential': string;
  'auth/operation-not-allowed': string;
  default: string;
}

// ============ Callbacks ============

/**
 * Event callbacks for auth operations
 */
export interface AuthCallbacks {
  /** Called after successful sign in */
  onSignIn?: (user: AuthUser) => void;
  /** Called after sign out */
  onSignOut?: () => void;
  /** Called on auth error */
  onError?: (error: Error, code?: string) => void;
  /** Called when modal is opened */
  onModalOpen?: () => void;
  /** Called when modal is closed */
  onModalClose?: () => void;
}

// ============ Context Value ============

/**
 * Value provided by AuthProvider context
 */
export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;

  // Auth methods
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInAnonymously: () => Promise<void>;

  // Error management
  clearError: () => void;

  // Modal controls
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // Texts (for child components)
  texts: AuthTexts;

  // Provider config (for child components)
  providerConfig: AuthProvidersConfig;
}

// ============ Component Props ============

/**
 * Props for AuthProvider component
 */
export interface AuthProviderProps {
  children: ReactNode;
  /** Firebase configuration */
  firebaseConfig: FirebaseAuthConfig;
  /** Provider configuration */
  providerConfig: AuthProvidersConfig;
  /** All text strings for i18n */
  texts: AuthTexts;
  /** Firebase error messages for i18n */
  errorTexts: AuthErrorTexts;
  /** Event callbacks */
  callbacks?: AuthCallbacks;
  /** Custom error message resolver (takes precedence over errorTexts) */
  resolveErrorMessage?: (code: string) => string;
}

/**
 * Auth UI mode
 */
export type AuthMode =
  'select' | 'email-signin' | 'email-signup' | 'forgot-password';

/**
 * Props for AuthModal component
 */
export interface AuthModalProps {
  /** Controlled mode: whether modal is open */
  open?: boolean;
  /** Controlled mode: close handler */
  onClose?: () => void;
  /** Initial mode to show */
  initialMode?: AuthMode;
  /** Custom class name for modal container */
  className?: string;
  /** Custom class name for backdrop */
  backdropClassName?: string;
  /** Custom class name for content */
  contentClassName?: string;
  /** Close on backdrop click (default: true) */
  closeOnBackdropClick?: boolean;
  /** Close on escape key (default: true) */
  closeOnEscape?: boolean;
  /** Custom header content */
  headerContent?: ReactNode;
  /** Custom footer content */
  footerContent?: ReactNode;
  /** Override which providers to show */
  providers?: AuthProviderType[];
  /** Optional tracking callback */
  onTrack?: (data: AuthTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Props for AuthInline component (non-modal version)
 */
export interface AuthInlineProps {
  /** Initial mode to show */
  initialMode?: AuthMode;
  /** Custom class name */
  className?: string;
  /** Which providers to show (defaults to providerConfig) */
  providers?: AuthProviderType[];
  /** Show title header (default: true) */
  showTitle?: boolean;
  /** Custom title (overrides texts) */
  title?: string;
  /** Compact layout (less padding/spacing) */
  compact?: boolean;
  /** Callback when auth mode changes */
  onModeChange?: (mode: AuthMode) => void;
  /** Callback when auth succeeds */
  onSuccess?: () => void;
  /** Card style variant */
  variant?: 'card' | 'flat' | 'bordered';
}

/**
 * Custom menu item for AuthAction dropdown
 */
export interface AuthMenuItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Optional icon */
  icon?: ReactNode;
  /** Show divider after this item */
  dividerAfter?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Props for AuthAction component (TopBar component)
 */
export interface AuthActionProps {
  /** Custom class name */
  className?: string;
  /** Custom class name for the login button */
  loginButtonClassName?: string;
  /** Button variant when not logged in */
  loginButtonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom login button content */
  loginButtonContent?: ReactNode;
  /** Avatar size in pixels (default: 32) */
  avatarSize?: number;
  /** Custom menu items (rendered above logout) */
  menuItems?: AuthMenuItem[];
  /** Show user info section in dropdown (default: true) */
  showUserInfo?: boolean;
  /** Custom user info renderer */
  renderUserInfo?: (user: AuthUser) => ReactNode;
  /** Custom avatar renderer */
  renderAvatar?: (user: AuthUser) => ReactNode;
  /** Dropdown alignment */
  dropdownAlign?: 'left' | 'right';
  /** Callback when login button clicked */
  onLoginClick?: () => void | boolean;
  /** Callback when logout clicked */
  onLogoutClick?: () => void;
  /** Optional tracking callback */
  onTrack?: (data: AuthTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Props for Avatar component
 */
export interface AvatarProps {
  /** User to display avatar for */
  user: AuthUser;
  /** Size in pixels (default: 32) */
  size?: number;
  /** Custom class name */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Props for internal AuthContent component
 */
export interface AuthContentProps {
  /** Current auth mode */
  mode: AuthMode;
  /** Mode change handler */
  onModeChange: (mode: AuthMode) => void;
  /** Override providers */
  providers?: AuthProviderType[];
  /** Success callback */
  onSuccess?: () => void;
  /** Compact layout */
  compact?: boolean;
}

/**
 * Props for form components
 */
export interface EmailSignInFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
  onSuccess?: () => void;
  compact?: boolean;
  /** Optional tracking callback */
  onTrack?: (data: AuthTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

export interface EmailSignUpFormProps {
  onSwitchToSignIn: () => void;
  onSuccess?: () => void;
  compact?: boolean;
  /** Optional tracking callback */
  onTrack?: (data: AuthTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

export interface ForgotPasswordFormProps {
  onSwitchToSignIn: () => void;
  compact?: boolean;
  /** Optional tracking callback */
  onTrack?: (data: AuthTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Props for ProviderButtons component
 */
export interface ProviderButtonsProps {
  providers: AuthProviderType[];
  onEmailClick: () => void;
  compact?: boolean;
  /** Optional tracking callback */
  onTrack?: (data: AuthTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

// ============ Tracking Types ============

/** Tracking data for auth component actions */
export interface AuthTrackingData {
  action:
    | 'login_click'
    | 'logout_click'
    | 'provider_click'
    | 'modal_close'
    | 'form_submit'
    | 'switch_mode';
  trackingLabel?: string;
  componentName?: string;
}
