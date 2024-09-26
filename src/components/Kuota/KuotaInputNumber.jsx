import React from 'react';

const KuotaInputNumber = ({ value, onChange, errorMessage }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">Nomor HP</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-3 border rounded-lg ${errorMessage ? 'border-red-500' : 'border-gray-300'}`}
      placeholder="Masukkan nomor HP"
    />
    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
  </div>
);

export default KuotaInputNumber;
