import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TooltipProvider } from "@/components/ui/tooltip"
import { Provider } from 'react-redux';
import { store } from '@/store/store.ts'
import { queryClient } from '@/config'
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sileo";

const toasterOptions = {
  fill: "#171717",
  styles: {
    description: "text-white/75!",
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster options={toasterOptions} theme="dark" position="top-center" />
          <App />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
