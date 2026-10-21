import { formatProfileName } from '../../utils/profileName';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id?: string;
  avatar?: string | null;
  photographName?: string;
  title?: string;
  surname?: string;
  firstName?: string;
  name?: string;
  gender?: string;
  dob?: string;
  phone?: string;
  houseNo?: string;
  street?: string;
  landmark?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  email?: string;
  membershipId?: string;
  // Set to active only after membership payment is verified by the server.
  membershipStatus?: 'pending' | 'active' | 'expired';
  // Conference registration completion is independent of society membership.
  conferenceRegistrations?: Record<string, 'pending' | 'completed'>;
  nationality?: string;
  passportNo?: string;
  memberType?: string;
  institution?: string;
  speciality?: string;
  specialities?: string[];
  organizationType?: string;
  biodata?: string;
}

export type User = UserProfile;

export interface AuthState {
  user: UserProfile | null;
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserProfile; token?: string }>
    ) => {
      state.user = action.payload.user;
      state.profile = { ...action.payload.user, name: formatProfileName(action.payload.user.name || [action.payload.user.title, action.payload.user.firstName, action.payload.user.surname].filter(Boolean).join(' ')) };
      if (state.profile?.name) state.profile.name = formatProfileName(state.profile.name);
      state.user = state.profile;
      state.token = action.payload.token ?? state.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.user = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...(state.profile || {}), ...action.payload };
      state.user = { ...(state.user || {}), ...action.payload };
    },
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.profile = { ...(state.profile || {}), ...action.payload };
      }
    },
  },
});

export const {
  setCredentials,
  setProfile,
  updateProfile,
  logout,
  setAuthLoading,
  setAuthError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
