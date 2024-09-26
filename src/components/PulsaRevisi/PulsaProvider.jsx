import React, { useEffect, useState } from 'react';
import { FaMobileAlt } from 'react-icons/fa';

const PulsaProvider = ({ provider, handleProviderChange }) => {
  const [denominations, setDenominations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  const fetchProviders = async () => {
    try {
      const API_URL = "https://api.beetpos.com/api/v1/kios-sub-category?page=1&per_page=13";
      const response = await fetch(API_URL);
      const responseData = await response.json();
      
      if (responseData && responseData.data) {
        setDenominations(responseData.data.map(item => item.name));
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Pilih Provider</label>
      <div className="relative">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <select
            value={provider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none appearance-none"
          >
            <option value="">Pilih Provider</option>
            {denominations.map((prov, index) => (
              <option key={index} value={prov}>
                {prov.charAt(0).toUpperCase() + prov.slice(1)}
              </option>
            ))}
          </select>
        )}
        <FaMobileAlt className="absolute top-3 right-3 text-gray-400" />
      </div>
    </div>
  );
};

export default PulsaProvider;
