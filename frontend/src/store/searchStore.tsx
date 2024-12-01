// searchStore.ts
import {create} from 'zustand';

interface SearchStore {
  searchQuery: string;
  selectedCategory: string;
  isLikedFilter: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  toggleLikedFilter: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: '',
  selectedCategory: '',
  isLikedFilter: false,
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (category: string) => set({ selectedCategory: category }),
  toggleLikedFilter: () => set((state) => ({ isLikedFilter: !state.isLikedFilter })),
}));
