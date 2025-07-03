// app/api/shop-items/route.ts
import { db, collection, getDocs } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "shopItems"));
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch shop items:", error);
    return NextResponse.json(
      { error: "Failed to fetch shop items" },
      { status: 500 }
    );
  }
}
