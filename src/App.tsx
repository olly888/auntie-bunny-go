
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TaskHall from "./pages/TaskHall";
import OrderGrab from "./pages/OrderGrab";
import OrderService from "./pages/OrderService";
import Workbench from "./pages/Workbench";
import Income from "./pages/Income";
import IncomeDetails from "./pages/IncomeDetails";
import MyPerformance from "./pages/MyPerformance";
import MyBankCards from "./pages/MyBankCards";
import SalaryExplanation from "./pages/SalaryExplanation";
import Profile from "./pages/Profile";
import ProfileDetails from "./pages/ProfileDetails";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import TrainingCenter from "./pages/TrainingCenter";
import Reviews from "./pages/Reviews";
import Invitations from "./pages/Invitations";
import Insurance from "./pages/Insurance";
import Notifications from "./pages/Notifications";
import Security from "./pages/Security";
import LegalServiceAgreement from "./pages/LegalServiceAgreement";
import LegalPrivacyPolicy from "./pages/LegalPrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tasks" element={<TaskHall />} />
            <Route path="/grab/:orderId" element={<OrderGrab />} />
            <Route path="/service/:orderId" element={<OrderService />} />
            <Route path="/workbench" element={<Workbench />} />
            <Route path="/income" element={<Income />} />
            <Route path="/income/details" element={<IncomeDetails />} />
            <Route path="/income/performance" element={<MyPerformance />} />
            <Route path="/income/salary" element={<SalaryExplanation />} />
            <Route path="/wallet/cards" element={<MyBankCards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/details" element={<ProfileDetails />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/training" element={<TrainingCenter />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/invitations" element={<Invitations />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/security" element={<Security />} />
            <Route path="/legal/service-agreement" element={<LegalServiceAgreement />} />
            <Route path="/legal/privacy-policy" element={<LegalPrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
