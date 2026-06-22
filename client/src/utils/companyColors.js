const COMPANY_THEME = {
  cepal: {
    colorVar: 'var(--company-cepal)',
    accent: 'text-company-cepal',
    badge: 'bg-company-cepal/12 text-company-cepal ring-1 ring-company-cepal/25',
  },
  ibc: {
    colorVar: 'var(--company-ibc)',
    accent: 'text-company-ibc',
    badge: 'bg-company-ibc/12 text-company-ibc ring-1 ring-company-ibc/25',
  },
  sistemas: {
    colorVar: 'var(--company-sistemas)',
    accent: 'text-company-sistemas',
    badge: 'bg-company-sistemas/12 text-company-sistemas ring-1 ring-company-sistemas/25',
  },
}

const DEFAULT_THEME = {
  colorVar: 'var(--muted-foreground)',
  accent: 'text-muted-foreground',
  badge: 'bg-muted/60 text-foreground ring-1 ring-border-subtle',
}

export function resolveCompanyKey(company) {
  if (!company) return null

  const normalized = company.trim().toUpperCase()
  if (normalized.startsWith('CEPAL')) return 'cepal'
  if (normalized.startsWith('IBC')) return 'ibc'
  if (normalized.startsWith('SISTEMA')) return 'sistemas'

  return null
}

export function getCompanyTheme(company) {
  const key = resolveCompanyKey(company)
  return key ? COMPANY_THEME[key] : DEFAULT_THEME
}

export function getCompanyColor(company) {
  return getCompanyTheme(company).colorVar
}

export function getCompanyAccentClass(company) {
  return getCompanyTheme(company).accent
}

export function getCompanyBadgeClass(company) {
  return getCompanyTheme(company).badge
}
