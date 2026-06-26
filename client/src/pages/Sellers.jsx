import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  LoaderCircle,
  Search,
  Upload,
  UserRound,
  UsersRound,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import Button from '../components/ui/Button'
import MetricTile from '../components/ui/MetricTile'
import ChannelBadge from '../components/sales/ChannelBadge'
import { fetchSellerById, fetchSellers, uploadSellerVideo } from '../api/sellers'
import { getCompanyAccentClass } from '../utils/companyColors'

const PAGE_SIZE = 8
const emptySummary = { total: 0, byCompany: {}, companies: [] }
const emptyPagination = { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 }
const previewSlots = ['Intro comercial', 'Producto destacado', 'Cierre con CTA']

export default function Sellers() {
  const [companyFilter, setCompanyFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sellers, setSellers] = useState([])
  const [summary, setSummary] = useState(emptySummary)
  const [pagination, setPagination] = useState(emptyPagination)
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [error, setError] = useState('')
  const [detailError, setDetailError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const companyFilters = useMemo(
    () => [
      { id: 'all', label: 'Todos' },
      ...summary.companies.map((company) => ({ id: company, label: company })),
    ],
    [summary.companies],
  )

  const loadSellers = useCallback(async () => {
    try {
      setError('')
      const data = await fetchSellers({
        page,
        limit: PAGE_SIZE,
        search,
        company: companyFilter,
      })
      setSellers(data.items)
      setSummary(data.summary)
      setPagination(data.pagination)
    } catch {
      setError('No se pudo cargar la lista de vendedores.')
      setSellers([])
      setSummary(emptySummary)
      setPagination(emptyPagination)
    }
  }, [page, search, companyFilter])

  useEffect(() => {
    startTransition(() => {
      void loadSellers()
    })
  }, [loadSellers])

  useEffect(() => {
    setPage(1)
  }, [search, companyFilter])

  useEffect(() => {
    if (companyFilter !== 'all' && !summary.companies.includes(companyFilter)) {
      setCompanyFilter('all')
    }
  }, [companyFilter, summary.companies])

  async function handleOpenSeller(id) {
    try {
      setDetailError('')
      setIsDetailLoading(true)
      const seller = await fetchSellerById(id)
      setSelectedSeller(seller)
    } catch {
      setDetailError('No se pudo cargar la informacion del vendedor.')
    } finally {
      setIsDetailLoading(false)
    }
  }

  function handleBackToList() {
    setSelectedSeller(null)
    setDetailError('')
  }

  const canGoPrev = pagination.page > 1
  const canGoNext = pagination.page < pagination.totalPages

  if (selectedSeller) {
    return (
      <SellerDetail
        seller={selectedSeller}
        isLoading={isDetailLoading}
        error={detailError}
        onBack={handleBackToList}
      />
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title="Vendedores"
        description="Directorio operativo de vendedores por empresa, codigo interno y piezas de video asociadas."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Total vendedores"
          value={String(summary.total)}
          icon={UsersRound}
          accent="text-record"
        />
        {summary.companies.slice(0, 3).map((company) => (
          <MetricTile
            key={company}
            label={`Equipo ${company}`}
            value={String(summary.byCompany[company] ?? 0)}
            icon={Building2}
            accent={getCompanyAccentClass(company)}
          />
        ))}
      </div>

      <Panel padding={false}>
        <div className="flex flex-col gap-3 border-b border-border-subtle px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Catalogo de vendedores</h3>
            <p className="studio-timecode mt-0.5">
              {pagination.total} resultados - pagina {pagination.page} de {Math.max(pagination.totalPages, 1)}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre o codigo..."
                className="h-8 w-full min-w-[210px] rounded-md border border-border-soft bg-input pl-8 pr-3 text-sm studio-focus-ring sm:w-56"
              />
            </div>
            <div className="flex max-w-full flex-wrap gap-1 rounded-md border border-border-soft p-0.5">
              {companyFilters.map((company) => (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => setCompanyFilter(company.id)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors studio-focus-ring ${
                    companyFilter === company.id
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {company.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error ? <p className="px-5 py-6 text-sm text-destructive">{error}</p> : null}
        {detailError ? <p className="px-5 pt-4 text-sm text-destructive">{detailError}</p> : null}

        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4 sm:p-5">
          {isPending ? (
            <LoadingCards />
          ) : sellers.length === 0 ? (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No hay vendedores que coincidan con la busqueda.
            </p>
          ) : (
            sellers.map((seller) => (
              <button
                key={seller.id}
                type="button"
                onClick={() => handleOpenSeller(seller.id)}
                className="group min-h-[172px] rounded-lg border border-border-subtle bg-card p-4 text-left shadow-sm transition-[background,border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-border hover:bg-accent/40 studio-focus-ring [content-visibility:auto] [contain-intrinsic-size:0_172px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                    <UserRound className="size-5" />
                  </div>
                  <ChannelBadge channel={seller.company || 'Sin empresa'} />
                </div>

                <div className="mt-4 min-w-0">
                  <h4 className="truncate text-sm font-semibold tracking-tight">{seller.name || 'Sin nombre'}</h4>
                  <p className="studio-timecode mt-1">Admin #{seller.idAdmin ?? 'N/A'}</p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-subtle pt-3">
                  <div>
                    <p className="studio-label">Codigo</p>
                    <p className="mt-1 font-mono text-sm font-semibold tabular-nums tracking-widest">
                      {seller.code || 'N/A'}
                    </p>
                  </div>
                  <span className="inline-flex size-8 items-center justify-center rounded-md border border-border-soft text-muted-foreground transition-colors group-hover:text-foreground">
                    <ChevronRight className="size-4" />
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle px-4 py-3 sm:px-5">
          <p className="studio-timecode text-xs">
            Mostrando {sellers.length} de {pagination.total} - {PAGE_SIZE} por pagina
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

function LoadingCards() {
  return Array.from({ length: 4 }, (_, index) => (
    <div
      key={index}
      className="min-h-[172px] animate-pulse rounded-lg border border-border-subtle bg-card p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="size-10 rounded-md bg-muted" />
        <div className="h-6 w-20 rounded bg-muted" />
      </div>
      <div className="mt-5 h-4 w-32 rounded bg-muted" />
      <div className="mt-2 h-3 w-20 rounded bg-muted" />
      <div className="mt-6 h-px bg-border-subtle" />
      <div className="mt-4 h-4 w-16 rounded bg-muted" />
    </div>
  ))
}

function SellerDetail({ seller, isLoading, error, onBack }) {
  const fileInputRef = useRef(null)
  const [videos, setVideos] = useState(() => seller.videos ?? [])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')

  useEffect(() => {
    setVideos(seller.videos ?? [])
  }, [seller])

  async function handleUploadVideo(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError('')
    setUploadSuccess('')
    setIsUploading(true)

    try {
      const createdVideo = await uploadSellerVideo({
        sellerId: seller.id,
        file,
        name: file.name.replace(/\.[^.]+$/, ''),
      })

      setVideos((currentVideos) => [createdVideo, ...currentVideos])
      setUploadSuccess(`Video subido correctamente: ${createdVideo.name || file.name}`)
    } catch (uploadError) {
      setUploadError(uploadError.message || 'No se pudo subir el video del vendedor.')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title={seller.name || 'Vendedor'}
        description="Vista individual del vendedor y espacio reservado para sus videos generados."
        actions={
          <Button variant="secondary" size="sm" onClick={onBack}>
            <ArrowLeft className="size-3.5" />
            Volver
          </Button>
        }
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.6fr]">
        <Panel className="overflow-hidden" padding={false}>
          <div className="border-b border-border-subtle px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex size-12 items-center justify-center rounded-md bg-muted">
                <BadgeCheck className="size-6 text-record" />
              </div>
              <ChannelBadge channel={seller.company || 'Sin empresa'} />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{seller.name || 'Sin nombre'}</h3>
            <p className="studio-timecode mt-1">ID vendedor #{seller.id}</p>
          </div>

          <dl className="grid gap-0 divide-y divide-border-subtle">
            <InfoRow label="Empresa" value={seller.company || 'Sin empresa'} />
            <InfoRow label="Codigo" value={seller.code || 'N/A'} mono />
            <InfoRow label="Admin" value={seller.idAdmin ? `#${seller.idAdmin}` : 'N/A'} />
            <InfoRow label="Videos listos" value={String(videos.length)} />
          </dl>
        </Panel>

        <Panel padding={false}>
          <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Videos del vendedor</h3>
              <p className="studio-timecode mt-0.5">
                {videos.length} archivos vinculados
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleUploadVideo}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? <LoaderCircle className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                {isUploading ? 'Subiendo...' : 'Subir video'}
              </Button>
              <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Clapperboard className="size-4" />
              </div>
            </div>
          </div>

          {uploadError ? <p className="px-5 pt-4 text-sm text-destructive">{uploadError}</p> : null}
          {uploadSuccess ? <p className="px-5 pt-4 text-sm text-emerald-600">{uploadSuccess}</p> : null}

          {isLoading ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">Cargando vendedor...</p>
          ) : videos.length > 0 ? (
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {videos.map((video) => {
                const videoUrl = typeof video === 'string' ? video : video.url
                const videoName = typeof video === 'string' ? 'Video CapCut' : video.name

                return (
                  <div
                    key={typeof video === 'string' ? video : video.id}
                    className="overflow-hidden rounded-md border border-border-subtle bg-input"
                  >
                    <video
                      src={videoUrl}
                      controls
                      className="aspect-video w-full bg-viewport"
                    />
                    <div className="border-t border-border-subtle px-3 py-2">
                      <p className="truncate text-xs font-semibold">{videoName}</p>
                      <p className="studio-timecode mt-1">CapCut tipo 2</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              {previewSlots.map((slot, index) => (
                <div
                  key={slot}
                  className="aspect-video rounded-md border border-border-subtle bg-input p-3"
                >
                  <div className="flex h-full flex-col justify-between">
                    <span className="inline-flex size-8 items-center justify-center rounded-md bg-card text-muted-foreground">
                      <Clapperboard className="size-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold">{slot}</p>
                      <p className="studio-timecode mt-1">Placeholder {index + 1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 px-5 py-3">
      <dt className="studio-label">{label}</dt>
      <dd className={mono ? 'font-mono text-sm font-semibold tabular-nums' : 'text-sm font-medium'}>
        {value}
      </dd>
    </div>
  )
}
