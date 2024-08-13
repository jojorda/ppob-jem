import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../Card';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, selectedMethod, phone, productType, nominal } = location.state || {}; // Ensure nominal is extracted here

  const handleBack = () => {
    navigate(-1);
  };

  const handlePayment = () => {
    navigate('/process', {
      state: { selectedMethod, amount: nominal + 500, phone, nominal, productType },
    });
  };

  if (nominal === undefined) {
    return <div>Error: nominal is not defined</div>;
  }

  return (
    <Card className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
      <header className="p-2 border-b flex items-center mb-8">
        <button className="mr-4" onClick={handleBack} aria-label="Go back">
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
        <h1 className="text-xl font-semibold">{productType === 'electricity' ? 'Listrik PLN' : 'Konfirmasi Pembayaran'}</h1>
      </header>
      <main className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Konfirmasi Pembelian</h2>
        <div className="space-y-3">
          <InfoItem term="Nama paket" description={`${productType === 'electricity' ? 'Token' : 'Pulsa'} ${nominal.toLocaleString()}`} />
          <InfoItem term={productType === 'electricity' ? 'ID Pelanggan' : 'Nomor HP'} description={phone} />
          <InfoItem term="Harga" description={`Rp ${nominal.toLocaleString()}`} />
          <InfoItem term="Metode pembayaran" description={selectedMethod.toUpperCase()} />
        </div>
        <div className="flex items-center justify-between border-t border-gray-300 pt-4 mt-4">
          <span className="text-lg font-semibold text-gray-900">Total Harga</span>
          <span className="text-xl font-bold text-red-600">Rp {(nominal + 500).toLocaleString()}</span>
        </div>
      </main>
      <button
        onClick={handlePayment}
        className="w-full bg-sky-500 text-white py-3 rounded-lg mb-3 font-semibold hover:bg-sky-600 transition duration-300 ease-in-out shadow-md"
        aria-label="Proceed to payment"
      >
        BAYAR
      </button>
      <button
        onClick={handleBack}
        className="w-full bg-gray-200 text-sky-500 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-300 ease-in-out"
        aria-label="Go back to previous page"
      >
        Kembali
      </button>
    </Card>
  );
};

const InfoItem = ({ term, description }) => (
  <div className="flex justify-between">
    <dt className="text-gray-600 font-semibold">{term}:</dt>
    <dd className="font-medium text-gray-800">{description}</dd>
  </div>
);

export default ConfirmationPage;