import { memo } from 'react'
import { Menu, Moon, Sun, Bell, Search, LogOut } from 'lucide-react'

function getInitials(name) {
  if (!name) return 'AD'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function Header({ title, subtitle, onMenuClick, isDark, onToggleTheme, user, onLogout }) {
  return (
    <header className="sticky top-0 z-30 flex h-24 items-center justify-between gap-4 border-b border-border-subtle bg-background/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-foreground hover:bg-accent lg:hidden studio-focus-ring"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" strokeWidth={2} />
        </button>
        <div className="min-w-0">
          <p className="studio-label mb-0.5 hidden sm:block">Sección actual</p>
          <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">{title}</h1>
          {subtitle ? (
            <p className="hidden truncate text-xs text-muted-foreground sm:block">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar proyecto, venta…"
            className="h-8 w-52 rounded-md border border-border-soft bg-input pl-8 pr-3 text-sm placeholder:text-muted-foreground studio-focus-ring"
          />
        </div>

        <button
          type="button"
          className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground studio-focus-ring"
          aria-label="Notificaciones"
        >
          <Bell className="size-4" strokeWidth={2} />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-record" />
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground studio-focus-ring"
          aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark ? <Sun className="size-4" strokeWidth={2} /> : <Moon className="size-4" strokeWidth={2} />}
        </button>

        <div className="ml-1 hidden items-center gap-2 border-l border-border-subtle pl-2 sm:flex">
          <div
            className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20"
            title={user?.email}
          >
            {getInitials(user?.name)}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground studio-focus-ring"
            aria-label="Cerrar sesión"
          >
            <LogOut className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
