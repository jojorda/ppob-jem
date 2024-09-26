import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../Card';
import { paymentIcons } from "../../assets/images/MetodePembayaran/paymentIcons";

const paymentMethods = [
  {
    id: 'ovo',
    name: 'OVO',
    icon: paymentIcons.ovo,
    category: 'Dompet Digital',
    color: 'bg-white',
    typemetode: 'digital_wallet'
  },
  {
    id: 'dana',
    name: 'Dana',
    icon: paymentIcons.dana,
    category: 'Dompet Digital',
    color: 'bg-white',
    typemetode: 'digital_wallet'
  },
  {
    id: 'indomaret',
    name: 'Indomaret / Ceriamart',
    icon: paymentIcons.indomaret,
    category: 'Gerai Offline',
    color: 'bg-white',
    typemetode: 'offline_store'
  },
  {
    id: 'alfamart',
    name: 'Alfamart / Alfamidi / Dan+Dan',
    icon: paymentIcons.alfamart,
    category: 'Gerai Offline',
    color: 'bg-white',
    typemetode: 'offline_store'
  },
  {
    id: 'klikbca',
    name: 'KlikBCA',
    icon: paymentIcons.bca,
    category: 'Internet Banking',
    color: 'bg-white',
    typemetode: 'internet_banking'
  },
  {
    id: 'bri',
    name: 'Bank BRI',
    icon: paymentIcons.bri,
    category: 'Transfer Bank',
    color: 'bg-white',
    typemetode: 'bank_transfer'
  },
  {
    id: 'mandiri',
    name: 'Bank Mandiri',
    icon: paymentIcons.mandiri,
    category: 'Transfer Bank',
    color: 'bg-white',
    typemetode: 'bank_transfer'
  },
];

const MetodePayment = ({ paymentType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showMoreMethods, setShowMoreMethods] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { provider, denomination, phoneNumber, harga, meteranId, productType, productCode } = location.state || {};

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleSelection = (methodId) => {
    setSelectedMethod(methodId);
    setError('');
  };

  const handleBack = () => {
    setShowConfirmDialog(true);
  };

  // const handleConfirmLeave = () => {
  //   switch (paymentType) {
  //     case 'kuota':
  //       navigate(-1);
  //       break;
  //     case 'pln':
  //       navigate(productType === 'electricity' ? '/electricity-form' : '/');
  //       break;
  //     case 'pulsa_':
  //       navigate(-1);
  //       break;
  //     default:
  //       break;
  //   }
  // };
  const handleConfirmLeave = () => {
    navigate(-1);
  };

  const handleCancelLeave = () => {
    setShowConfirmDialog(false);
  };

  const handleContinue = () => {
    if (selectedMethod) {
      let route = '';
      let stateData = {};
  
      switch (paymentType) {
        case 'kuota':
          route = '/confirmation-paketdata';
          stateData = {
            type: 'kuota',
            selectedMethod,
            provider: provider,
            denomination: {
              harga: denomination.harga,
              diskon: denomination.diskon,
              kode: denomination.kode, 
              nama: denomination.nama,
            },
            phoneNumber: phoneNumber,
          };
          break;
        case 'pln':
          route = '/pln-confirmation';
          stateData = {
            type: 'pln',
            selectedMethod,
            harga,
            meteranId,
            productCode,
          };
          break;
        case 'pulsa':
          route = '/pulsa-confirmation';
          stateData = {
            type: 'pulsa',
            provider,
            phoneNumber,
            harga: denomination.harga,  
            productCode: denomination.productCode 
          };
          break;
        default:
          break;
      }
  
      navigate(route, { state: stateData });
    } else {
      setError('Silakan pilih metode pembayaran.');
    }
  };

  const toggleShowMoreMethods = () => {
    if (showMoreMethods) {
      setIsAnimating(true);
      setTimeout(() => {
        setShowMoreMethods(false);
        setIsAnimating(false);
      }, 500);
    } else {
      setShowMoreMethods(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const categoryOrder = [
    'Dompet Digital',
    'Gerai Offline',
    'Transfer Bank',
    'Internet Banking'
  ];

  const groupedMethods = categoryOrder.reduce((acc, category) => {
    acc[category] = paymentMethods.filter(method => method.category === category);
    return acc;
  }, {});

  const totalHarga = denomination ? denomination.harga : 0;

  return (
    <div className="max-w-md mx-auto p-2 flex flex-col h-screen justify-between">
      <div className="flex-grow">
        <div className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center p-2">
            <button onClick={handleBack} className="mr-4">
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
            <h1 className="text-lg font-semibold">Metode Pembayaran</h1>
          </div>
        </div>

        <div className="px-4 pt-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Metode pembayaran</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {paymentMethods.slice(0, 3).map((method) => (
              <button
                key={method.id}
                className={`w-full p-1 flex items-center justify-between text-left rounded-lg transition-all duration-200 transform hover:scale-105 ${method.color} hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${selectedMethod === method.id ? 'ring-1 ring-sky-500' : ''}`}
                onClick={() => handleSelection(method.id)}
                aria-label={`Pilih ${method.name}`}
              >
                <div className="flex items-center space-x-6">
                  <img src={method.icon} alt={`${method.name} icon`} className="w-10 h-10 object-contain" />
                  <div>
                    <span className="font-medium text-gray-700">{method.name}</span>
                  </div>
                </div>
                <input
                  type="radio"
                  className="form-radio text-sky-500"
                  checked={selectedMethod === method.id}
                  onChange={() => handleSelection(method.id)}
                />
              </button>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <button
              className={`text-green-600 font-semibold ${showMoreMethods ? 'opacity-50 ' : ''}`}
              onClick={!showMoreMethods ? toggleShowMoreMethods : undefined}
              disabled={showMoreMethods}
            >
              Lihat Semua
            </button>
          </div>

          {showMoreMethods && (
            <div
              className={`fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-500 ease-in-out transform ${
                isAnimating ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
              }`}
            >
              <div className="max-w-lg mx-auto px-6 flex flex-col bg-white border rounded-xl shadow-lg h-[80vh] overflow-x-hidden overflow-y-auto transition-transform duration-500 ease-in-out">
                <div className="sticky top-0 bg-white z-10 flex items-center justify-start space-x-1 p-4 border-b">
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={toggleShowMoreMethods}
                    aria-label="Tutup"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <p className="text-lg font-bold">Pilih Metode Pembayaran</p>
                </div>
                <div className="overflow-y-auto space-y-4 px-4">
                  {categoryOrder.map((category) => (
                    groupedMethods[category] && groupedMethods[category].length > 0 && (
                      <div key={category}>
                        <h3 className="text-lg font-bold text-gray-800">{category}</h3>
                        <div className="space-y-3 mt-2">
                          {groupedMethods[category].map((method) => (
                            <div
                              key={method.id}
                              className="flex items-center justify-between py-2 px-5 border-b cursor-pointer hover:bg-gray-50 rounded-lg"
                              onClick={() => handleSelection(method.id)}
                            >
                              <div className="flex items-center space-x-4">
                                <img
                                  src={method.icon}
                                  alt={`${method.name} icon`}
                                  className="w-14 h-14 object-contain"
                                />
                                <span className="font-medium text-gray-800">{method.name}</span>
                              </div>
                              <svg
                                className="w-6 h-6 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                ></path>
                              </svg>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 border-t-8 pt-4">
          <h3 className="text-gray-800 font-semibold">Ringkasan pembayaran</h3>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Total Belanja</p>
            <p className="text-base text-gray-800">Rp{harga.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white shadow-md p-3 border-t">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Total Harga</span>
            <span className="text-lg font-bold text-black">
              Rp{harga.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleContinue}
            disabled={!selectedMethod || error}
            className={`px-8 py-3 rounded-full text-white text-sm font-semibold ${
              !selectedMethod || error
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-600'
            }`}
          >
            Lanjutkan
          </button>
        </div>
      </div>

      {showConfirmDialog && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white py-6 px-8 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-bold text-center">Keluar halaman ini?</h3>
              <p className="mt-4 text-gray-700 text-center">Transaksi tidak akan diproses jika kamu meninggalkan halaman ini.</p>
              <div className="mt-6 flex flex-col items-center space-y-4">
                <button
                  className="w-full bg-sky-600 text-white py-2 rounded font-medium hover:bg-sky-700 transition ease-in-out duration-150"
                  onClick={handleCancelLeave}
                >
                  Lanjut Bayar
                </button>
                <button
                  className="w-full bg-gray-300 text-gray-700 py-2 rounded font-medium hover:bg-gray-400 transition ease-in-out duration-150"
                  onClick={handleConfirmLeave}
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default MetodePayment;