import React, { useState } from 'react';
import TransactionSummary from './';

const ProductList = ({ products, isLoading, onProductSelect, onBackClick }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductSelect = (product) => {
        setSelectedProduct(product); // Set the selected product
    };

    const handleCancel = () => {
        setSelectedProduct(null); // Reset the selected product
    };

    const handleConfirm = () => {
        // Handle transaction confirmation logic here
        console.log('Transaction confirmed for product:', selectedProduct);
        setSelectedProduct(null); // Reset after confirmation
    };

    if (isLoading) {
        return <p>Memuat produk...</p>;
    }

    if (products.length === 0) {
        return <p>Tidak ada produk tersedia.</p>;
    }

    // If a product is selected, show the transaction summary
    if (selectedProduct) {
        return (
            <TransactionSummary
                product={selectedProduct}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
    }

    return (
        <div className="max-w-md mx-auto p-2 flex flex-col justify-between">
            <div className="flex flex-wrap justify-between gap-4">
                {products.map((product) => (
                    <div key={product.id} className="flex-1 min-w-[200px] max-w-[300px] border p-4 rounded-lg shadow">
                        <h3 className="font-bold">{product.name}</h3>
                        <p>Kode: {product.kode}</p>
                        <p>Harga: Rp {product.price.toLocaleString()}</p>
                        <button
                            onClick={() => handleProductSelect(product)}
                            className="mt-2 py-1 px-3 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
                        >
                            Pilih
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
