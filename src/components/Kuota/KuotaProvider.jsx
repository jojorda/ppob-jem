import React, { useEffect, useState } from 'react';

const KuotaProvider = ({ selectedProvider, setSelectedProvider }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch provider data from the API
  const fetchProviders = async () => {
    try {
      const API_URL = "https://api.beetpos.com/api/v1/kios-sub-category?page=1&per_page=13";
      const response = await fetch(API_URL);
      const responseData = await response.json();
      console.log("data kota", responseData);

      if (responseData && responseData.data) {
        // Process the data to format the provider name and remove duplicates
        const uniqueProviders = Array.from(
          new Set(responseData.data.map((provider) => provider.name))
        ).map((uniqueName) => {
          // Find the first provider with the unique name
          const provider = responseData.data.find((prov) => prov.name === uniqueName);
          return {
            id: provider.id,
            name: provider.name.charAt(0).toUpperCase() + provider.name.slice(1),
          };
        });

        setProviders(uniqueProviders);
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
      {loading ? (
        <p></p>
      ) : (
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Pilih Provider</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.name}>
              {provider.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default KuotaProvider;


