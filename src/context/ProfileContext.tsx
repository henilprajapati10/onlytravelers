"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_PROFILE, type TravelerProfile } from "@/data/profile";
import { STORAGE_KEYS, readJson, writeJson } from "@/lib/storage";

interface ProfileContextValue {
  profile: TravelerProfile;
  updateProfile: (patch: Partial<TravelerProfile>) => void;
  resetProfile: () => void;
  isHydrated: boolean;
  /** True once they have told us anything at all. */
  hasProfile: boolean;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<TravelerProfile>(DEFAULT_PROFILE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const stored = readJson<Partial<TravelerProfile> | null>(STORAGE_KEYS.profile, null);
    if (stored && typeof stored === "object") {
      setProfile({ ...DEFAULT_PROFILE, ...stored, interests: stored.interests ?? [] });
      setHasProfile(true);
    }
    setIsHydrated(true);
  }, []);

  const updateProfile = useCallback((patch: Partial<TravelerProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      writeJson(STORAGE_KEYS.profile, next);
      return next;
    });
    setHasProfile(true);
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    writeJson(STORAGE_KEYS.profile, DEFAULT_PROFILE);
    setHasProfile(false);
  }, []);

  const value = useMemo(
    () => ({ profile, updateProfile, resetProfile, isHydrated, hasProfile }),
    [profile, updateProfile, resetProfile, isHydrated, hasProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}
