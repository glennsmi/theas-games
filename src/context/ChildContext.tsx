import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/config/firebase';
import { getChildren } from '@/services/parentService';
import { ChildProfile } from '@shared/schemas/child';
import { onAuthStateChanged } from 'firebase/auth';

interface ChildContextType {
  childrenProfiles: ChildProfile[];
  activeChild: ChildProfile | null;
  activeChildId: string | null;
  setActiveChildId: (id: string | null) => void;
  refreshChildren: () => Promise<void>;
  loading: boolean;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [childrenProfiles, setChildrenProfiles] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(() => {
    return localStorage.getItem('activeChildId');
  });
  const [loading, setLoading] = useState(true);

  const refreshChildren = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const fetchedChildren = await getChildren(user.uid);
        setChildrenProfiles(fetchedChildren);
        
        // If we have an active ID but it's not in the fetched list (deleted?), reset it
        if (activeChildId && !fetchedChildren.find(c => c.id === activeChildId)) {
          setActiveChildId(null);
          localStorage.removeItem('activeChildId');
        }
        
        // Optional: Auto-select first child if none selected? 
        // For now, let's keep it manual or null (Parent mode)
        
      } catch (error) {
        console.error('Error fetching children:', error);
      }
    } else {
      setChildrenProfiles([]);
      setActiveChildId(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        refreshChildren();
      } else {
        setChildrenProfiles([]);
        setActiveChildId(null);
        localStorage.removeItem('activeChildId');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync active ID to local storage
  useEffect(() => {
    if (activeChildId) {
      localStorage.setItem('activeChildId', activeChildId);
    } else {
      localStorage.removeItem('activeChildId');
    }
  }, [activeChildId]);

  const activeChild = childrenProfiles.find(c => c.id === activeChildId) || null;

  return (
    <ChildContext.Provider value={{
      childrenProfiles,
      activeChild,
      activeChildId,
      setActiveChildId,
      refreshChildren,
      loading
    }}>
      {children}
    </ChildContext.Provider>
  );
};

export const useChild = () => {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};
