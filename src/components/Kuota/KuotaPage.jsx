import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import KuotaPaketItem from './KuotaPaketItem';
import InputNumber from './KuotaInputNumber';
import { FaSimCard, FaMobileAlt, FaSignal } from 'react-icons/fa';

const KuotaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [phoneNumber, setPhoneNumber] = useState(location.state?.phoneNumber || '');
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  useEffect(() => {
    // Fetch data from API
    fetch('https://api.beetpos.com/api/v1/kios-product?category_id=2&page=1&per_page=1999')
      .then(response => response.json())
      .then(data => {
        setProducts(data.data);
        setFilteredProducts(data.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Run on component mount

  useEffect(() => {
    // Filter products based on price range and provider
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

  const handleFormSubmit = () => {
    const selectedPackageDetails = filteredProducts.find(pkg => pkg.kode === selectedPackage);

    if (!selectedPackageDetails) {
      setErrorMessage('Paket yang dipilih tidak valid.');
      return;
    }

    const originalPrice = selectedPackageDetails.price;
    const hargaBaru = selectedPackageDetails.diskon
      ? (originalPrice * (100 - selectedPackageDetails.diskon) / 100).toFixed(0)
      : originalPrice;

    const totalHarga = parseInt(hargaBaru, 10).toLocaleString();

    navigate('/metode-pembayaran-kuota', {
      state: {
        provider: selectedProvider,
        denomination: {
          type: 'kuota',
          harga: originalPrice.toString(),
          diskon: selectedPackageDetails.diskon,
          productCode: selectedPackageDetails.kode,
          nama: selectedPackageDetails.name,
        },
        phoneNumber: phoneNumber,
        totalHarga: totalHarga,
      },
    });
  };

  const handleBack = () => navigate('/');

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    if (value.length >= 10 && value.length <= 15 && value.startsWith('08')) {
      setErrorMessage('');
    } else if (!value.startsWith('08')) {
      setErrorMessage('Nomor telepon harus dimulai dengan 08.');
    } else if (value.length < 10) {
      setErrorMessage('Nomor telepon terlalu singkat.');
    } else if (value.length > 15) {
      setErrorMessage('Nomor telepon terlalu panjang.');
    } else {
      setErrorMessage('Nomor telepon tidak valid.');
    }
  };

  const selectedPackageDetails = filteredProducts.find(pkg => pkg.kode === selectedPackage);
  const totalHarga = selectedPackageDetails
    ? selectedPackageDetails.diskon
      ? (parseInt(selectedPackageDetails.price, 10) * (100 - selectedPackageDetails.diskon) / 100).toLocaleString()
      : parseInt(selectedPackageDetails.price, 10).toLocaleString()
    : '0';

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
            <h1 className="text-lg font-semibold text-white">Kuota</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Pilih Paket Data</h1>

          {/* Provider Selection */}
          <select onChange={handleProviderChange} value={selectedProvider} className="mb-4 p-2 border rounded">
            <option value="">All Providers</option>
            <option value="Telkomsel">Telkomsel</option>
            <option value="Axis">Axis</option>
            <option value="XL">XL</option>
            <option value="Indosat">Indosat</option>
            <option value="Three">Three</option>
            <option value="Smartfren">Smartfren</option>
          </select>

          {/* Phone Number Input */}
          <InputNumber value={phoneNumber} onChange={handlePhoneNumberChange} errorMessage={errorMessage} />

          {/* Filtered Products */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Pilih Paket</label>
            {filteredProducts.map((product) => {
              const hargaBaru = product.diskon
                ? (product.price * (100 - product.diskon) / 100).toFixed(0)
                : product.price;
              return (
                <KuotaPaketItem
                  key={product.id}
                  nama={product.name}
                  harga={hargaBaru}
                  isSelected={product.kode === selectedPackage}
                  onClick={() => setSelectedPackage(product.kode)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="sticky bottom-0 bg-white shadow-md p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Total Tagihan</span>
            <span className="text-lg font-bold text-black">
              Rp{totalHarga}
            </span>
          </div>
          <button
            onClick={handleFormSubmit}
            disabled={!selectedPackage || !phoneNumber || errorMessage}
            className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
              !selectedPackage || !phoneNumber || errorMessage
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-600'
            }`}
          >
            Lanjut Verifikasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default KuotaPage;
