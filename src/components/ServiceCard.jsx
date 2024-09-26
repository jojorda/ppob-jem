import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pulsa, Kuota, PLN, Game, Emoney, Air, BPJS, Wallet, Send, Dana, LinkAja, OVO, Gopay, Lainnya } from '../icons/icon';

const icons = {
  pulsa_: Pulsa,
  listrik: PLN,
  paketdata: Kuota,
  paketbicara: Game,
  emoney: Wallet,
  air: Air,
  paketroaming: BPJS,
  e_walletsaldo: Dana,
  send: Send,
  vouchergaming: Game,
  tv: OVO,
  tambahlagi: Lainnya,
  mockup: Gopay,
};

const ServiceCard = ({ iconName, title, onClick }) => {
  const Icon = icons[iconName];
  const navigate = useNavigate();

  const handleClick = async () => {
    if (
      iconName === 'pulsa_' ||
      iconName === 'listrik' ||
      iconName === 'send' ||
      iconName === 'paketdata' ||
      iconName === 'paketbicara' ||
      iconName === 'paketroaming' ||
      iconName === 'vouchergaming' ||
      iconName === 'emoney' ||
      iconName === 'e_walletsaldo' ||
      iconName === 'tv'
    ) {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          alert('Silahkan login terlebih dahulu.');
          return;
        }

        const response = await fetch(
          'https://api.beetpos.com/api/v1/kios-product?category_id=1&page=1&per_page=10', // Change to GET request with query params
          {
            method: 'GET', // GET method for fetching product
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response:', data.code);

        if (data.code === 200) {
          // Successful purchase
          alert(`Pembelian ${title} berhasil!`);
          // Navigate after successful API request
          navigate(getNavigatePath(iconName));
        } else {
          // Display the error message if purchase fails
          alert(`Pembelian ${title} gagal: ${data.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert(`Terjadi kesalahan pada pembelian ${title} atau Silahkan Login Dahulu.`);
      }
    } else if (iconName === 'dana') {
      navigate('/dana');
    } else if (onClick) {
      onClick();
    }
  };

  // Function to get navigation path based on iconName
  const getNavigatePath = (icon) => {
    switch (icon) {
      case 'pulsa_':
        return '/topup-pulsa';
      case 'paketdata':
        return '/kuota';
      case 'paketbicara':
        return '/paket_bicara';
      case 'paketroaming':
        return '/paket_roaming';
      case 'vouchergaming':
        return '/voucher_gaming';
      case 'emoney':
        return '/emoney';
      case 'tv':
        return '/tv';
      case 'e_walletsaldo':
        return '/e_walletsaldo';
      case 'listrik':
        return '/pln';
      case 'send':
        return '/kirim-uang';
      default:
        return '#'; // Add a default path if necessary
    }
  };

  return (
    <button
      className="flex flex-col items-center p-4 text-center bg-white rounded-lg shadow-md hover:bg-gray-300 transition-all"
      onClick={handleClick}
    >
      <div className="mb-2">
        {Icon ? <Icon className="w-11 h-10" /> : <div className="w-11 h-10 bg-gray-200"></div>} {/* Fallback icon */}
      </div>
      <h3 className="text-sm text-center mt-2 break-words w-full">{title}</h3>
    </button>
  );
};

export default ServiceCard;
