import { useState, useTransition } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import Button from '../components/ui/Button'
import AuthShell, { AuthLink } from '../components/auth/AuthShell'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const redirectTo = location.state?.from ?? '/'

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        await login({ email, password })
        navigate(redirectTo, { replace: true })
      } catch (err) {
        setError(err.message)
      }
    })
  }

  return (
    <AuthShell
      title="Iniciar sesión"
      subtitle="Accede al estudio con tu cuenta de administrador."
      footer={
        <>
          ¿Primera vez? <AuthLink to="/registro">Regístrate con código de invitación</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="studio-label">Correo</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="h-9 w-full rounded-md border border-border-soft bg-input px-3 text-sm studio-focus-ring"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="studio-label">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            minLength={8}
            className="h-9 w-full rounded-md border border-border-soft bg-input px-3 text-sm studio-focus-ring"
          />
        </label>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={isPending}>
          <LogIn className="size-4" />
          {isPending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </AuthShell>
  )
}
