import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TaskHall from "./pages/TaskHall";
import OrderGrab from "./pages/OrderGrab";
import OrderService from "./pages/OrderService";
import Profile from "./pages/Profile";
import ProfileDetails from "./pages/ProfileDetails";
import ProfileAgreements from "./pages/ProfileAgreements";
import MyPerformance from "./pages/MyPerformance";
import Withdraw from "./pages/Withdraw";
import WithdrawHistory from "./pages/WithdrawHistory";
import MyBankCards from "./pages/MyBankCards";
import Invitations from "./pages/Invitations";
import InvitationRewards from "./pages/InvitationRewards";
import Insurance from "./pages/Insurance";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import AppealProgress from "./pages/AppealProgress";
import SalaryExplanation from "./pages/SalaryExplanation";
import CoursePlayer from "./pages/CoursePlayer";
import CourseDetail from "./pages/CourseDetail";
import Reviews from "./pages/Reviews";
import Notifications from "./pages/Notifications";
import LegalPrivacyPolicy from "./pages/LegalPrivacyPolicy";
import LegalServiceAgreement from "./pages/LegalServiceAgreement";
import Workbench from "./pages/Workbench";
import NotFound from "./pages/NotFound";
import MyWallet from "./pages/MyWallet";
import SettlementRules from "./pages/SettlementRules";
import WalletIncome from "./pages/WalletIncome";
import SkillsTraining from "./pages/SkillsTraining";
import CertificationTest from "./pages/CertificationTest";
import NewbieCourse from "./pages/NewbieCourse";
import LocationSelection from "./pages/LocationSelection";
import CertificationIntro from "./pages/CertificationIntro";
import CertificationProcess from "./pages/CertificationProcess";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner 
          position="bottom-center"
          toastOptions={{
            duration: 2500,
            style: {
              marginBottom: '80px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
          <Route path="/register/location" element={<LocationSelection />} />
          <Route path="/certification" element={<CertificationIntro />} />
          <Route path="/certification/process" element={<CertificationProcess />} />
          <Route path="/tasks" element={<TaskHall />} />
          <Route path="/grab/:orderId" element={<OrderGrab />} />
          <Route path="/service/:orderId" element={<OrderService />} />
          <Route path="/workbench" element={<Workbench />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/details" element={<ProfileDetails />} />
          <Route path="/profile/agreements" element={<ProfileAgreements />} />
          
          {/* Wallet & Income Routes */}
          <Route path="/wallet" element={<MyWallet />} />
          <Route path="/wallet/income" element={<WalletIncome />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/withdraw/history" element={<WithdrawHistory />} />
          <Route path="/income/settlement-rules" element={<SettlementRules />} />
          
          {/* Skills Training Routes */}
        <Route path="/skills-training" element={<SkillsTraining />} />
        <Route path="/skills-training/course/0" element={<NewbieCourse />} />
        <Route path="/skills-training/course/:courseId" element={<CoursePlayer />} />
        <Route path="/skills-training/test/:skillId" element={<CertificationTest />} />
        <Route path="/certification-test" element={<CertificationTest />} />
        <Route path="/course/:lessonId" element={<CourseDetail />} />
          
          {/* Other Profile Routes */}
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/help" element={<Help />} />
          <Route path="/appeal-progress/:ticketNumber" element={<AppealProgress />} />
          <Route path="/security" element={<Security />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/income/salary" element={<SalaryExplanation />} />
          
          {/* Legal Routes */}
          <Route path="/legal/service-agreement" element={<LegalServiceAgreement />} />
          <Route path="/legal/privacy-policy" element={<LegalPrivacyPolicy />} />
          
          {/* MVP Out-of-Scope Routes (kept for V1.1) */}
          <Route path="/income/performance" element={<MyPerformance />} />
          <Route path="/wallet/cards" element={<MyBankCards />} />
          <Route path="/invitations" element={<Invitations />} />
          <Route path="/invitation-rewards" element={<InvitationRewards />} />
          <Route path="/insurance" element={<Insurance />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
