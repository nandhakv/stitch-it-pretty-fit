
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, MapPin, Phone } from 'lucide-react';
import Header from '../components/Header';
import { mockApi } from '../utils/mockApi';
import { Boutique } from '../utils/types';
import { useOrder } from '../utils/OrderContext';

const BoutiqueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateOrder } = useOrder();
  const [boutique, setBoutique] = useState<Boutique | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      mockApi.getBoutique(id).then((data) => {
        if (data) {
          setBoutique(data);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleServiceSelect = (serviceId: string) => {
    if (boutique) {
      const service = boutique.services.find((s) => s.id === serviceId);
      if (service) {
        updateOrder({ boutique, service });
        navigate('/service-options');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header title="Boutique Details" />
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-plum/30 border-t-plum rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!boutique) {
    return (
      <div className="min-h-screen bg-cream">
        <Header title="Boutique Details" />
        <div className="step-container">
          <div className="text-center py-8">
            <p className="text-gray-500">Boutique not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header title="Boutique Details" />
      
      <div className="step-container">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <img
            src={boutique.image}
            alt={boutique.name}
            className="w-full h-48 object-cover"
          />
          
          <div className="p-4">
            <h2 className="text-xl font-medium text-plum">{boutique.name}</h2>
            
            <div className="flex items-center mt-2">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="ml-1 text-sm font-medium">
                {boutique.rating} ({boutique.reviewCount} reviews)
              </span>
            </div>
            
            <div className="flex items-center mt-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="ml-2 text-sm text-gray-600">{boutique.location}</span>
            </div>
            
            <div className="flex items-center mt-1">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="ml-2 text-sm text-gray-600">+91 98765 43210</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-3">Available Services</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {boutique.services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleServiceSelect(service.id)}
            >
              <div className="flex">
                <div className="w-24 h-24 flex-shrink-0">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-plum">{service.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoutiqueDetailPage;
