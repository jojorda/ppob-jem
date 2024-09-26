import React from 'react';

const KuotaPaketItem = ({ nama, harga, diskon, hargaBaru, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg mb-2 cursor-pointer relative ${
        isSelected ? 'bg-sky-100 border-sky-500' : 'bg-white'
      }`}
    >
      {/* Label Promo di sudut kiri atas, dengan jarak dari nama paket */}
      {diskon && diskon !== '0' && (
        <div className="absolute top-0 left-0 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg">
          Promo
        </div>
      )}

      <div className="flex flex-col mt-1"> {/* Menambahkan margin-top untuk memberikan jarak */}
        <h2 className="font-medium text-gray-800">{nama}</h2>
        <div className="flex flex-col mt-2">
          {/* Harga Asli dengan coretan jika ada diskon */}
          {diskon && diskon !== '0' ? (
            <>
              <span className="text-sm text-gray-500 line-through">
                Rp {parseInt(harga.replace(/\./g, ''), 10).toLocaleString()}
              </span>
              <div className="flex items-center">
                {/* Harga setelah diskon */}
                <span className="text-lg font-bold text-black mr-2">
                  Rp {parseInt(hargaBaru, 10).toLocaleString()}
                </span>
                {/* Persentase Diskon */}
                <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-lg">
                  {diskon}%
                </span>
              </div>
            </>
          ) : (
            <span className="text-lg font-bold text-black">
              Rp {parseInt(harga.replace(/\./g, ''), 10).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KuotaPaketItem;