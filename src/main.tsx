import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { OnlineStatusProvider } from "@/hooks/use-online-status";

createRoot(document.getElementById("root")!).render(
  <OnlineStatusProvider>
    <App />
  </OnlineStatusProvider>
);
