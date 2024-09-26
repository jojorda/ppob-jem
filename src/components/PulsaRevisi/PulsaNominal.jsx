import React from 'react';
import classNames from 'classnames';

const DenominationButtons = ({ handleDenominationSelect, denomination, filteredProducts }) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Nominal</label>
      {/* Check if filteredProducts is empty */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products available</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => handleDenominationSelect(product.price, product.code)}
              className={classNames(
                'p-2 rounded-lg flex items-center justify-center transition-all duration-200 text-lg font-semibold shadow',
                denomination?.harga === product.price
                  ? 'bg-blue-100 border-blue-500 shadow-lg'
                  : 'bg-white border border-gray-200 hover:shadow-md'
              )}
              aria-pressed={denomination?.harga === product.price}
            >
              <span>{product.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DenominationButtons;
