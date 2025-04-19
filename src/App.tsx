import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OrderProvider } from "./utils/OrderContext";

import AddressPage from "./pages/AddressPage";
import BoutiquesPage from "./pages/BoutiquesPage";
import BoutiqueDetailPage from "./pages/BoutiqueDetailPage";
import ServiceOptionsPage from "./pages/ServiceOptionsPage";
import CustomDesignPage from "./pages/CustomDesignPage";
import ClothSelectionPage from "./pages/ClothSelectionPage";
import MeasurementPage from "./pages/MeasurementPage";
import OrderSummaryPage from "./pages/OrderSummaryPage";
import PickupSchedulingPage from "./pages/PickupSchedulingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OrderProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/boutiques" element={<BoutiquesPage />} />
              <Route path="/boutique/:id" element={<BoutiqueDetailPage />} />
              <Route path="/service-options" element={<ServiceOptionsPage />} />
              <Route path="/custom-design" element={<CustomDesignPage />} />
              <Route path="/cloth-selection" element={<ClothSelectionPage />} />
              <Route path="/measurement" element={<MeasurementPage />} />
              <Route path="/order-summary" element={<OrderSummaryPage />} />
              <Route path="/pickup-scheduling" element={<PickupSchedulingPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
