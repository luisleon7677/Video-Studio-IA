import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import {
  Plus,
  Search,
  Copy,
  Pencil,
  Trash2,
  LayoutTemplate,
  Clock,
  FileText,
  X,
  Check,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Panel, { PanelHeader } from '../components/ui/Panel'
import Button from '../components/ui/Button'
import MetricTile from '../components/ui/MetricTile'
import {
  createTemplate,
  deleteTemplate,
  fetchTemplates,
  updateTemplate,
} from '../api/templates'
import {
  contentPreview,
  countRecentlyUpdated,
  formatTemplateDate,
} from '../utils/templates'

const emptyForm = { name: '', content: '' }

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [mode, setMode] = useState('view')
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [copyFeedback, setCopyFeedback] = useState('')
  const [isPending, startTransition] = useTransition()

  const selected = useMemo(
    () => templates.find((tpl) => tpl.id === selectedId) ?? null,
    [templates, selectedId],
  )

  const recentCount = useMemo(() => countRecentlyUpdated(templates), [templates])

  const loadTemplates = useCallback(async () => {
    try {
      setError('')
      const data = await fetchTemplates({ search })
      setTemplates(data.items)

      if (data.items.length === 0) {
        setSelectedId(null)
        return
      }

      setSelectedId((current) => {
        if (current && data.items.some((tpl) => tpl.id === current)) return current
        return data.items[0].id
      })
    } catch (err) {
      setError(err.message)
      setTemplates([])
      setSelectedId(null)
    }
  }, [search])

  useEffect(() => {
    startTransition(() => {
      void loadTemplates()
    })
  }, [loadTemplates])

  function openCreate() {
    setMode('create')
    setForm(emptyForm)
    setSelectedId(null)
    setError('')
  }

  function openEdit() {
    if (!selected) return
    setMode('edit')
    setForm({ name: selected.name, content: selected.content })
    setError('')
  }

  function cancelForm() {
    setMode('view')
    setForm(emptyForm)
    setError('')
    if (templates.length > 0 && selectedId === null) {
      setSelectedId(templates[0].id)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      if (mode === 'create') {
        const created = await createTemplate(form)
        await loadTemplates()
        setSelectedId(created.id)
        setMode('view')
        setForm(emptyForm)
        return
      }

      if (mode === 'edit' && selected) {
        await updateTemplate(selected.id, form)
        await loadTemplates()
        setMode('view')
        setForm(emptyForm)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete() {
    if (!selected) return
    if (!window.confirm(`¿Eliminar la plantilla "${selected.name}"?`)) return

    try {
      setError('')
      await deleteTemplate(selected.id)
      const remaining = templates.filter((tpl) => tpl.id !== selected.id)
      setTemplates(remaining)
      setSelectedId(remaining[0]?.id ?? null)
      setMode('view')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCopy() {
    if (!selected?.content) return
    try {
      await navigator.clipboard.writeText(selected.content)
      setCopyFeedback('Copiado')
      setTimeout(() => setCopyFeedback(''), 2000)
    } catch {
      setCopyFeedback('Error al copiar')
      setTimeout(() => setCopyFeedback(''), 2000)
    }
  }

  const isEditing = mode === 'create' || mode === 'edit'

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title="Plantillas"
        description="Biblioteca de prompts reutilizables para guiones, montaje y generación con IA."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Nueva plantilla
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <MetricTile
          label="Plantillas activas"
          value={String(templates.length)}
          icon={LayoutTemplate}
          accent="text-record"
        />
        <MetricTile
          label="Actualizadas (7 días)"
          value={String(recentCount)}
          icon={Clock}
          accent="text-chart-1"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <Panel padding={false}>
          <div className="border-b border-border-subtle px-4 py-3 sm:px-5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o contenido…"
                className="h-8 w-full rounded-md border border-border-soft bg-input pl-8 pr-3 text-sm studio-focus-ring"
              />
            </div>
          </div>

          <ul className="max-h-[480px] divide-y divide-border-subtle overflow-y-auto">
            {isPending ? (
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                Cargando plantillas…
              </li>
            ) : templates.length === 0 ? (
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                {search
                  ? 'No hay plantillas que coincidan con la búsqueda.'
                  : 'Aún no hay plantillas. Crea la primera.'}
              </li>
            ) : (
              templates.map((tpl) => {
                const isSelected = selectedId === tpl.id && mode === 'view'
                return (
                  <li key={tpl.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(tpl.id)
                        setMode('view')
                        setForm(emptyForm)
                        setError('')
                      }}
                      className={`w-full px-4 py-3.5 text-left transition-colors studio-focus-ring sm:px-5 ${
                        isSelected ? 'bg-accent/80' : 'hover:bg-accent/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium leading-snug">{tpl.name}</p>
                        <span className="studio-timecode shrink-0">
                          {formatTemplateDate(tpl.updatedAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {contentPreview(tpl.content)}
                      </p>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </Panel>

        <Panel padding={false} className="flex min-h-[480px] flex-col">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
              <PanelHeader
                title={mode === 'create' ? 'Nueva plantilla' : 'Editar plantilla'}
                meta="Nombre y contenido del prompt"
                action={
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground studio-focus-ring"
                    aria-label="Cancelar"
                  >
                    <X className="size-4" />
                  </button>
                }
              />

              <div className="space-y-4 p-4 sm:p-5">
                <label className="block space-y-1.5">
                  <span className="studio-label">Nombre</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej. Promo producto — 60s"
                    required
                    minLength={3}
                    className="h-9 w-full rounded-md border border-border-soft bg-input px-3 text-sm studio-focus-ring"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="studio-label">Contenido del prompt</span>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Escribe el prompt. Usa {{variable}} para campos dinámicos."
                    required
                    minLength={3}
                    rows={12}
                    className="w-full resize-y rounded-md border border-border-soft bg-input px-3 py-2 font-mono text-xs leading-relaxed studio-focus-ring"
                  />
                </label>

                {error ? <p className="text-sm text-destructive">{error}</p> : null}
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t border-border-subtle px-4 py-3 sm:px-5">
                <Button type="submit" size="sm">
                  <Check className="size-3.5" />
                  {mode === 'create' ? 'Crear plantilla' : 'Guardar cambios'}
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={cancelForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          ) : selected ? (
            <>
              <PanelHeader
                title={selected.name}
                meta={`Actualizada ${formatTemplateDate(selected.updatedAt)}`}
                action={
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground studio-focus-ring"
                      aria-label="Copiar prompt"
                    >
                      <Copy className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={openEdit}
                      className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground studio-focus-ring"
                      aria-label="Editar plantilla"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive studio-focus-ring"
                      aria-label="Eliminar plantilla"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                }
              />

              {copyFeedback ? (
                <p className="border-b border-border-subtle px-5 py-2 text-xs text-chart-1">
                  {copyFeedback}
                </p>
              ) : null}

              <div className="flex-1 overflow-hidden p-4 sm:p-5">
                <p className="studio-label mb-2">Contenido del prompt</p>
                <pre className="studio-inset max-h-[320px] overflow-auto whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-foreground/90">
                  {selected.content}
                </pre>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="size-3.5 shrink-0" />
                  Variables entre llaves (ej. {'{{producto}}'}) se completan al usar la plantilla.
                </p>
              </div>

              {error ? (
                <p className="border-t border-border-subtle px-5 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <LayoutTemplate className="size-8 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                {templates.length === 0
                  ? 'Crea tu primera plantilla para empezar.'
                  : 'Selecciona una plantilla de la lista.'}
              </p>
              {templates.length === 0 ? (
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-3.5" />
                  Nueva plantilla
                </Button>
              ) : null}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
