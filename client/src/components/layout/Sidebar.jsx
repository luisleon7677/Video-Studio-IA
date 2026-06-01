import { NavLink } from 'react-router-dom'
import { Clapperboard, X } from 'lucide-react'
import { navItems } from '../../data/navigation'

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 flex h-full w-72 flex-col
          border-r border-sidebar-border bg-sidebar text-sidebar-foreground
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Clapperboard className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Video Studio IA</p>
              <p className="text-xs text-muted-foreground">Panel de control</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Módulos
          </p>
          <ul className="space-y-1">
            {navItems.map(({ id, label, path, icon: Icon, description }) => (
              <li key={id}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`mt-0.5 size-5 shrink-0 ${isActive ? '' : 'text-muted-foreground group-hover:text-inherit'}`} />
                      <span>
                        <span className="block text-sm font-medium">{label}</span>
                        <span className={`block text-xs ${isActive ? 'text-sidebar-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {description}
                        </span>
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Admin</p>
              <p className="truncate text-xs text-muted-foreground">admin@videostudio.ia</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
