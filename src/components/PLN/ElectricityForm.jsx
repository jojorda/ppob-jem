import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pln from './Pln';
import Card from '../Card';

const ElectricityForm = () => {
  const [selectedOperator, setSelectedOperator] = useState('Token Listrik');
  const [selectedNominal, setSelectedNominal] = useState(null);
  const [meteranId, setMeteranId] = useState('');
  const [meteranIdError, setMeteranIdError] = useState('');
  const [notification, setNotification] = useState('');
  const [nominals, setNominals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNominals = async () => {
      try {
        const response = await fetch('https://api.beetpos.com/api/v1/kios-product?category_id=8&page=1&per_page=1999');
        const data = await response.json();

        if (data && data.data) {
          const formattedNominals = data.data.map((item) => ({
            value: item.price,
            admin: 500,  // Assuming admin fee is constant
            name: item.name,  // Optional if you want to show the product name
          }));
          setNominals(formattedNominals);
        }
      } catch (error) {
        console.error('Error fetching nominals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNominals();
  }, []);

  const handleMeteranIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setMeteranId(value);
    setNotification('');

    if (value.length < 11 && value.length > 0) {
      setMeteranIdError('Nomor terlalu pendek | minimal 11 karakter');
    } else if (value.length > 12) {
      setMeteranIdError('Nomor terlalu panjang | maksimum 12 karakter');
    } else {
      setMeteranIdError('');
    }
  };

  const handleCheckMeteranId = () => {
    if (meteranId.length >= 11 && meteranId.length <= 12) {
      setNotification('Nomor valid! Anda bisa melanjutkan.');
    } else {
      setNotification('Nomor tidak valid! Periksa kembali nomor yang Anda masukkan.');
    }
  };

  const handlePaymentSelection = () => {
    if (meteranId.length >= 11 && selectedNominal) {
      navigate('/payment-selection', {
        state: {
          selectedNominal,
          meteranId,
          productType: 'electricity',
        },
      });
    } else {
      setMeteranIdError('Nomor harus minimal 11 digit dan pilih nominal');
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
      <div className="p-2 border-b flex items-center bg-blue-500">
        <button className="mr-4 text-white" onClick={() => navigate(-1)} aria-label="Back">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-white">Listrik PLN</h1>
      </div>
      <div className="p-4">
        <h2 className="text-sm text-gray-600 mb-2">Select Operator</h2>
        {['Token Listrik', 'Tagihan Listrik', 'PLN Non-Taglis'].map((op) => (
          <label key={op} className="flex items-center mb-2">
            <input
              type="radio"
              name="operator"
              value={op}
              checked={selectedOperator === op}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="mr-2 w-5 h-5 text-sky-500"
            />
            <span className="text-sm">{op}</span>
          </label>
        ))}
      </div>
      <div className="px-4 mb-4">
        <label className="block text-sm text-gray-600 mb-1">No. Meter/ID Pel</label>
        <div className="flex items-center relative">
          <input
            type="text"
            value={meteranId}
            onChange={handleMeteranIdChange}
            className="border rounded px-3 py-2 w-full pr-20 focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Meter/ID Input"
          />
          <button
            className="absolute right-2 bg-sky-500 text-white px-4 py-2 rounded"
            onClick={handleCheckMeteranId}
            aria-label="Check Meteran ID"
          >
            Cek
          </button>
        </div>
        {meteranIdError && (
          <span className="text-red-500 text-sm mt-1">{meteranIdError}</span>
        )}
        {notification && (
          <span
            className={`text-sm mt-1 ${notification.includes('tidak valid') ? 'text-red-500' : 'text-green-500'}`}
          >
            {notification}
          </span>
        )}
      </div>
      <div className="px-4 mb-4">
        <h2 className="text-sm text-gray-600 mb-2">Nominal</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {nominals.map((nominal) => (
              <Pln
                key={nominal.value}
                nominal={nominal}
                isSelected={selectedNominal === nominal.value}
                onClick={() => {
                  if (meteranId.length >= 11) {
                    setSelectedNominal(nominal.value);
                    setMeteranIdError('');
                  } else {
                    setMeteranIdError(
                      'Isi nomor meteran minimal 11 digit untuk memilih nominal.'
                    );
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="sticky bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Total Harga</p>
            <p className="text-xl font-bold">
              Rp{selectedNominal ? (selectedNominal + 500).toLocaleString() : 0}
            </p>
          </div>
          <button
            className={`bg-sky-500  text-white px-6 py-2 rounded-lg font-semibold transition duration-300 ${
              !selectedNominal || meteranId.length < 11
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-sky-600'
            }`}
            onClick={handlePaymentSelection}
            disabled={!selectedNominal || meteranId.length < 11}
            aria-label="Select Payment"
          >
            Pilih Pembayaran
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ElectricityForm;
