/** Resultado simulado del script Python de detección de momentos clave. */
export const mockKeyMoments = [
  {
    id: 'km-1',
    startSec: 4.2,
    endSec: 18.5,
    label: 'Hook inicial',
    reason: 'Cambio brusco de plano + pico de audio',
    confidence: 0.94,
  },
  {
    id: 'km-2',
    startSec: 22.0,
    endSec: 41.3,
    label: 'Demostración producto',
    reason: 'Objeto principal centrado > 6s',
    confidence: 0.89,
  },
  {
    id: 'km-3',
    startSec: 48.7,
    endSec: 55.1,
    label: 'Testimonial',
    reason: 'Rostro detectado + voz dominante',
    confidence: 0.91,
  },
  {
    id: 'km-4',
    startSec: 62.4,
    endSec: 74.8,
    label: 'Oferta / CTA',
    reason: 'Texto en pantalla + música de cierre',
    confidence: 0.87,
  },
  {
    id: 'km-5',
    startSec: 78.0,
    endSec: 84.0,
    label: 'Cierre marca',
    reason: 'Logo visible + fade out',
    confidence: 0.82,
  },
]

export function formatTimecode(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  const ms = Math.floor((totalSeconds % 1) * 100)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`
}

export function formatTimeRange(startSec, endSec) {
  return `${formatTimecode(startSec)} → ${formatTimecode(endSec)}`
}
