import { Play, ArrowUpRight, Circle } from 'lucide-react'
import MetricTile from '../components/ui/MetricTile'
import Panel, { PanelHeader } from '../components/ui/Panel'
import Button from '../components/ui/Button'
import TimelineProgress from '../components/ui/TimelineProgress'
import StatusPill from '../components/ui/StatusPill'
import {
  dashboardStats,
  recentProjects,
  recentActivity,
  monthlyPerformance,
  MONTH_LABELS,
} from '../data/mock/dashboard'

export default function Dashboard() {
  const pipelineActive = recentProjects.filter((p) => p.progress < 100).length

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="studio-panel overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="studio-label mb-2">Pipeline de producción</p>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {pipelineActive} proyectos en curso
            </h2>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground">
              Estado del estudio: renders, ediciones y entregas del equipo comercial.
            </p>
          </div>
          <Button size="lg">
            <Play className="size-4" />
            Nuevo proyecto
          </Button>
        </div>
        <div className="grid divide-y divide-border-subtle sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {recentProjects.slice(0, 3).map((project) => (
            <div key={project.name} className="px-5 py-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">{project.name}</p>
                <StatusPill status={project.status} />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{project.vendor}</p>
              <div className="mt-2.5">
                <TimelineProgress value={project.progress} label={project.status} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <MetricTile key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel className="lg:col-span-3" padding={false}>
          <PanelHeader
            title="Cola de proyectos"
            meta="Últimas actualizaciones"
            action={
              <button
                type="button"
                className="flex items-center gap-1 text-xs font-medium text-record hover:underline studio-focus-ring"
              >
                Ver cola completa
                <ArrowUpRight className="size-3.5" />
              </button>
            }
          />
          <ul className="divide-y divide-border-subtle">
            {recentProjects.map((project) => (
              <li
                key={project.name}
                className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-record" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-medium leading-tight">{project.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{project.vendor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:w-56">
                  <StatusPill status={project.status} />
                  <div className="min-w-0 flex-1">
                    <TimelineProgress value={project.progress} label="" showLabel={false} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="lg:col-span-2" padding={false}>
          <PanelHeader title="Log del estudio" meta="Eventos recientes" />
          <ul className="divide-y divide-border-subtle">
            {recentActivity.map((item) => (
              <li key={item.detail} className="px-5 py-3.5">
                <div className="flex gap-2">
                  <Circle className="mt-1 size-2 shrink-0 fill-record text-record" />
                  <div>
                    <p className="text-sm font-medium leading-snug">{item.action}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                    <p className="studio-timecode mt-1.5">{item.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel padding={false}>
        <PanelHeader title="Throughput mensual" meta="Videos finalizados · 12 meses" />
        <div className="flex h-40 items-end gap-1 px-5 pb-5 pt-2 sm:gap-1.5">
          {monthlyPerformance.map((height, i) => (
            <div key={MONTH_LABELS[i]} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-sm bg-record/25 transition-colors duration-150 group-hover:bg-record/45"
                  style={{ height: `${height}%` }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 mx-auto h-px w-full max-w-[80%] bg-record/60 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>
              <span className="studio-timecode text-[10px]">{MONTH_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
