import React from 'react';

const Pln = ({ nominal, isSelected, onClick }) => {
  const { value, admin } = nominal;
  const total = value + admin;

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-3 shadow-lg cursor-pointer transition-all duration-200 ${
        isSelected ? 'border-sky-500 bg-sky-100' : 'hover:border-gray-300'
      }`}
    >
      <div className="font-bold">Rp {value.toLocaleString()}</div>
      <div className="text-sm text-gray-600">Rp {total.toLocaleString()}</div>
    </div>
  );
};

export default Pln;
