import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../Card';

const paymentMethods = [
  { id: 'gopay', name: 'GoPay', icon: '💳', color: 'bg-blue-100' },
  { id: 'ovo', name: 'OVO', icon: '💳', color: 'bg-purple-100' },
  { id: 'dana', name: 'DANA', icon: '💳', color: 'bg-indigo-100' },
  { id: 'linkaja', name: 'LinkAja', icon: '💳', color: 'bg-red-100' },
  { id: 'bca', name: 'BCA Virtual Account', icon: '🏦', color: 'bg-green-100' },
  { id: 'mandiri', name: 'Mandiri Virtual Account', icon: '🏦', color: 'bg-yellow-100' },
];

const MetodePembayaranPulsa = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { provider, denomination, phoneNumber } = location.state || {};
  const [selectedMethod, setSelectedMethod] = useState('');
  const [error, setError] = useState('');

  const handleSelection = (methodId) => {
    setSelectedMethod(methodId);
    setError(''); // Reset error on selection
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    if (selectedMethod) {
      navigate('/confirmation-pulsa', {
        state: {
          selectedMethod,
          amount: denomination.amount,
          accountNumber: phoneNumber,
          provider,
        },
      });
    } else {
      setError('Silakan pilih metode pembayaran.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center p-2">
          <button onClick={handleBack} className="mr-4" aria-label="Back">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Metode Pembayaran</h1>
        </div>
      </div>
      <Card className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Pilih Metode Pembayaran</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
            {error}
          </div>
        )}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`w-full p-4 flex items-center justify-between text-left rounded-lg transition-all duration-200 transform hover:scale-105 ${method.color} hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                selectedMethod === method.id ? 'ring-2 ring-sky-600' : ''
              }`}
              onClick={() => handleSelection(method.id)}
              aria-label={`Pilih ${method.name}`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{method.icon}</span>
                <span className="font-medium text-gray-700">{method.name}</span>
              </div>
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
        <button
          className="mt-6 w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition duration-300 ease-in-out"
          onClick={handleContinue}
          disabled={!selectedMethod}
        >
          Lanjutkan
        </button>
      </Card>
    </div>
  );
};

export default MetodePembayaranPulsa;
