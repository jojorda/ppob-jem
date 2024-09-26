import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Header from '../components/Header';
import PromoBanner from '../components/PromoBanner';
import {
  Pulsa, Kuota, PLN, Air, BPJS, Game, Wallet, Dana, Gopay, LinkAja, OVO,  Lainnya
} from '../icons/icon';

// Define icons and map them to categories
const icons = {
  pulsa: Pulsa,
  paketdata: Kuota,
  paketbicara: Wallet,
  paketroaming: Wallet,
  listrik: PLN,
  air: Air,
  pbb: BPJS,
  'tv': Game,
  e_walletsaldo: Dana,
  emoney: Wallet,
  dana: Dana,
  gopay: Gopay,
  maxim: Wallet,
  ovo: OVO,
  mockup: Gopay,
  vouchergaming: Game,
  'tambahlagi': Lainnya,
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.beetpos.com/api/v1/kios-category?page=1&per_page=12');
        const data = await response.json();
        if (data.statusCode === 200) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/subcategory/${categoryId}`);
  };

  // Group categories according to sections
  const renderSection = (sectionTitle, sectionCategories) => (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-4">{sectionTitle}</h2>
      <div className="grid grid-cols-3 w-full sm:grid-cols-4 md:grid-cols-4 gap-4">
        {sectionCategories.map((category) => {
          const IconComponent = icons[category.name.toLowerCase().replace(/\s/g, '')] || Lainnya;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="py-2 px-4 text-black bg-gray-200 border p-4 rounded-lg shadow hover:bg-sky-300 transition-colors text-sm font-medium flex flex-col items-center justify-center"
            >
              <IconComponent className="w-6 h-6 mb-2" />
              {category.name || 'Kategori'}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Categorize the services
  const pulsaDataCategories = categories.filter(cat => ['pulsa', 'paket data', 'paket bicara', 'paket roaming'].includes(cat.name.toLowerCase()));
  const tagihanCategories = categories.filter(cat => ['listrik', 'air', 'e money', 'tv', 'e_wallet saldo', 'voucher gaming', 'tambah lagi', 'mock up',].includes(cat.name.toLowerCase()));
  const isiUlangCategories = categories.filter(cat => ['e_wallet saldo', 'voucher gaming', 'tambah lagi', 'mock up', 'maxim', 'ovo', 'shopee pay', 'grab'].includes(cat.name.toLowerCase()));
  // const isiUlangCategories = categories.filter(cat => ['e-money', 'dana', 'gopay', 'link aja', 'maxim', 'ovo', 'shopee pay', 'grab'].includes(cat.name.toLowerCase()));
  // const voucherGameCategories = categories.filter(cat => ['mobile legends', 'pubg', 'free fire', 'lihat semua'].includes(cat.name.toLowerCase()));

  return (
    <div className="container-fluid mx-auto p-4 bg-red">
      <Header />
      <div className="mb-2"></div>
      <Card>
        <PromoBanner />
        {renderSection('Pulsa & Paket Data', pulsaDataCategories)}
        {renderSection('Tagihan & Isi Ulang', tagihanCategories)}
        {/* {renderSection('Isi Ulang', isiUlangCategories)} */}
        {/* {renderSection('Tambahan', voucherGameCategories)} */}
      
      </Card>
      <footer className="bg-sky-700 text-white text-center py-4 mt-24">
      <p>&copy; 2024 My Website. All rights reserved.</p>
        {/* <p className="mt-2">Alamat: Jl. Contoh No. 123, Kota, Negara</p>
        <p className="mt-2">Website: <a href="https://www.mywebsite.com" className="text-blue-400 hover:underline">www.mywebsite.com</a></p>
        <p className="mt-2">Email: <a href="mailto:info@mywebsite.com" className="text-blue-400 hover:underline">info@mywebsite.com</a></p>
        <p className="mt-2">Kontak HP: <a href="tel:+1234567890" className="text-blue-400 hover:underline">+123 456 7890</a></p> */}
    </footer>
    </div>

  );
};

export default Home;
