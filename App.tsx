import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DistrictProvider } from "@/contexts/DistrictContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AppLayout from "@/components/AppLayout";
import Auth from "@/pages/Auth";
import DistrictSelection from "@/pages/DistrictSelection";
import Dashboard from "@/pages/Dashboard";
import ClimateAlerts from "@/pages/ClimateAlerts";
import CropPlanner from "@/pages/CropPlanner";
import Irrigation from "@/pages/Irrigation";
import CropDiseaseDetector from "@/pages/CropDiseaseDetector";
import CropCalendar from "@/pages/CropCalendar";
import YieldPrediction from "@/pages/YieldPrediction";
import AIAssistant from "@/pages/AIAssistant";
import MarketIntelligence from "@/pages/MarketIntelligence";
import IoTMonitor from "@/pages/IoTMonitor";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <DistrictProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<DistrictSelection />} />
              <Route path="/dashboard" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
              <Route path="/climate" element={<LayoutWrapper><ClimateAlerts /></LayoutWrapper>} />
              <Route path="/crop-planner" element={<LayoutWrapper><CropPlanner /></LayoutWrapper>} />
              <Route path="/disease-detector" element={<LayoutWrapper><CropDiseaseDetector /></LayoutWrapper>} />
              <Route path="/irrigation" element={<LayoutWrapper><Irrigation /></LayoutWrapper>} />
              <Route path="/crop-calendar" element={<LayoutWrapper><CropCalendar /></LayoutWrapper>} />
              <Route path="/yield" element={<LayoutWrapper><YieldPrediction /></LayoutWrapper>} />
              <Route path="/ai-assistant" element={<LayoutWrapper><AIAssistant /></LayoutWrapper>} />
              <Route path="/market" element={<LayoutWrapper><MarketIntelligence /></LayoutWrapper>} />
              <Route path="/iot" element={<LayoutWrapper><IoTMonitor /></LayoutWrapper>} />
              <Route path="/admin" element={<LayoutWrapper><Admin /></LayoutWrapper>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DistrictProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
