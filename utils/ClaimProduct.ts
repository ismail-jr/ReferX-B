// utils/claimProduct.ts
import { doc, getDoc, updateDoc, setDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";

export const claimProduct = async (
  user: User,
  productId: string,
  productPrice: number,
  productName: string,
  imageUrl?: string
) => {
  if (!user?.uid) return { success: false, message: "Not authenticated." };

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return { success: false, message: "User not found." };
  }

  const userData = userSnap.data();
  const currentPoints = userData.points || 0;

  if (currentPoints < productPrice) {
    return {
      success: false,
      message: `You need ${productPrice} points to claim this.`,
    };
  }

  try {
    // Deduct points
    await updateDoc(userRef, {
      points: currentPoints - productPrice,
    });

    // Record the claim
    const claimRef = doc(collection(db, "claims"));
    await setDoc(claimRef, {
      userId: user.uid,
      userEmail: user.email,
      productId,
      productName,
      imageUrl: imageUrl || null,
      pointsSpent: productPrice,
      claimedAt: new Date(),
    });

    return {
      success: true,
      message: `You successfully claimed ${productName}!`,
    };
  } catch (error) {
    console.error("Claim failed:", error);
    return { success: false, message: "Failed to claim item." };
  }
};
