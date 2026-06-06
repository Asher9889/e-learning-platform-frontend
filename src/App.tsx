// src/App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { AppRoutes } from './routes/AppRoutes';
import publicRoutes, { authRoutes, protectedRoutes } from './routes';
import { LandingPageLayout } from './components/layout/LandingPageLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import NotFoundPage from './pages/not-found';
import ProtectedRoute from './guards/ProtectedRoute';
import PublicRoute from './guards/PublicRoute';


function App() {
  return (
    <BrowserRouter>
      {/* <AppRoutes /> */}
      <Routes>

         {/* Auth Routes */}
        <Route element={<PublicRoute />}>
          {authRoutes.map((r, idx) => (
            <Route
              key={`${r.path}-${idx}`}
              path={r.path}
              element={<r.element />}
            />
          ))}
        </Route>
        {/* <Route element={<PublicRoute />}> */}
          {publicRoutes?.length > 0 && publicRoutes.map((r, idx) => (
            <Route
              key={r?.path + idx}
              path={r?.path}
              element={r?.element ? (
                <LandingPageLayout>
                  <r.element />
                </LandingPageLayout>
              ) : "gh"}
            />
          ))}
        {/* </Route> */}

        <Route element={<ProtectedRoute />}>
          {protectedRoutes.map((r, idx) => {
            console.log("protectedRoutes");

            return (
              <Route
                key={r.path + idx}
                path={r.path}
                element={
                  <DashboardLayout>
                    <r.element />
                  </DashboardLayout>
                }
              />
            );
          })}
        </Route>


        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;