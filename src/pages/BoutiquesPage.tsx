
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StepProgress from '../components/StepProgress';
import BoutiqueCard from '../components/BoutiqueCard';
import { mockApi } from '../utils/mockApi';
import { Boutique } from '../utils/types';
import { Search } from 'lucide-react';

const steps = ["Address", "Boutique", "Design", "Cloth", "Measure", "Order", "Pickup"];

const BoutiquesPage: React.FC = () => {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [filteredBoutiques, setFilteredBoutiques] = useState<Boutique[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getBoutiques().then((data) => {
      setBoutiques(data);
      setFilteredBoutiques(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredBoutiques(boutiques);
    } else {
      const filtered = boutiques.filter(
        (boutique) =>
          boutique.name.toLowerCase().includes(query) ||
          boutique.location.toLowerCase().includes(query)
      );
      setFilteredBoutiques(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header title="Select Boutique" />
      
      <div className="step-container">
        <StepProgress steps={steps} currentStep={1} />
        
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search boutiques by name or location"
              className="input-field pl-10"
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="w-10 h-10 border-4 border-plum/30 border-t-plum rounded-full animate-spin"></div>
            </div>
          ) : filteredBoutiques.length > 0 ? (
            filteredBoutiques.map((boutique) => (
              <BoutiqueCard key={boutique.id} boutique={boutique} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No boutiques found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoutiquesPage;
