import { useState, useTransition } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import Button from '../components/ui/Button'
import AuthShell, { AuthLink, InviteCodeHint } from '../components/auth/AuthShell'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        await register({ name, email, password, inviteCode })
        navigate('/', { replace: true })
      } catch (err) {
        setError(err.message)
      }
    })
  }

  return (
    <AuthShell
      title="Registro de administrador"
      subtitle="Completa tu cuenta con el código que ingeniería habilitó previamente."
      footer={
        <>
          ¿Ya tienes cuenta? <AuthLink to="/login">Inicia sesión</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InviteCodeHint />

        <label className="block space-y-1.5">
          <span className="studio-label">Código de invitación</span>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Ej. VSI-ENG-2026-A1"
            required
            minLength={4}
            className="h-9 w-full rounded-md border border-border-soft bg-input px-3 font-mono text-sm tracking-wide studio-focus-ring"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="studio-label">Nombre</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            minLength={2}
            className="h-9 w-full rounded-md border border-border-soft bg-input px-3 text-sm studio-focus-ring"
          />
        </label>

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
            autoComplete="new-password"
            required
            minLength={8}
            className="h-9 w-full rounded-md border border-border-soft bg-input px-3 text-sm studio-focus-ring"
          />
        </label>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={isPending}>
          <UserPlus className="size-4" />
          {isPending ? 'Registrando…' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthShell>
  )
}
