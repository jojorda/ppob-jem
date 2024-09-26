import React from 'react';

const KuotaPaketItem = ({ nama, harga, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 mb-2 border rounded-lg cursor-pointer ${
        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">{nama}</span>
        {/* <span className="text-sm text-gray-700">Rp{parseInt(harga).toLocaleString()}</span> */}
      </div>
      {isSelected && (
        <div className="text-xs text-blue-700 mt-2">
           <span className="text-lg font-bold">Rp {parseInt(harga).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default KuotaPaketItem;
