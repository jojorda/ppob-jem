import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Header from '../components/Header';
import TransactionModal from '../components/TransactionModal'; // Import the modal component
import {
    Pulsa, Kuota, PLN, Air, BPJS, Game, Telko, IndosaLog, Tri, Axiss, XlLog, SmartLogo, Wallet, EmoneyLog, Dana, Grab, Shoppe, Gopay, LinkAja, OVO,  Lainnya
  } from '../icons/icon';
import LoadingSpinner from './LoadingSpinner';
import { Gamepad } from 'lucide-react';
import telkomselLogo from '../assets/images/telko.png';
import xlLogo from '../assets/images/XL.png'
import tri from '../assets/images/tri.png'
import axis from '../assets/images/axis.png'
import indosatLogo from '../assets/images/indo.png'
import smartfren from '../assets/images/images.png'
import noProductsImage from '../assets/images/MetodePembayaran/cart.jpg';

const SubCategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [error, setError] = useState(''); // State for phone number error message
    const [providerImage, setProviderImage] = useState(null);

    useEffect(() => {
        fetchSubCategories().then(() => setIsLoading(false));
      }, []);

    const iconMap = {
        'Pulsa': Pulsa,
        'Kuota': Kuota,
        'PLN': PLN,
        'Air': Air,
        'BPJS': BPJS,
        'Game': Game,
        'Wallet': Wallet,
        'Dana': Dana,
        'Go-Pay': Gopay,
        'Link-Aja': LinkAja,
        'Telkomsel': Telko,
        'Indosat': IndosaLog,
        'Axis': Axiss,
        'Three': Tri,
        'XL': XlLog,
        'Smartfren': SmartLogo,
        'OVO': OVO,
        'Shopee Pay': Shoppe,
        'Grab': Grab,
        'Maxim': Gopay,
        'Mandiri': EmoneyLog,
        'Lainnya': Lainnya,
    };

    useEffect(() => {
        fetchSubCategories();
        fetchCategoryName();
    }, [categoryId]);

    const fetchCategoryName = async () => {
        try {
            const response = await fetch(`https://api.beetpos.com/api/v1/kios-category/${categoryId}`);
            const data = await response.json();
            if (data.statusCode === 200) {
                setCategoryName(data.data.name);
            }
        } catch (error) {
            console.error('Error fetching category name:', error);
        }
    };

    const fetchSubCategories = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://api.beetpos.com/api/v1/kios-sub-category?page=1&per_page=10&category_id=${categoryId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.statusCode === 200) {
                setSubCategories(data.data);
            } else {
                setSubCategories([]);
            }
        } catch (error) {
            console.error(`Error fetching sub-categories for category ${categoryId}:`, error);
            setSubCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubCategoryClick = async (subCategoryId) => {
        setIsLoading(true);
        setSelectedSubCategory(subCategoryId);
        try {
            const response = await fetch(`https://api.beetpos.com/api/v1/kios-product?category_id=${categoryId}&sub_category_id=${subCategoryId}&page=1&per_page=50`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.statusCode === 200) {
                setProducts(data.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error(`Error fetching products for sub-category ${subCategoryId}:`, error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate('/');
    };

    const handlePhoneNumberChange = (event) => {
        const input = event.target.value;
        setPhoneNumber(input);

        // Phone number validation
        if (input && !input.startsWith('08')) {
            setError('Nomor HP harus dimulai dengan "08".');
            setProviderImage(null);
        } else if (input.length < 10) {
            setError('Nomor HP terlalu pendek.');
            setProviderImage(null);
        } else if (input.length > 13) {
            setError('Nomor HP terlalu panjang.');
            setProviderImage(null);
        } else {
            setError('');
            // Set provider image based on phone number prefix
            if (input.startsWith('087')) {
                setProviderImage(xlLogo);
            } else if (input.startsWith('081')) {
                setProviderImage(telkomselLogo);
            } else if (input.startsWith('082')) {
                setProviderImage(telkomselLogo);
            } else if (input.startsWith('085')) {
                if (input.startsWith('0851')) {
                    setProviderImage(telkomselLogo);
                } else if (input.startsWith('0855') || input.startsWith('0856') || input.startsWith('0857') || input.startsWith('0858')) {
                    setProviderImage(indosatLogo); // Indosat IM3
                } else {
                    setProviderImage(telkomselLogo);
                }
            } else if (input.startsWith('0814') || input.startsWith('0815') || input.startsWith('0816')) {
                setProviderImage(indosatLogo); // Indosat IM3
            } else if (input.startsWith('083')) {
                setProviderImage(axis); 
            } else if (input.startsWith('089')) {
                setProviderImage(tri); 
            } else if (input.startsWith('088')) {
                setProviderImage(smartfren); 
            } else {
                setError('Nomor Anda tidak tertera.');
                setProviderImage(null);
            }
        }        
        
    };


    const handleProductSelect = (product) => {
        if (error || !phoneNumber) { // Check if there's an error or phone number is not provided
            setError('Mohon isi nomor telepon dengan benar sebelum memilih produk.');
            return;
        }

        setSelectedProduct(product);
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // setSelectedProduct(null); // Reset selected product
    };

    return (
        <div className="container-fluid mx-auto p-4 bg-grey ">
            <Header />
            <div className="mx-auto p-2 flex flex-col justify-between">
                <div className="flex items-center p-2 rounded">
                    <button onClick={handleBackClick} className="mr-4 text-black">
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
                    <h1 className="text-lg font-semibold text-black">{categoryName}</h1>
                </div>
            </div>

            <Card>
                {/* Phone Number Input */}
                <div className="mt-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Masukkan Nomor Ponsel
                    </label>
                    <div className="flex items-center">
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            className={`mt-1 block w-[400px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm ${
                                error ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter your phone number"
                        />
                        {providerImage && (
                            <img
                                src={providerImage}
                                alt="Provider Logo"
                                className="ml-2 h-8 w-auto"
                            />
                        )}
                    </div>
                    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                </div>

                {isLoading ? (
                    <LoadingSpinner />
                ) : subCategories.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4 mb-8 mt-4">
                    {subCategories.map((subCategory) => {
                        const IconComponent = iconMap[subCategory.name] || Gamepad;  // Use Gamepad as fallback icon

                        return (
                        <button
                            key={subCategory.id}
                            onClick={() => handleSubCategoryClick(subCategory.id)}
                            className={`border p-2 rounded-lg hover:bg-sky-200 shadow-lg rounded ${
                            selectedSubCategory === subCategory.id ? 'text-black bg-sky-200' : 'bg-gray-200'
                            }`}
                        >
                            <div className="flex items-center justify-center">
                            <IconComponent className="w-6 h-6 mr-2" />
                            {subCategory.name}
                            </div>
                        </button>
                        );
                    })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-8">
                    <img src={noProductsImage} alt="No products available" className="w-64 h-64 mb-4" />
                    <p className="text-xl font-semibold text-gray-600">Tidak ada produk tersedia</p>
                    </div>
                )}

                {isLoading ? (
                    <p></p>
                ) : (
                    <div className="flex flex-wrap justify-between gap-4 mb-20">
                        {products.map((product) => (
                            <button onClick={() => handleProductSelect(product)}
                                key={product.id}
                                className="relative text-start hover:bg-gray-200 flex-1 min-w-[200px] max-w-[300px] border p-8 rounded-lg shadow-lg"
                            >
                                <div className="mb-1">
                                    <h3 className="font-bold">{product.name}</h3>
                                    {/* <h3 className="font-bold">{product.admin_cost}</h3> */}
                                    <h1 className="mt-7 font-bold text-sky-600 text-2xl font-sans" style={{ fontFamily: 'Arial, sans-serif' }}>
                                    Rp{product.price.toLocaleString()}
                                    </h1>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </Card>

            {/* Render the modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                phoneNumber={phoneNumber}
                product={selectedProduct}
            />

        </div>
    );
};

export default SubCategoryPage;
