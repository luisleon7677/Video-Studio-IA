export default function Panel({ children, className = '', padding = true }) {
  return (
    <section className={`studio-panel ${padding ? 'p-0' : ''} ${className}`.trim()}>
      {children}
    </section>
  )
}

export function PanelHeader({ title, action, meta }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-3.5">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {meta ? <p className="mt-0.5 studio-timecode">{meta}</p> : null}
      </div>
      {action ?? null}
    </div>
  )
}
