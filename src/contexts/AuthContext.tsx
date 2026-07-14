import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { currentUser } from '../data/mockData';
import { getLocalProfile, saveLocalProfile } from '../services/storage';
import type { UserProfile } from '../types';

interface AuthContextValue {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => getLocalProfile(currentUser));

  const updateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    saveLocalProfile(updatedProfile);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      updateProfile,
    }),
    [profile],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
