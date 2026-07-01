import { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import PageLoader from './components/ui/PageLoader'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider } from './hooks/useAuth'
import {
  DashboardPage,
  VideoEditingPage,
  TemplatesPage,
  AiProcessingPage,
  VideoHistoryPage,
  SalesHistoryPage,
  SellersPage,
  LoginPage,
  RegisterPage,
  AnimationPage
} from './routes/lazyPages'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageLoader />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/registro"
            element={
              <Suspense fallback={<PageLoader />}>
                <RegisterPage />
              </Suspense>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={<PageLoader />}>
                    <DashboardPage />
                  </Suspense>
                }
              />
              <Route
                path="audios"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <TemplatesPage />
                  </Suspense>
                }
              />
              <Route path="plantillas" element={<Navigate to="/audios" replace />} />

              <Route
              path='animations'
              element={
                <Suspense fallback={<PageLoader/>}>
                  <AnimationPage></AnimationPage>
                </Suspense>
              }
              >
              </Route>
              <Route
                path="procesamiento-ia"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AiProcessingPage />
                  </Suspense>
                }
              />
              <Route
                path="historial-videos"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <VideoHistoryPage />
                  </Suspense>
                }
              />
              <Route
                path="historial-ventas"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <SalesHistoryPage />
                  </Suspense>
                }
              />
              <Route
                path="vendedores"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <SellersPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
