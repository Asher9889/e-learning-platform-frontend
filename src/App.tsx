import { useEffect } from 'react';
import { initializeApp } from './bootstrap/initializeApp';
import './App.css'

function App() {

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <>
      App
    </>
  )
}

export default App
