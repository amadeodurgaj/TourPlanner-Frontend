import { useState, useCallback } from 'react';
import { UserService } from '@/services/UserService';
import type { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '@/types/api';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  success: string | null;
}

interface ProfileActions {
  loadProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<boolean>;
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>;
  clearMessages: () => void;
}

export function useProfileViewModel(): { state: ProfileState; actions: ProfileActions } {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: true,
    updating: false,
    error: null,
    success: null,
  });

  // ─── Load Profile ──────────────────────────────────────────────────────

  const loadProfile = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    try {
      const response = await UserService.getProfile();
      const profile = response.data ?? null;
      if (response.success && profile) {
        setState(prev => ({
          ...prev,
          profile,
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.message || 'Failed to load profile',
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load profile';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // ─── Update Profile ──────────────────────────────────────────────────

  const updateProfile = useCallback(async (data: UpdateProfileRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, updating: true, error: null, success: null }));
    try {
      const response = await UserService.updateProfile(data);
      const profile = response.data ?? null;
      if (response.success && profile) {
        setState(prev => ({
          ...prev,
          profile,
          updating: false,
          success: response.message || 'Profile updated successfully',
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          updating: false,
          error: response.message || 'Failed to update profile',
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setState(prev => ({
        ...prev,
        updating: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  // ─── Change Password ─────────────────────────────────────────────────

  const changePassword = useCallback(async (data: ChangePasswordRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, updating: true, error: null, success: null }));
    try {
      const response = await UserService.changePassword(data);
      if (response.success) {
        setState(prev => ({
          ...prev,
          updating: false,
          success: response.message || 'Password changed successfully',
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          updating: false,
          error: response.message || 'Failed to change password',
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      setState(prev => ({
        ...prev,
        updating: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  // ─── Clear messages ──────────────────────────────────────────────────

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  return {
    state,
    actions: { loadProfile, updateProfile, changePassword, clearMessages },
  };
}
