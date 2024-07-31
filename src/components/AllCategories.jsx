import React from 'react';
import ServiceCard from './ServiceCard';
import Card from './Card';

const categories = {
  Favorit: [
    { iconName: 'pulsa', title: 'Pulsa' },
    { iconName: 'kuota', title: 'Paket Data' },
    { iconName: 'listrik', title: 'PLN' },
  ],
  Pembelian: [
    { iconName: 'pulsa', title: 'Pulsa' },
    { iconName: 'kuota', title: 'Paket Data' },
    { iconName: 'listrik', title: 'PLN' },
    { iconName: 'game', title: 'Game' },
    { iconName: 'emoney', title: 'E-money' },
  ],
  'Dompet Digital': [
    { iconName: 'wallet', title: 'GoPay/ DANA/ OVO' },
    { iconName: 'dana', title: 'Top Up DANA' },
    { iconName: 'linkaja', title: 'Top Up LinkAja' },
    { iconName: 'wallet', title: 'Top Up OVO' },
    { iconName: 'wallet', title: 'Saldo Dompet Gojek' },
  ],
};

const AllCategories = ({ onBack }) => {
  return (
    <Card>
      <div className="bg-white min-h-screen">
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center p-4">
          <button onClick={onBack} className="mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Seluruh Kategori</h1>
        </div>
      </div>
        <div className="p-4">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-lg font-semibold">{category}</h2>
                  {category === 'Favorit' && (
                    <p className="text-sm text-gray-500">Pilih Favorit</p>
                  )}
                </div>
                {category === 'Favoritku' && (
                  <button className="text-green-500 text-sm font-semibold">Ubah</button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-0.5">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-lg p-1 mb-1">
                      <ServiceCard iconName={item.iconName} className="w-10 h-10" />
                    </div>
                    <span className="text-xs text-center">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AllCategories;