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
      setAuthToken: (token) => set({ token }), 
    }),
    {
      //@ts-ignore
      getStorage: () => localStorage, 
    }
  )
);

export default useAuthStore;
