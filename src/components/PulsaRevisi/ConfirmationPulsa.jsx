import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ConfirmationPulsa = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tangkap data dari state yang dikirimkan oleh halaman sebelumnya
  const { selectedMethod, amount, accountNumber, provider } = location.state || {};

  const handleBack = () => {
    navigate(-1);
  };

  const handleVerification = () => {
    navigate('/process-pulsa', {
      state: {
        selectedMethod,
        amount,
        accountNumber,
        provider,
      },
    });
  };

  const formatAmount = (amount) => {
    return amount > 0 ? `Rp ${amount.toLocaleString()}` : 'Rp -';
  };

  return (
    <div className='max-w-md mx-auto p-1 flex flex-col justify-between'>
        <div className="sticky top-0 bg-white z-10 border-b">
            <div className="flex items-center p-2">                    
                <button onClick={handleBack} className="mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>                    
                </button>
                <h1 className="text-lg font-semibold">Konfirmasi Pembayaran</h1>
            </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Konfirmasi Pulsa</h2>
            <div className='space-y-2'>
                <DetailItem label="Provider" value={provider || '-'} />
                <DetailItem label="Nomor HP" value={accountNumber || '-'} />
                <DetailItem label="Nominal" value={formatAmount(amount)} />
                <DetailItem label="Metode Pembayaran" value={selectedMethod || '-'} />
            </div>
            <div className='flex items-center justify-between border-t border-gray-300 pt-4 mt-4'>
                <span className='text-lg font-semibold text-gray-900'>Total Harga</span>
                <span className='text-xl font-bold text-red-600'>{formatAmount(amount)}</span>
            </div>
        </div>

        <button
            onClick={handleVerification}
            className='w-full bg-sky-500 text-white py-3 rounded-lg mb-4 font-semibold hover:bg-sky-600 transition duration-300 ease-in-out shadow-md'
        >
            Lanjut Verifikasi
        </button>
        <button
            onClick={handleBack}
            className='w-full bg-gray-200 text-sky-500 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-300 ease-in-out'
        >
            Kembali
        </button>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className='flex items-center justify-between'>
    <span className='text-base font-medium text-gray-600 leading-tight'>{label}</span>
    <span className='text-base font-medium text-gray-900 leading-tight'>{value}</span>
  </div>
);

export default ConfirmationPulsa;
