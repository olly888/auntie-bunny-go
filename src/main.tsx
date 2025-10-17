import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { OnlineStatusProvider } from "@/hooks/use-online-status";
import { AuthProvider } from "@/contexts/AuthContext";
import { MockAuthProvider } from "@/hooks/useMockAuth";
import { BrowserRouter } from 'react-router-dom';

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
