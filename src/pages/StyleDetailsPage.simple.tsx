import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const StyleDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Hardcoded style data matching the sample JSON
  const style = {
    id: "style002",
    name: "Embroidered Silk Blouse",
    description: "Intricately embroidered silk blouse with back hook closure and short sleeves.",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tailor-app-71fe2.firebasestorage.app/o/HomePage-Carousal%2Fcarousal-3.png?alt=media&token=84b1dbaf-6e27-4730-bce6-f55af04880e4",
    price: 3500,
    discount: 5,
    finalPrice: 3325,
    estimatedDays: 10,
    boutique: {
      id: "boutique002",
      name: "Style Stitch",
      description: "Contemporary designs with traditional craftsmanship. Specializing in wedding attire and formal wear.",
      ratings: 4.6,
      reviewCount: 93,
      coverImageUrl: "https://firebasestorage.googleapis.com/v0/b/tailor-app-71fe2.firebasestorage.app/o/HomePage-Carousal%2Fcarousal-2.jpg?alt=media&token=e204b0d6-21ea-4aa8-9518-dcde5bfeae8c"
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleSelectAsIs = () => {
    navigate('/measurements');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[2rem] md:pt-[3.8rem] pb-32">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center px-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 mr-3 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 flex-1">Style Details</h1>
        <button 
          onClick={toggleFavorite}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
        </button>
      </div>
      
      <div className="px-4 pt-1">
        {/* Style Image */}
        <div className="mt-2 mb-3 rounded-xl overflow-hidden bg-white shadow-sm">
          <img 
            src={style.imageUrl} 
            alt={style.name}
            className="w-full h-64 md:h-96 object-cover" 
            loading="lazy"
          />
        </div>
        
        {/* Style Title and Price */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{style.name}</h2>
          
          {/* Price display with strikethrough and discount highlight */}
          <div className="mt-3">
            <div className="flex flex-col">
              {/* Original price with strikethrough */}
              <div>
                <span className="text-gray-500 line-through">₹{style.price}</span>
              </div>
              
              {/* Final Price (highlighted) */}
              <p className="text-xl font-bold text-plum">
                ₹{style.finalPrice}
              </p>
              
              {/* Discount below final price */}
              <div className="text-xs text-green-600 font-medium">
                {style.discount}% discount applied
              </div>
              
              <span className="text-sm text-gray-600 mt-1">Est. delivery: {style.estimatedDays} days</span>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="details" className="mb-20">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <div className="space-y-6">
              {/* Style Description */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{style.description}</p>
              </div>
              
              {/* Boutique Profile */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Boutique</h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 mr-3 border border-gray-200">
                    <img 
                      src={style.boutique.coverImageUrl} 
                      alt={style.boutique.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{style.boutique.name}</h4>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm font-medium text-gray-700">{style.boutique.ratings}</span>
                      </div>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{style.boutique.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Other details sections would go here */}
              <div className="bg-white p-3 md:p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">
                  Included Configurations
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-100 rounded-lg p-3">
                    <p className="text-sm font-medium">Neckline</p>
                    <p className="text-sm text-gray-600">Round</p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-3">
                    <p className="text-sm font-medium">Back</p>
                    <p className="text-sm text-gray-600">Medium</p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-3">
                    <p className="text-sm font-medium">Sleeve</p>
                    <p className="text-sm text-gray-600">Short</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="pt-4">
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-center items-center h-60">
              <p className="text-gray-500">Preview not available</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="pt-4">
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-center items-center h-60">
              <p className="text-gray-500">No reviews yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10 shadow-lg">
        <div className="container mx-auto max-w-md flex flex-row gap-2">
          <Button 
            className="flex-1 bg-plum hover:bg-plum/90 py-3 text-sm h-auto"
            onClick={handleSelectAsIs}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Select As-Is
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-plum text-plum hover:bg-plum/5 py-3 text-sm h-auto"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Customize
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StyleDetailsPage;
