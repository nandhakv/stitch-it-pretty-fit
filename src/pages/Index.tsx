
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../utils/OrderContext';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Star } from 'lucide-react';
import AddressSelector from '../components/AddressSelector';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { mockApi } from '../utils/mockApi';
import { Boutique } from '../utils/types';
import BoutiqueCard from '../components/BoutiqueCard';

const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=400&fit=crop",
    title: "Custom Tailoring"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&h=400&fit=crop",
    title: "Designer Boutiques"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&h=400&fit=crop",
    title: "Professional Alterations"
  }
];

const Index: React.FC = () => {
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(true);
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const { updateOrder } = useOrder();
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.getBoutiques().then((data) => {
      setBoutiques(data);
    });
  }, []);

  const handleAddressSubmit = (pincode: string) => {
    updateOrder({ deliveryPincode: pincode });
    setIsAddressSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Banner Carousel */}
      <section className="mb-8">
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-[300px] rounded-lg overflow-hidden">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <h2 className="text-white text-2xl font-semibold">{banner.title}</h2>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-plum">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Custom Designs</h3>
            <p className="text-gray-600">Create your perfect outfit with our expert tailors</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Alterations</h3>
            <p className="text-gray-600">Professional clothing alterations and repairs</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Boutique Selection</h3>
            <p className="text-gray-600">Choose from our curated list of premium boutiques</p>
          </div>
        </div>
      </section>

      {/* Popular Boutiques */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-plum">Popular Boutiques</h2>
          <Button variant="outline" onClick={() => navigate('/boutiques')}>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boutiques.slice(0, 6).map((boutique) => (
            <BoutiqueCard key={boutique.id} boutique={boutique} />
          ))}
        </div>
      </section>

      {/* Address Sheet */}
      <Sheet open={isAddressSheetOpen} onOpenChange={setIsAddressSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Select Your Location</SheetTitle>
            <SheetDescription>
              Help us find the best tailoring services near you
            </SheetDescription>
          </SheetHeader>
          <AddressSelector onSubmit={handleAddressSubmit} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
