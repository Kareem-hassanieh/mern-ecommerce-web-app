import {create} from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setAuthToken: (token: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null, 
      setAuthToken: (token) => set({ token }), // Action to set the token
    }),
    {
      name: 'auth-token', // The name of the storage key in localStorage (or sessionStorage)
      //@ts-ignore
      getStorage: () => localStorage, // Use localStorage to persist the token
    }
  )
);

export default useAuthStore;
