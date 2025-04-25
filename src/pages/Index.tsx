import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../utils/OrderContext';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Star, Loader } from 'lucide-react';
import AddressSelector from '../components/AddressSelector';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { mockApi } from '../utils/mockApi';
import { Boutique } from '../utils/types';
import BoutiqueCard from '../components/BoutiqueCard';
import { toast } from "@/components/ui/use-toast";

// Banner type definition
interface Banner {
  id: string;
  imageUrl: string;
  redirectPath?: string;
}

const Index: React.FC = () => {
  // Initialize address sheet as closed if a pincode exists in localStorage
  const hasSavedPincode = !!localStorage.getItem('userPincode');
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(!hasSavedPincode);
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingBoutiques, setLoadingBoutiques] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { updateOrder, order } = useOrder();
  const navigate = useNavigate();
  
  // Update current slide when carousel changes
  useEffect(() => {
    if (!carouselApi) return;

    const onChange = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onChange);
    return () => {
      carouselApi.off("select", onChange);
    };
  }, [carouselApi]);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoadingBanners(true);
        const response = await fetch('http://localhost:3001/api/carousel');
        const data = await response.json();
        
        if (data.success) {
          console.log('Banners fetched successfully:', data.banners);
          setBanners(data.banners);
        } else {
          console.error('Failed to fetch banners:', data.error);
          toast({
            title: "Error",
            description: "Failed to load carousel banners",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        toast({
          title: "Error",
          description: "Failed to load carousel banners",
          variant: "destructive"
        });
      } finally {
        setLoadingBanners(false);
      }
    };
    
    fetchBanners();
  }, []);
  
  // Fetch boutiques from API
  useEffect(() => {
    const fetchBoutiques = async () => {
      try {
        setLoadingBoutiques(true);
        
        // Get pincode from order context or localStorage
        const pincode = order.deliveryPincode || localStorage.getItem('userPincode');
        
        // Build the API URL with optional pincode parameter
        let url = 'http://localhost:3001/api/boutiques';
        if (pincode) {
          url += `?pincode=${pincode}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          console.log('Boutiques fetched successfully:', data.data.boutiques);
          setBoutiques(data.data.boutiques);
        } else {
          console.error('Failed to fetch boutiques:', data.error);
          toast({
            title: "Error",
            description: "Failed to load boutiques",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching boutiques:', error);
        toast({
          title: "Error",
          description: "Failed to load boutiques",
          variant: "destructive"
        });
      } finally {
        setLoadingBoutiques(false);
      }
    };
    
    fetchBoutiques();
  }, [order.deliveryPincode]);

  const handleAddressSubmit = (pincode: string) => {
    // Update order context with the new pincode
    updateOrder({ deliveryPincode: pincode });
    
    // Close the sheet and ensure it stays closed
    setIsAddressSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Banner Carousel */}
      <section className="mb-8">
        {loadingBanners ? (
          <div className="w-full max-w-5xl mx-auto h-[180px] md:h-[250px] flex items-center justify-center bg-gray-100 rounded-lg">
            <Loader className="w-8 h-8 animate-spin text-plum" />
          </div>
        ) : banners.length > 0 ? (
          <Carousel 
            className="w-full max-w-5xl mx-auto"
            setApi={setCarouselApi}
            opts={{
              loop: true,
              align: "center"
            }}
          >
            <CarouselContent>
              {banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div 
                    className="relative h-[180px] md:h-[250px] rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => banner.redirectPath && navigate(banner.redirectPath)}
                  >
                    {/* Use direct image URL */}
                    {banner.imageUrl ? (
                      <img 
                        src={banner.imageUrl} 
                        alt="Banner"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Error loading image:', banner.imageUrl);
                          e.currentTarget.src = '/images/placeholder-banner.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No image available</p>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      {banner.redirectPath && (
                        <div className="text-white text-sm font-medium bg-plum/80 rounded-full px-3 py-1 inline-block">
                          Tap to explore
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Dot indicators */}
            {banners.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === index ? 'bg-plum scale-125' : 'bg-gray-300'}`}
                    onClick={() => carouselApi?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </Carousel>
        ) : (
          <div className="w-full max-w-5xl mx-auto h-[180px] md:h-[250px] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">No banners available</p>
          </div>
        )}
      </section>

      {/* Popular Boutiques - Now above Services */}
      <section className="container mx-auto px-4 mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-plum">Popular Boutiques</h2>
          {order.deliveryPincode && (
            <p className="text-sm text-gray-500 mt-1">Showing boutiques near {order.deliveryPincode}</p>
          )}
        </div>
        
        {loadingBoutiques ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden h-[160px] animate-pulse">
                <div className="w-full h-28 sm:h-32 bg-gray-200"></div>
                <div className="p-2 sm:p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : boutiques.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {boutiques.slice(0, 10).map((boutique) => (
              <BoutiqueCard key={boutique.id} boutique={boutique} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">No boutiques found{order.deliveryPincode ? ` near ${order.deliveryPincode}` : ''}.</p>
            {order.deliveryPincode && (
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => navigate('/boutiques')}
              >
                View All Boutiques
              </Button>
            )}
          </div>
        )}
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
