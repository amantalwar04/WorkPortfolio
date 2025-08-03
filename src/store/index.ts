import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  AppState, 
  User, 
  Portfolio, 
  GitHubRepository, 
  LinkedInProfile,
  PortfolioTheme,
  PortfolioSection
} from '../types';

interface AppStore extends AppState {
  // Actions
  setUser: (user: User | null) => void;
  setPortfolio: (portfolio: Portfolio | null) => void;
  setRepositories: (repositories: GitHubRepository[]) => void;
  setLinkedInProfile: (profile: LinkedInProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Portfolio specific actions
  updatePortfolioTheme: (theme: Partial<PortfolioTheme>) => void;
  updatePortfolioSection: (sectionId: string, data: any) => void;
  addPortfolioSection: (section: PortfolioSection) => void;
  removePortfolioSection: (sectionId: string) => void;
  reorderPortfolioSections: (sections: PortfolioSection[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  publishPortfolio: () => void;
  
  // User actions
  updateUserProfile: (updates: Partial<User>) => void;
  
  // Clear actions
  clearAll: () => void;
  clearError: () => void;
}

const initialState: AppState = {
  user: null,
  portfolio: null,
  repositories: [],
  linkedinProfile: null,
  loading: false,
  error: null,
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Basic setters
        setUser: (user) => set({ user }, false, 'setUser'),
        setPortfolio: (portfolio) => set({ portfolio }, false, 'setPortfolio'),
        setRepositories: (repositories) => set({ repositories }, false, 'setRepositories'),
        setLinkedInProfile: (linkedinProfile) => set({ linkedinProfile }, false, 'setLinkedInProfile'),
        setLoading: (loading) => set({ loading }, false, 'setLoading'),
        setError: (error) => set({ error }, false, 'setError'),
        
        // Portfolio theme updates
        updatePortfolioTheme: (themeUpdates) => {
          const { portfolio } = get();
          if (!portfolio) return;
          
          set({
            portfolio: {
              ...portfolio,
              theme: { ...portfolio.theme, ...themeUpdates },
              updatedAt: new Date().toISOString(),
            }
          }, false, 'updatePortfolioTheme');
        },
        
        // Portfolio section updates
        updatePortfolioSection: (sectionId, data) => {
          const { portfolio } = get();
          if (!portfolio) return;
          
          const updatedSections = portfolio.sections.map(section =>
            section.id === sectionId ? { ...section, data } : section
          );
          
          set({
            portfolio: {
              ...portfolio,
              sections: updatedSections,
              updatedAt: new Date().toISOString(),
            }
          }, false, 'updatePortfolioSection');
        },
        
        addPortfolioSection: (newSection) => {
          const { portfolio } = get();
          if (!portfolio) return;
          
          set({
            portfolio: {
              ...portfolio,
              sections: [...portfolio.sections, newSection],
              updatedAt: new Date().toISOString(),
            }
          }, false, 'addPortfolioSection');
        },
        
        removePortfolioSection: (sectionId) => {
          const { portfolio } = get();
          if (!portfolio) return;
          
          const updatedSections = portfolio.sections.filter(section => section.id !== sectionId);
          
          set({
            portfolio: {
              ...portfolio,
              sections: updatedSections,
              updatedAt: new Date().toISOString(),
            }
          }, false, 'removePortfolioSection');
        },
        
        reorderPortfolioSections: (sections) => {
          const { portfolio } = get();
          if (!portfolio) return;
          
          set({
            portfolio: {
              ...portfolio,
              sections,
              updatedAt: new Date().toISOString(),
            }
          }, false, 'reorderPortfolioSections');
        },
        
        toggleSectionVisibility: (sectionId) => {
          const { portfolio } = get();
          if (!portfolio) return;
          
          const updatedSections = portfolio.sections.map(section =>
            section.id === sectionId ? { ...section, visible: !section.visible } : section
          );
          
          set({
            portfolio: {
              ...portfolio,
              sections: updatedSections,
              updatedAt: new Date().toISOString(),
            }
          }, false, 'toggleSectionVisibility');
        },
        
        publishPortfolio: () => {
          const { portfolio } = get();
          if (!portfolio) return;
          
          set({
            portfolio: {
              ...portfolio,
              published: true,
              updatedAt: new Date().toISOString(),
            }
          }, false, 'publishPortfolio');
        },
        
        // User profile updates
        updateUserProfile: (updates) => {
          const { user } = get();
          if (!user) return;
          
          set({
            user: { ...user, ...updates }
          }, false, 'updateUserProfile');
        },
        
        // Clear functions
        clearAll: () => set(initialState, false, 'clearAll'),
        clearError: () => set({ error: null }, false, 'clearError'),
      }),
      {
        name: 'portfolio-app-storage',
        partialize: (state) => ({
          user: state.user,
          portfolio: state.portfolio,
        }),
      }
    ),
    {
      name: 'portfolio-app-store',
    }
  )
);

// Selectors for commonly used state combinations with safe defaults
export const useUser = () => useAppStore(state => state.user);
export const usePortfolio = () => useAppStore(state => state.portfolio);
export const useRepositories = () => useAppStore(state => state.repositories || []);
export const useLinkedInProfile = () => useAppStore(state => state.linkedinProfile);
export const useLoading = () => useAppStore(state => state.loading || false);
export const useError = () => useAppStore(state => state.error);

// Action selectors
export const useAppActions = () => useAppStore(state => ({
  setUser: state.setUser,
  setPortfolio: state.setPortfolio,
  setRepositories: state.setRepositories,
  setLinkedInProfile: state.setLinkedInProfile,
  setLoading: state.setLoading,
  setError: state.setError,
  updatePortfolioTheme: state.updatePortfolioTheme,
  updatePortfolioSection: state.updatePortfolioSection,
  addPortfolioSection: state.addPortfolioSection,
  removePortfolioSection: state.removePortfolioSection,
  reorderPortfolioSections: state.reorderPortfolioSections,
  toggleSectionVisibility: state.toggleSectionVisibility,
  publishPortfolio: state.publishPortfolio,
  updateUserProfile: state.updateUserProfile,
  clearAll: state.clearAll,
  clearError: state.clearError,
}));