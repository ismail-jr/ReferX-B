"use client";

import Shop from "@/components/Shop";
import Sidebar from "@/components/Sidebar";
import React from "react";

function ShopPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar: fixed width on large screens, full width on small screens */}
      <div className="w-full lg:w-64">
        <Sidebar />
      </div>

      {/* Main content: full width and scrollable */}
      <div className="flex-1 overflow-y-auto p-4 pt-6">
        <Shop />
      </div>
    </div>
  );
}

export default ShopPage;
