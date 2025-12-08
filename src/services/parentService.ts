import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { COLLECTIONS, ChildProfile, CreateChildProfile, UpdateChildProfile } from '@shared/index'; // Assuming alias is set up or relative path
// Note: if @shared alias isn't working, I'll fix imports. For now using relative path in next write if needed.

const USERS_COLLECTION = 'users';
const CHILDREN_COLLECTION = 'children';

export const getChildren = async (parentId: string): Promise<ChildProfile[]> => {
  const childrenRef = collection(db, USERS_COLLECTION, parentId, CHILDREN_COLLECTION);
  const snapshot = await getDocs(childrenRef);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as ChildProfile));
};

export const addChild = async (parentId: string, childData: CreateChildProfile): Promise<ChildProfile> => {
  const childrenRef = collection(db, USERS_COLLECTION, parentId, CHILDREN_COLLECTION);
  
  const newChildData = {
    ...childData,
    parentId,
    totalStars: 0,
    unlockedGames: ['simple-match', 'ocean-dash', 'pollution-patrol'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(childrenRef, newChildData);
  
  // We return the data with the new ID, but timestamps will be server objects until re-fetched.
  // For UI responsiveness, we can mock the dates or fetch again.
  return {
    id: docRef.id,
    ...newChildData,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as ChildProfile;
};

export const updateChild = async (parentId: string, childId: string, updates: UpdateChildProfile) => {
  const childRef = doc(db, USERS_COLLECTION, parentId, CHILDREN_COLLECTION, childId);
  
  await updateDoc(childRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteChild = async (parentId: string, childId: string) => {
  const childRef = doc(db, USERS_COLLECTION, parentId, CHILDREN_COLLECTION, childId);
  await deleteDoc(childRef);
};
