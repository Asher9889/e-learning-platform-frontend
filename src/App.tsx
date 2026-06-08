import { useEffect } from 'react';
import { initializeApp } from './bootstrap/initializeApp';
import './App.css'
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useAppSelector } from './store/hooks';
import SplashScreen from '#components/common/SplashScreen';
import { useBootstrap } from './bootstrap/useBootStrap';

function App() {

  useBootstrap();

  const status = useAppSelector(state => state.auth.status);

  if (status === "CHECKING") {
    return <SplashScreen />;
  }

  return (
    <RouterProvider router={router} />
  );
}

export default App
