import { useEffect } from 'react';
import { initializeApp } from './bootstrap/initializeApp';
import './App.css'
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

function App() {

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <RouterProvider router={router} />
  );
}

export default App
