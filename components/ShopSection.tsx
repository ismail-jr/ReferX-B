"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import Image from "next/image";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number; // cost in points
  image?: string;
}

interface ProjectShopSectionProps {
  points: number;
  items: ShopItem[];
  onClaim: (item: ShopItem) => Promise<void> | void;
}

export default function ShopSection({
  points,
  items,
  onClaim,
}: ProjectShopSectionProps) {
  const [claimingItemId, setClaimingItemId] = useState<string | null>(null);
  const rewardAmount = (points * 0.5).toFixed(2);

  const handleClaim = async (item: ShopItem) => {
    setClaimingItemId(item.id);
    try {
      await onClaim(item);
    } finally {
      setClaimingItemId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-blue-900 mb-4">
        Shop with Your Points
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        You have <span className="font-bold">{points}</span> points (
        <span className="text-green-700 font-semibold">₵{rewardAmount}</span>).
        Spend them below.
      </p>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          No items available in the shop at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const itemCostInCedis = (item.cost * 0.5).toFixed(2);
            const canAfford = points >= item.cost;
            const isClaiming = claimingItemId === item.id;

            return (
              <div
                key={item.id}
                className="border rounded-xl p-4 shadow-sm flex flex-col justify-between bg-white transition hover:shadow-md"
              >
                <div>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="text-md font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-700">
                    ₵{itemCostInCedis}
                  </span>
                  <button
                    disabled={!canAfford || isClaiming}
                    onClick={() => handleClaim(item)}
                    className="bg-blue-700 text-white text-sm px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClaiming ? (
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                    ) : (
                      <Gift className="w-4 h-4" />
                    )}
                    {isClaiming ? "Claiming..." : "Claim"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
