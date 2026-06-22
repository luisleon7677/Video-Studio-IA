import { memo, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { Clapperboard, X } from 'lucide-react'
import { navItems } from '../../data/navigation'
import { routePreloaders } from '../../routes/lazyPages'

function preloadRoute(path) {
  const preload = routePreloaders[path]
  if (preload) preload()
}

function Sidebar({ isOpen, onClose }) {
  const handleNavIntent = useCallback((path) => {
    preloadRoute(path)
  }, [])

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-viewport/60 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={`
          fixed  pt-4 top-0 left-0 z-50 flex h-full w-[17.5rem] flex-col
          border-r border-border-subtle bg-sidebar text-sidebar-foreground
          transition-transform duration-300 ease-out
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-md bg-record text-primary-foreground">
              <Clapperboard className="size-4" strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none tracking-tight">Video Studio IA</p>
              <p className="mt-1 studio-timecode text-[10px]">Suite de producción</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent lg:hidden studio-focus-ring"
            aria-label="Cerrar menú"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-3">
          <p className="studio-label mb-2 px-2">Módulos</p>
          <ul className="space-y-0.5">
            {navItems.map(({ id, label, path, icon: Icon }) => (
              <li key={id}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  onClick={onClose}
                  onMouseEnter={() => handleNavIntent(path)}
                  onFocus={() => handleNavIntent(path)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-md py-2.5 pl-3 pr-2 text-sm transition-colors duration-150 studio-focus-ring ${
                      isActive
                        ? 'studio-nav-active font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`
                  }
                >
                  <Icon className="size-4 shrink-0" strokeWidth={2} />
                  <span className="truncate">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border-subtle p-3">
          <div className="flex items-center gap-2.5 rounded-md bg-accent/80 px-2.5 py-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-muted font-mono text-[11px] font-semibold text-foreground">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight">Admin</p>
              <p className="truncate studio-timecode text-[10px]">admin@videostudio.ia</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default memo(Sidebar)
