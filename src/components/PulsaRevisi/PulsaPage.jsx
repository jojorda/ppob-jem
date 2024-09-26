import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneNumberInput from './PulsaInputNumber';
import DenominationButtons from './PulsaNominal';
import TotalPrice from './PulsaTotal';

const PulsaPage = () => {
  const navigate = useNavigate();
  const [denomination, setDenomination] = useState({ harga: null, productCode: '' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const handleDenominationSelect = (harga, productCode) => {
    setDenomination({ harga, productCode });
  };

  useEffect(() => {
    // Fetch data from API
    fetch('https://api.beetpos.com/api/v1/kios-product?category_id=1&page=1&per_page=1999')
      .then(response => response.json())
      .then(data => {
        setProducts(data.data);
        setFilteredProducts(data.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    // Apply filtering
    const filtered = products.filter(product => {
      const isInPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      const isInProvider = selectedProvider ? product.Kios_Sub_Category.name === selectedProvider : true;
      return isInPriceRange && isInProvider;
    });
    setFilteredProducts(filtered);
  }, [selectedProvider, priceRange, products]);

  const handleProviderChange = (event) => {
    setSelectedProvider(event.target.value);
  };

  const handlePhoneNumberChange = (number) => {
    const input = number.replace(/[^0-9]/g, '');
    setPhoneNumber(input);

    if (input && !input.startsWith('08')) {
      setError('Nomor HP harus dimulai dengan "08".');
    } else if (input.length < 10) {
      setError('Nomor HP terlalu pendek.');
    } else if (input.length > 20) {
      setError('Nomor HP terlalu panjang.');
    } else {
      setError('');
    }

    if (input.startsWith('081')) {
      setProvider('Telkomsel');
    } else if (input.startsWith('089')) {
      setProvider('Three');
    } else if (input.startsWith('088')) {
      setProvider('Smartfren');
    } else {
      setProvider(''); // Reset provider if no match
    }
  };

  const handleBack = () => navigate('/');

  const handleVerification = () => {
    if (isDenominationSelected && isPhoneNumberValid) {
      navigate(`/metode-payment/pulsa`, {
        state: {
          type: 'pulsa',
          phoneNumber,
          harga: denomination.harga,
          productCode: denomination.productCode
        },
      });
    }
  };

  const isPhoneNumberValid = phoneNumber.length >= 10 && !error;
  const isDenominationSelected = denomination.harga !== null;

  return (
    <div className="max-w-md mx-auto p-2 flex flex-col h-screen justify-between">
      <div className="flex-grow">
        <div className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center p-2 bg-blue-500">
            <button onClick={handleBack} className="mr-4 text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-white">Pulsa</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Top-Up Pulsa</h1>
          <select onChange={handleProviderChange} value={selectedProvider}>
            <option value="">All Providers</option>
            <option value="Pulsa _">Telkomsel</option>
            <option value="Axis">Axis</option>
            <option value="XL">XL</option>
            <option value="Indosat">Indosat</option>
            <option value="Three">Three</option>
            <option value="Smartfren">Smartfren</option>
            {/* Add more providers as needed */}
          </select>

          <PhoneNumberInput
            phoneNumber={phoneNumber}
            handlePhoneNumberChange={handlePhoneNumberChange}
            error={error}
          />
          <DenominationButtons
            handleDenominationSelect={handleDenominationSelect}
            denomination={denomination}
            filteredProducts={filteredProducts}
          />
        </div>
      </div>
      <TotalPrice
        denomination={denomination}
        isDenominationSelected={isDenominationSelected}
        isPhoneNumberValid={isPhoneNumberValid}
        handleVerification={handleVerification}
      />
    </div>
  );
};

export default PulsaPage;
