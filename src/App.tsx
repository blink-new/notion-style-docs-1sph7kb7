
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import PageView from './pages/PageView';
import SharedPage from './pages/SharedPage';
import { supabase } from './lib/supabase';

function App() {
  const { getUser } = useAuthStore();

  useEffect(() => {
    // Initial user fetch
    getUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="page/:id" element={<PageView />} />
        </Route>
        <Route path="/shared/:id" element={<SharedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;