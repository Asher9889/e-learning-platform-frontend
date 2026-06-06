import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext/ThemeProvider";
import { StrictMode } from "react";
import {  QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store';
import { queryClient } from "./config";
import "./index.css";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
          <App />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);