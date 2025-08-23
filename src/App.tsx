import { OnlineStatusProvider } from "@/hooks/use-online-status";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Workbench from "./pages/Workbench";
import TaskHall from "./pages/TaskHall";
import OrderGrab from "./pages/OrderGrab";
import OrderService from "./pages/OrderService";
import Income from "./pages/Income";
import TrainingCenter from "./pages/TrainingCenter";
import Profile from "./pages/Profile";
import ProfileDetails from "./pages/ProfileDetails";
import Notifications from "./pages/Notifications";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Reviews from "./pages/Reviews";
import Insurance from "./pages/Insurance";
import LegalServiceAgreement from "./pages/LegalServiceAgreement";
import LegalPrivacyPolicy from "./pages/LegalPrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <OnlineStatusProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Workbench />} />
            <Route path="/task-hall" element={<TaskHall />} />
            <Route path="/order-grab" element={<OrderGrab />} />
            <Route path="/order-service" element={<OrderService />} />
            <Route path="/income" element={<Income />} />
            <Route path="/training" element={<TrainingCenter />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/details" element={<ProfileDetails />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/insurance" element={<Insurance />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/security" element={<Security />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/legal/service-agreement" element={<LegalServiceAgreement />} />
        <Route path="/legal/privacy" element={<LegalPrivacyPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </OnlineStatusProvider>
  </QueryClientProvider>
);

export default App;
