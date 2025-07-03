"use client";

import { useState } from "react";
import { db, collection, addDoc } from "@/lib/firebase";
import { toast } from "react-hot-toast";

export default function AdminProductForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    cost: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.cost) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "shopItems"), {
        name: form.name,
        description: form.description,
        cost: Number(form.cost),
        image: form.image || null,
        createdAt: new Date(),
      });

      toast.success("Product added successfully!");
      setForm({ name: "", description: "", cost: "", image: "" });
    } catch (err) {
      toast.error("Failed to add product.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-md mx-auto border border-gray-100"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Add New Shop Product
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter product description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="cost"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cost (points)
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            placeholder="Enter cost in points"
            value={form.cost}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="0"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Image URL (optional)
          </label>
          <input
            type="url"
            id="image"
            name="image"
            placeholder="https://example.com/image.jpg"
            value={form.image}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors mt-4"
      >
        {loading ? (
          <span className="inline-flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding...
          </span>
        ) : (
          "Add Product"
        )}
      </button>
    </form>
  );
}
