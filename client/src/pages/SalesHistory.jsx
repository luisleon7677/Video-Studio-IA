import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { Search, Filter, Receipt, Building2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import Button from '../components/ui/Button'
import MetricTile from '../components/ui/MetricTile'
import ChannelBadge from '../components/sales/ChannelBadge'
import SalesTrendChart from '../components/sales/SalesTrendChart'
import { getCompanyAccentClass } from '../utils/companyColors'
import { deleteSale, fetchSales, fetchSalesTrend } from '../api/sales'
import { formatSaleDateTime } from '../data/mock/salesHistory'

const PAGE_SIZE = 5

const emptySummary = { total: 0, byCompany: {}, companies: [] }
const emptyPagination = { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 }
const emptyTrend = { companies: [], points: [] }

export default function SalesHistory() {
  const [channelFilter, setChannelFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sales, setSales] = useState([])
  const [summary, setSummary] = useState(emptySummary)
  const [trend, setTrend] = useState(emptyTrend)
  const [pagination, setPagination] = useState(emptyPagination)
  const [error, setError] = useState('')
  const [isTrendLoading, setIsTrendLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const channelFilters = useMemo(
    () => [
      { id: 'all', label: 'Todos' },
      ...summary.companies.map((company) => ({ id: company, label: company })),
    ],
    [summary.companies],
  )

  const loadSales = useCallback(async () => {
    try {
      setError('')
      const data = await fetchSales({
        page,
        limit: PAGE_SIZE,
        search,
        channel: channelFilter,
      })
      setSales(data.items)
      setSummary(data.summary)
      setPagination(data.pagination)
    } catch {
      setError('No se pudo cargar el historial de ventas.')
      setSales([])
      setSummary(emptySummary)
      setPagination(emptyPagination)
    }
  }, [page, search, channelFilter])

  const loadTrend = useCallback(async () => {
    try {
      setIsTrendLoading(true)
      const data = await fetchSalesTrend()
      setTrend(data)
    } catch {
      setTrend(emptyTrend)
    } finally {
      setIsTrendLoading(false)
    }
  }, [])

  useEffect(() => {
    startTransition(() => {
      void loadSales()
    })
  }, [loadSales])

  useEffect(() => {
    void loadTrend()
  }, [loadTrend])

  useEffect(() => {
    setPage(1)
  }, [search, channelFilter])

  useEffect(() => {
    if (channelFilter !== 'all' && !summary.companies.includes(channelFilter)) {
      setChannelFilter('all')
    }
  }, [channelFilter, summary.companies])

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este registro de venta?')) return

    try {
      await deleteSale(id)
      await loadTrend()
      if (sales.length === 1 && page > 1) {
        setPage((current) => current - 1)
      } else {
        await loadSales()
      }
    } catch {
      setError('No se pudo eliminar la venta.')
    }
  }

  const canGoPrev = pagination.page > 1
  const canGoNext = pagination.page < pagination.totalPages

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title="Historial de ventas realizadas"
        description="Registro de ventas por vendedor, código de 4 dígitos, fecha y hora exacta, y empresa de origen."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Total registros"
          value={String(summary.total)}
          icon={Receipt}
          accent="text-record"
        />
        {summary.companies.map((company) => (
          <MetricTile
            key={company}
            label={`Ventas ${company}`}
            value={String(summary.byCompany[company] ?? 0)}
            icon={Building2}
            accent={getCompanyAccentClass(company)}
          />
        ))}
      </div>

      <SalesTrendChart
        companies={trend.companies}
        points={trend.points}
        isLoading={isTrendLoading}
      />

      <Panel padding={false}>
        <div className="flex flex-col gap-3 border-b border-border-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Listado de ventas</h3>
            <p className="studio-timecode mt-0.5">
              {pagination.total} resultados · página {pagination.page} de {Math.max(pagination.totalPages, 1)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre o código…"
                className="h-8 w-full min-w-[200px] rounded-md border border-border-soft bg-input pl-8 pr-3 text-sm studio-focus-ring sm:w-52"
              />
            </div>
            <div className="flex rounded-md border border-border-soft p-0.5">
              {channelFilters.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setChannelFilter(ch.id)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors studio-focus-ring ${
                    channelFilter === ch.id
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm">
              <Filter className="size-3.5" />
              Más filtros
            </Button>
          </div>
        </div>

        {error ? (
          <p className="px-5 py-6 text-sm text-destructive">{error}</p>
        ) : null}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="studio-label px-5 py-2.5">Vendedor</th>
                <th className="studio-label px-5 py-2.5">Código</th>
                <th className="studio-label px-5 py-2.5">Fecha y hora</th>
                <th className="studio-label px-5 py-2.5">Empresa</th>
                <th className="studio-label px-5 py-2.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {isPending ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    Cargando ventas…
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    No hay ventas que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="transition-colors hover:bg-accent/30 [content-visibility:auto] [contain-intrinsic-size:0_56px]"
                  >
                    <td className="px-5 py-3.5 font-medium">{sale.sellerName}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-sm font-semibold tabular-nums tracking-widest">
                        {sale.sellerCode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <time dateTime={sale.soldAt} className="studio-timecode text-foreground/90">
                        {formatSaleDateTime(sale.soldAt)}
                      </time>
                    </td>
                    <td className="px-5 py-3.5">
                      <ChannelBadge channel={sale.channel} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDelete(sale.id)}
                        aria-label={`Eliminar venta de ${sale.sellerName}`}
                      >
                        <Trash2 className="size-3.5" />
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border-subtle md:hidden">
          {isPending ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">Cargando ventas…</p>
          ) : sales.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No hay ventas que coincidan con la búsqueda.
            </p>
          ) : (
            sales.map((sale) => (
              <article
                key={sale.id}
                className="space-y-2 p-4 [content-visibility:auto] [contain-intrinsic-size:0_120px]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{sale.sellerName}</p>
                  <ChannelBadge channel={sale.channel} />
                </div>
                <p className="font-mono text-sm font-semibold tabular-nums tracking-widest text-muted-foreground">
                  Código {sale.sellerCode}
                </p>
                <time dateTime={sale.soldAt} className="studio-timecode block">
                  {formatSaleDateTime(sale.soldAt)}
                </time>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(sale.id)}
                >
                  <Trash2 className="size-3.5" />
                  Eliminar
                </Button>
              </article>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle px-4 py-3 sm:px-5">
          <p className="studio-timecode text-xs">
            Mostrando {sales.length} de {pagination.total} · {PAGE_SIZE} por página
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!canGoPrev || isPending}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft className="size-3.5" />
              Anterior
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!canGoNext || isPending}
              onClick={() => setPage((current) => current + 1)}
            >
              Siguiente
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  )
}
