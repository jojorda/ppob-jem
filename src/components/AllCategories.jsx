import React, { useState, useEffect } from 'react';

const AllCategories = ({ categories, onSubCategoryClick, onBackClick, isLoading }) => {
  return (
    <div className="max-w-md mx-auto p-2 flex flex-col justify-between">
      {isLoading ? (
        <p>Memuat sub-kategori...</p>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSubCategoryClick(category.id)}
              className="py-2 px-4 text-black border p-4 rounded-lg shadow rounded-lg hover:bg-sky-300 transition-colors text-sm font-medium flex flex-col items-center justify-center"
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : (
        <p>Tidak ada sub-kategori tersedia.</p>
      )}

      
    </div>
  );
};

export default AllCategories;