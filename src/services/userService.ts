import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

export const updateUserPearls = async (userId: string, amount: number) => {
  if (!userId) return

  const userRef = doc(db, 'users', userId)

  try {
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      await updateDoc(userRef, {
        pearls: increment(amount),
        totalGamesPlayed: increment(1),
        lastPlayedAt: new Date()
      })
    } else {
      // Create user doc if it doesn't exist (though auth usually handles this, good fallback)
      await setDoc(userRef, {
        pearls: amount,
        totalGamesPlayed: 1,
        createdAt: new Date(),
        lastPlayedAt: new Date()
      }, { merge: true })
    }
    console.log(`Updated user ${userId} with ${amount} pearls`)
  } catch (error) {
    console.error('Error updating user pearls:', error)
  }
}
