import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import UserInfo from '../components/UserInfo';
import Header from '../components/Header';
import PromoBanner from '../components/PromoBanner';
import { Pulsa, Kuota, PLN, Game, Emoney, Air, BPJS, Wallet, Send, Dana, LinkAja, OVO, Gopay, Lainnya } from '../icons/icon';

const icons = {
  pulsa: Pulsa, //
  listrik: PLN, //
  paketdata: Kuota, //
  paketbicara: Game, //
  emoney: Wallet, //
  air: Air, //
  paketroaming: BPJS, //
  e_walletsaldo: Dana,
//   send: Send,
  vouchergaming: Game,
  tv: OVO, //
  tambahlagi: Lainnya,
  mockup: Gopay,
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

  return (
    <div className="container-fluid mx-auto p-4 bg-grey">
      <Header />
      <div className="mb-2"></div>
      {/* <UserInfo
        username="Muhammad"
        balance="1000"
        methods="+4 metode lainnya"
      /> */}
      <Card>
        <PromoBanner />
        <div className="grid grid-cols-2 w-full sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
          {categories.map((category) => {
            const IconComponent = icons[category.name.toLowerCase().replace(/\s/g, '')] || Lainnya;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="py-2 px-4 text-black border p-4 rounded-lg shadow rounded-lg hover:bg-sky-300 transition-colors text-sm font-medium flex flex-col items-center justify-center"
              >
                <IconComponent className="w-6 h-6 mb-2" />
                {category.name || 'Kategori'}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Home;
// bikin code di atas sesuai dengan gambar yg di berikan sesuai apinya dan iconnya
