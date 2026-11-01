import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signInAnonymously as firebaseSignInAnonymously,
} from 'firebase/auth';
import type {
  AuthProviderProps,
  AuthContextValue,
  AuthUser,
  AuthErrorTexts,
} from '../types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Convert Firebase User to AuthUser
 */
function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
    emailVerified: user.emailVerified,
    providerId: user.providerData[0]?.providerId ?? null,
  };
}

/**
 * AuthProvider component - provides authentication context to the app
 */
export function AuthProvider({
  children,
  firebaseConfig,
  providerConfig,
  texts,
  errorTexts,
  callbacks,
  resolveErrorMessage,
}: AuthProviderProps) {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const explicitSignOutRef = useRef(false);

  // Error message resolver - defined before useEffect that uses it
  const getErrorMessage = useCallback(
    (code: string): string => {
      if (resolveErrorMessage) {
        return resolveErrorMessage(code);
      }
      return (
        (errorTexts as unknown as Record<string, string>)[code] ||
        errorTexts.default
      );
    },
    [resolveErrorMessage, errorTexts]
  );

  // Initialize Firebase Auth
  useEffect(() => {
    let authInstance: Auth;

    if (firebaseConfig.type === 'instance') {
      authInstance = firebaseConfig.auth;
    } else {
      const app =
        getApps().length > 0 ? getApp() : initializeApp(firebaseConfig.config);
      authInstance = getAuth(app);
    }

    setAuth(authInstance);

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(
      authInstance,
      async firebaseUser => {
        if (firebaseUser) {
          explicitSignOutRef.current = false;
          const authUser = mapFirebaseUser(firebaseUser);
          setUser(authUser);
          setLoading(false);

          // Close modal on successful non-anonymous auth
          if (!firebaseUser.isAnonymous) {
            setIsModalOpen(false);
            callbacks?.onSignIn?.(authUser);
          }
        } else if (
          providerConfig.enableAnonymous &&
          !explicitSignOutRef.current
        ) {
          // No user - sign in anonymously if enabled (skip after explicit sign out)
          try {
            await firebaseSignInAnonymously(authInstance);
          } catch (err) {
            console.error('Anonymous sign in error:', err);
            setLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      },
      err => {
        console.error('Auth state change error:', err);
        const firebaseError = err as { code?: string };
        setError(getErrorMessage(firebaseError.code || 'default'));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [
    firebaseConfig,
    providerConfig.enableAnonymous,
    callbacks,
    getErrorMessage,
  ]);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    if (!auth) return;

    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      if (providerConfig.googleScopes) {
        providerConfig.googleScopes.forEach(scope => provider.addScope(scope));
      }
      await signInWithPopup(auth, provider);
    } catch (err) {
      const firebaseError = err as { code?: string; message?: string };
      const errorMessage = getErrorMessage(firebaseError.code || 'default');
      setError(errorMessage);
      callbacks?.onError?.(err as Error, firebaseError.code);
    } finally {
      setLoading(false);
    }
  }, [auth, providerConfig.googleScopes, getErrorMessage, callbacks]);

  // Sign in with Apple
  const signInWithApple = useCallback(async () => {
    if (!auth) return;

    setError(null);
    setLoading(true);

    try {
      const provider = new OAuthProvider('apple.com');
      if (providerConfig.appleScopes) {
        providerConfig.appleScopes.forEach(scope => provider.addScope(scope));
      } else {
        provider.addScope('email');
        provider.addScope('name');
      }
      await signInWithPopup(auth, provider);
    } catch (err) {
      const firebaseError = err as { code?: string; message?: string };
      const errorMessage = getErrorMessage(firebaseError.code || 'default');
      setError(errorMessage);
      callbacks?.onError?.(err as Error, firebaseError.code);
    } finally {
      setLoading(false);
    }
  }, [auth, providerConfig.appleScopes, getErrorMessage, callbacks]);

  // Sign in with email/password
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!auth) return;

      setError(null);
      setLoading(true);

      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        const firebaseError = err as { code?: string; message?: string };
        const errorMessage = getErrorMessage(firebaseError.code || 'default');
        setError(errorMessage);
        callbacks?.onError?.(err as Error, firebaseError.code);
      } finally {
        setLoading(false);
      }
    },
    [auth, getErrorMessage, callbacks]
  );

  // Sign up with email/password
  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      if (!auth) return;

      setError(null);
      setLoading(true);

      try {
        const { user: newUser } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (displayName && newUser) {
          await updateProfile(newUser, { displayName });
        }
      } catch (err) {
        const firebaseError = err as { code?: string; message?: string };
        const errorMessage = getErrorMessage(firebaseError.code || 'default');
        setError(errorMessage);
        callbacks?.onError?.(err as Error, firebaseError.code);
      } finally {
        setLoading(false);
      }
    },
    [auth, getErrorMessage, callbacks]
  );

  // Reset password
  const resetPassword = useCallback(
    async (email: string) => {
      if (!auth) return;

      setError(null);
      setLoading(true);

      try {
        await sendPasswordResetEmail(auth, email);
      } catch (err) {
        const firebaseError = err as { code?: string; message?: string };
        const errorMessage = getErrorMessage(firebaseError.code || 'default');
        setError(errorMessage);
        callbacks?.onError?.(err as Error, firebaseError.code);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [auth, getErrorMessage, callbacks]
  );

  // Sign out
  const signOut = useCallback(async () => {
    if (!auth) return;

    setError(null);
    explicitSignOutRef.current = true;

    try {
      await firebaseSignOut(auth);
      callbacks?.onSignOut?.();
    } catch (err) {
      explicitSignOutRef.current = false;
      const firebaseError = err as { code?: string; message?: string };
      const errorMessage = getErrorMessage(firebaseError.code || 'default');
      setError(errorMessage);
      callbacks?.onError?.(err as Error, firebaseError.code);
    }
  }, [auth, getErrorMessage, callbacks]);

  // Sign in anonymously
  const signInAnonymously = useCallback(async () => {
    if (!auth) return;

    setError(null);
    setLoading(true);

    try {
      await firebaseSignInAnonymously(auth);
    } catch (err) {
      const firebaseError = err as { code?: string; message?: string };
      const errorMessage = getErrorMessage(firebaseError.code || 'default');
      setError(errorMessage);
      callbacks?.onError?.(err as Error, firebaseError.code);
    } finally {
      setLoading(false);
    }
  }, [auth, getErrorMessage, callbacks]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Modal controls
  const openModal = useCallback(() => {
    setError(null);
    setIsModalOpen(true);
    callbacks?.onModalOpen?.();
  }, [callbacks]);

  const closeModal = useCallback(() => {
    setError(null);
    setIsModalOpen(false);
    callbacks?.onModalClose?.();
  }, [callbacks]);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: !!user,
      isAnonymous: user?.isAnonymous ?? false,
      signInWithGoogle,
      signInWithApple,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
      signInAnonymously,
      clearError,
      isModalOpen,
      openModal,
      closeModal,
      texts,
      providerConfig,
    }),
    [
      user,
      loading,
      error,
      signInWithGoogle,
      signInWithApple,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
      signInAnonymously,
      clearError,
      isModalOpen,
      openModal,
      closeModal,
      texts,
      providerConfig,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth status and methods
 */
export function useAuthStatus(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthStatus must be used within an AuthProvider');
  }
  return context;
}

/**
 * Create default English error texts
 */
export function createDefaultErrorTexts(): AuthErrorTexts {
  return {
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-email': 'Invalid email address',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed':
      'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Sign in cancelled',
    'auth/popup-blocked': 'Popup was blocked. Please allow popups.',
    'auth/account-exists-with-different-credential':
      'An account already exists with a different sign-in method',
    'auth/operation-not-allowed': 'This sign-in method is not enabled',
    default: 'Something went wrong. Please try again.',
  };
}
