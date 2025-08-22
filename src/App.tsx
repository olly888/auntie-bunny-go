
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { OnlineStatusProvider } from "@/hooks/use-online-status";
import Index from "./pages/Index";
import Workbench from "./pages/Workbench";
import Profile from "./pages/Profile";
import ProfileDetails from "./pages/ProfileDetails";
import Income from "./pages/Income";
import IncomeDetails from "./pages/IncomeDetails";
import Performance from "./pages/Performance";
import BankCards from "./pages/BankCards";
import Reviews from "./pages/Reviews";
import Insurance from "./pages/Insurance";
import Settings from "./pages/Settings";
import Security from "./pages/Security";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import TrainingCenter from "./pages/TrainingCenter";
import OrderGrab from "./pages/OrderGrab";
import OrderService from "./pages/OrderService";
import LegalServiceAgreement from "./pages/LegalServiceAgreement";
import LegalPrivacyPolicy from "./pages/LegalPrivacyPolicy";
import NotFound from "./pages/NotFound";
import MyQRCode from "./pages/MyQRCode";
import ReferralLanding from "./pages/ReferralLanding";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <OnlineStatusProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/workbench" element={<Workbench />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/details" element={<ProfileDetails />} />
                <Route path="/my-qr" element={<MyQRCode />} />
                <Route path="/r/:code" element={<ReferralLanding />} />
                <Route path="/income" element={<Income />} />
                <Route path="/income/details" element={<IncomeDetails />} />
                <Route path="/income/performance" element={<Performance />} />
                <Route path="/income/bank-cards" element={<BankCards />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/insurance" element={<Insurance />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/security" element={<Security />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/help" element={<Help />} />
                <Route path="/training" element={<TrainingCenter />} />
                <Route path="/order-grab" element={<OrderGrab />} />
                <Route path="/order-service" element={<OrderService />} />
                <Route path="/legal/service-agreement" element={<LegalServiceAgreement />} />
                <Route path="/legal/privacy-policy" element={<LegalPrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </OnlineStatusProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
