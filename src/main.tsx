import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { OnlineStatusProvider } from "@/hooks/use-online-status";
import { AuthProvider } from "@/contexts/AuthContext";
import { MockAuthProvider } from "@/hooks/useMockAuth";
import { BrowserRouter } from 'react-router-dom';

// SECURITY: Clear mock auth data in production builds
if (import.meta.env.PROD) {
  localStorage.removeItem('mock_user');
  localStorage.removeItem('mock_user_profile');
  localStorage.removeItem('last_login_method');
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MockAuthProvider>
      <OnlineStatusProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </OnlineStatusProvider>
    </MockAuthProvider>
  </BrowserRouter>
);
