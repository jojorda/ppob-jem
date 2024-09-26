import React from 'react';

const PulsaInputNumber = ({ phoneNumber, handlePhoneNumberChange, error }) => {
  return (
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
      <div className="relative">
        <input
          type="number"  
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          pattern="[0-9]*" 
          placeholder="08x"
          className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-red-500 border-red-500' : 'focus:ring-sky-500 border-gray-300'
          } shadow-sm`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default PulsaInputNumber;
