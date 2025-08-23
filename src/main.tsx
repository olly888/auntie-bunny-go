import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { OnlineStatusProvider } from "@/hooks/use-online-status";
import { MockAuthProvider } from "@/hooks/useMockAuth";
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <OnlineStatusProvider>
      <MockAuthProvider>
        <App />
      </MockAuthProvider>
    </OnlineStatusProvider>
  </BrowserRouter>
);
