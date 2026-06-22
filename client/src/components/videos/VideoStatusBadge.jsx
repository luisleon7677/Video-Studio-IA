const statusStyles = {
  completed: 'bg-chart-1/12 text-chart-1 ring-1 ring-chart-1/25',
  processing: 'bg-record/12 text-record ring-1 ring-record/25',
  failed: 'bg-destructive/12 text-destructive ring-1 ring-destructive/25',
}

const statusLabels = {
  completed: 'Completado',
  processing: 'Procesando',
  failed: 'Fallido',
}

export default function VideoStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ${statusStyles[status] ?? ''}`}
    >
      {statusLabels[status] ?? status}
    </span>
  )
}
