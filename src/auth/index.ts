// Context and hooks
export {
  AuthProvider,
  useAuthStatus,
  createDefaultErrorTexts,
} from './context/auth-provider';

// Components
export {
  AuthModal,
  AuthInline,
  AuthAction,
  AuthContent,
  Avatar,
  UserMenu,
  ProviderButtons,
  EmailSignInForm,
  EmailSignUpForm,
  ForgotPasswordForm,
} from './components';

// Types
export type {
  // Firebase config
  FirebaseConfig,
  FirebaseAuthConfig,
  // Provider types
  AuthProviderType,
  AuthProvidersConfig,
  // User types
  AuthUser,
  // Text types (i18n)
  AuthTexts,
  AuthErrorTexts,
  // Callbacks
  AuthCallbacks,
  // Context value
  AuthContextValue,
  // Component props
  AuthProviderProps,
  AuthMode,
  AuthModalProps,
  AuthInlineProps,
  AuthMenuItem,
  AuthActionProps,
  AvatarProps,
  AuthContentProps,
  EmailSignInFormProps,
  EmailSignUpFormProps,
  ForgotPasswordFormProps,
  ProviderButtonsProps,
} from './types';
