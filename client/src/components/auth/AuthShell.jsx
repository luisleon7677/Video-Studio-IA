import { Link } from 'react-router-dom'
import { Film, KeyRound, Shield } from 'lucide-react'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
            <Film className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">Video Studio IA</p>
            <p className="studio-timecode">Panel de administración</p>
          </div>
        </div>

        <section className="studio-panel overflow-hidden">
          <div className="border-b border-border-subtle px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md bg-muted p-2 text-muted-foreground">
                <Shield className="size-4" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-5">{children}</div>

          {footer ? (
            <div className="border-t border-border-subtle px-5 py-4 text-sm text-muted-foreground">
              {footer}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

export function InviteCodeHint() {
  return (
    <p className="flex items-start gap-2 rounded-md border border-border-soft bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
      <KeyRound className="mt-0.5 size-3.5 shrink-0 text-chart-1" />
      El código lo crea ingeniería como un registro en la tabla{' '}
      <span className="font-mono text-foreground/80">users</span> (solo con el campo{' '}
      <span className="font-mono text-foreground/80">code</span>). Después el administrador
      completa nombre, correo y contraseña desde esta pantalla.
    </p>
  )
}

export function AuthLink({ to, children }) {
  return (
    <Link to={to} className="font-medium text-primary hover:underline studio-focus-ring rounded-sm">
      {children}
    </Link>
  )
}
