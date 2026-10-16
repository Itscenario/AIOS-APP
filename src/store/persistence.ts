import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './index';
import { setCredentials, setProfile, UserProfile } from './slices/authSlice';

const STORAGE_KEY = '@aios/profile/v1';
let initialization: Promise<void> | undefined;
let writes: Promise<void> = Promise.resolve();

export function waitForProfileSave(): Promise<void> {
  return writes;
}

export function restoreSavedProfile(): Promise<void> {
  if (initialization) return initialization;
  initialization = (async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved) as { version: number; profile: UserProfile; isAuthenticated: boolean };
        if (data.version === 1 && data.profile && typeof data.profile === 'object' && !Array.isArray(data.profile)) {
          if (data.isAuthenticated) store.dispatch(setCredentials({ user: data.profile }));
          else store.dispatch(setProfile(data.profile));
        }
      }
    } catch (error) {
      console.warn('Could not restore saved profile', error);
    }

    let previous: string | null = null;
    const persistProfile = () => {
      const { profile, isAuthenticated } = store.getState().auth;
      const serialized = profile ? JSON.stringify({ version: 1, profile, isAuthenticated }) : '';
      if (serialized === previous) return;
      previous = serialized;
      // Serialize writes so logout cannot be overwritten by an older profile save.
      writes = writes.then(() => serialized
        ? AsyncStorage.setItem(STORAGE_KEY, serialized)
        : AsyncStorage.removeItem(STORAGE_KEY)
      ).catch((error) => console.warn('Could not save profile', error));
    };
    store.subscribe(persistProfile);
    persistProfile();
  })();
  return initialization;
}
