"use client";

import { useState } from "react";
import ImageUpload from "../ImageUpload";

export default function MultiImageUpload({ label, images = [], onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  const imageArray = typeof images === 'string' ? JSON.parse(images || '[]') : images;

  const handleAdd = (url) => {
    const updated = [...imageArray, url];
    onChange(JSON.stringify(updated));
    setIsAdding(false);
  };

  const handleRemove = (index) => {
    const updated = imageArray.filter((_, i) => i !== index);
    onChange(JSON.stringify(updated));
  };

  const handleReorder = (index, direction) => {
    const updated = [...imageArray];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < updated.length) {
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      onChange(JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white/80">{label}</label>

      {/* Current Images */}
      <div className="space-y-2">
        {imageArray.map((url, index) => (
          <div key={index} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
            <img src={url} alt={`House ${index + 1}`} className="h-16 w-16 rounded object-cover" />
            <div className="flex-1 truncate text-xs text-white/60">{url}</div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleReorder(index, 'up')}
                disabled={index === 0}
                className="rounded bg-white/10 p-1 text-white/60 hover:bg-white/20 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => handleReorder(index, 'down')}
                disabled={index === imageArray.length - 1}
                className="rounded bg-white/10 p-1 text-white/60 hover:bg-white/20 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="rounded bg-red-500/20 p-1 text-red-400 hover:bg-red-500/30"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Image */}
      {isAdding ? (
        <div className="space-y-2">
          <ImageUpload
            label="Add New Image"
            value=""
            onChange={handleAdd}
            placeholder="Upload a house image"
          />
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="text-xs text-white/50 hover:text-white/80"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full rounded-lg border border-dashed border-white/20 bg-white/5 p-4 text-sm text-white/60 transition-colors hover:border-gold hover:text-gold"
        >
          + Add Image
        </button>
      )}
    </div>
  );
}
