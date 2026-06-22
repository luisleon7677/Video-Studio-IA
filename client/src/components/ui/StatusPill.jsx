const styles = {
  Activo: 'bg-record/12 text-record ring-1 ring-record/20',
  Inactivo: 'bg-muted text-muted-foreground ring-1 ring-border-soft',
  'En edición': 'bg-chart-2/12 text-chart-2 ring-1 ring-chart-2/25',
  Renderizando: 'bg-chart-3/12 text-chart-3 ring-1 ring-chart-3/25',
  Completado: 'bg-chart-1/12 text-chart-1 ring-1 ring-chart-1/25',
  Borrador: 'bg-muted text-muted-foreground ring-1 ring-border-soft',
}

export default function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium tracking-wide ${styles[status] ?? styles.Borrador}`}
    >
      {status}
    </span>
  )
}
