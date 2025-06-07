import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OrderProvider } from "./utils/OrderContext";
import { AuthProvider } from "./utils/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import AddressPage from "./pages/AddressPage";
import BoutiquesPage from "./pages/BoutiquesPage";
import BoutiqueDetailPage from "./pages/BoutiqueDetailPage";
import ServiceOptionsPage from "./pages/ServiceOptionsPage";
import CustomDesignPage from "./pages/CustomDesignPage";
import PredesignedStylesPage from "./pages/PredesignedStylesPage";
import StyleDetailsPage from "./pages/StyleDetailsPage.simple";
import ClothSelectionPage from "./pages/ClothSelectionPage";
import MeasurementPage from "./pages/MeasurementPage";
import OrderSummaryPage from "./pages/OrderSummaryPage";
import PickupSchedulingPage from "./pages/PickupSchedulingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
// Login page removed - using bottom sheet instead
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import AddressesPage from "./pages/AddressesPage";
import DeliveryAddressPage from "./pages/DeliveryAddressPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import TopNav from "./components/TopNav";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <OrderProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen">
                <TopNav />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/boutiques" element={<BoutiquesPage />} />
                  <Route
                    path="/boutique/:boutiqueId"
                    element={<BoutiqueDetailPage />}
                  />

                  {/* Nested routes for design flow */}
                  <Route path="/boutique/:boutiqueId/service/:serviceId">
                    <Route index element={<ServiceOptionsPage />} />
                    <Route
                      path="custom-design"
                      element={<CustomDesignPage />}
                    />
                    <Route
                      path="predesigned-styles"
                      element={<PredesignedStylesPage />}
                    />
                    <Route
                      path="predesigned-styles/:styleId"
                      element={<StyleDetailsPage />}
                    />
                    <Route
                      path="cloth-selection"
                      element={<ClothSelectionPage />}
                    />
                    <Route path="measurement" element={<MeasurementPage />} />
                    <Route
                      path="delivery-address"
                      element={<DeliveryAddressPage />}
                    />
                    <Route
                      path="order-summary"
                      element={<OrderSummaryPage />}
                    />
                    <Route
                      path="pickup-scheduling"
                      element={<PickupSchedulingPage />}
                    />
                    <Route path="confirmation" element={<ConfirmationPage />} />
                  </Route>

                  {/* Fallback routes for direct access */}
                  <Route
                    path="/service-options"
                    element={<ServiceOptionsPage />}
                  />
                  <Route path="/custom-design" element={<CustomDesignPage />} />
                  <Route
                    path="/predesigned-styles"
                    element={<PredesignedStylesPage />}
                  />
                  <Route
                    path="/predesigned-styles/:styleId"
                    element={<StyleDetailsPage />}
                  />
                  <Route
                    path="/service/:serviceId/style/:styleId"
                    element={<StyleDetailsPage />}
                  />
                  <Route
                    path="/cloth-selection"
                    element={
                      <PrivateRoute>
                        <ClothSelectionPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/measurement"
                    element={
                      <PrivateRoute>
                        <MeasurementPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/measurements"
                    element={
                      <PrivateRoute>
                        <MeasurementPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/delivery-address"
                    element={
                      <PrivateRoute>
                        <DeliveryAddressPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/order-summary"
                    element={
                      <PrivateRoute>
                        <OrderSummaryPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/pickup-scheduling"
                    element={
                      <PrivateRoute>
                        <PickupSchedulingPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/confirmation"
                    element={
                      <PrivateRoute>
                        <ConfirmationPage />
                      </PrivateRoute>
                    }
                  />

                  {/* Authentication and profile routes */}
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/edit-profile"
                    element={
                      <PrivateRoute>
                        <EditProfilePage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addresses"
                    element={
                      <PrivateRoute>
                        <AddressesPage />
                      </PrivateRoute>
                    }
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </OrderProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
