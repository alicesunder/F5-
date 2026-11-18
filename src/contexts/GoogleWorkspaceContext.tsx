import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
} from '../services/googleAuthService';

interface GoogleWorkspaceContextType {
  isConnected: boolean;
  googleUser: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  connectGoogle: () => Promise<boolean>;
  disconnectGoogle: () => Promise<void>;
  requireAuth: () => boolean;
}

const GoogleWorkspaceContext = createContext<GoogleWorkspaceContextType | undefined>(undefined);

export const GoogleWorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setIsLoading(false);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const connectGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setAccessToken(result.accessToken);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Google Workspace connect error:', err);
      setError(err.message || 'การเชื่อมต่อ Google Workspace ขัดข้อง');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectGoogle = async () => {
    setIsLoading(true);
    try {
      await logoutGoogle();
      setGoogleUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const requireAuth = (): boolean => {
    return !!accessToken;
  };

  return (
    <GoogleWorkspaceContext.Provider
      value={{
        isConnected: !!accessToken && !!googleUser,
        googleUser,
        accessToken,
        isLoading,
        error,
        connectGoogle,
        disconnectGoogle,
        requireAuth,
      }}
    >
      {children}
    </GoogleWorkspaceContext.Provider>
  );
};

export const useGoogleWorkspace = () => {
  const context = useContext(GoogleWorkspaceContext);
  if (!context) {
    throw new Error('useGoogleWorkspace must be used within a GoogleWorkspaceProvider');
  }
  return context;
};
