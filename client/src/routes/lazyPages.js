import { lazy } from 'react'

export const DashboardPage = lazy(() => import('../pages/Dashboard'))
export const VideoEditingPage = lazy(() => import('../pages/VideoEditing'))
export const SalesHistoryPage = lazy(() => import('../pages/SalesHistory'))
export const SellersPage = lazy(() => import('../pages/Sellers'))
export const TemplatesPage = lazy(() => import('../pages/Templates'))
export const AiProcessingPage = lazy(() => import('../pages/AiProcessing'))
export const VideoHistoryPage = lazy(() => import('../pages/VideoHistory'))
export const LoginPage = lazy(() => import('../pages/Login'))
export const RegisterPage = lazy(() => import('../pages/Register'))
export const AnimationPage = lazy(()=> import('../pages/Animations'))

/** Precarga el chunk de la ruta en hover/focus (bundle-preload). */
export const routePreloaders = {
  '/': () => import('../pages/Dashboard'),
  '/edicion-video': () => import('../pages/VideoEditing'),
  '/audios': () => import('../pages/Templates'),
  '/procesamiento-ia': () => import('../pages/AiProcessing'),
  '/historial-videos': () => import('../pages/VideoHistory'),
  '/historial-ventas': () => import('../pages/SalesHistory'),
  '/vendedores': () => import('../pages/Sellers'),
  '/animations':()=>import('../pages/Animations')
}
