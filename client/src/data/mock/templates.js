export const templateCategories = [
  { id: 'all', label: 'Todas' },
  { id: 'promo', label: 'Promoción' },
  { id: 'social', label: 'Redes sociales' },
  { id: 'corporate', label: 'Corporativo' },
  { id: 'editing', label: 'Edición IA' },
]

export const promptTemplates = [
  {
    id: 'tpl-001',
    name: 'Promo producto — 60s',
    category: 'promo',
    description: 'Estructura narrativa para lanzamiento con CTA final.',
    tags: ['producto', 'cta', 'vertical'],
    uses: 48,
    updatedAt: 'Hace 2 días',
    version: 'v3',
    prompt: `Genera un guion de video promocional de 60 segundos para {{producto}}.

Audiencia: {{audiencia}}
Tono: dinámico y confiable
Estructura:
1. Hook (0-5s): problema o deseo del cliente
2. Solución (5-35s): beneficios clave en 3 puntos
3. Prueba social (35-50s): testimonio breve o dato
4. CTA (50-60s): {{llamada_accion}}

Incluye indicaciones de plano sugeridas y duración por escena.`,
  },
  {
    id: 'tpl-002',
    name: 'Reel Instagram — tendencia',
    category: 'social',
    description: 'Formato corto vertical con ritmo rápido.',
    tags: ['reel', '9:16', 'hook'],
    uses: 92,
    updatedAt: 'Hace 5 h',
    version: 'v2',
    prompt: `Crea un guion para reel de 22-28 segundos sobre {{tema}}.

Formato: vertical 9:16
Estilo: cortes cada 2-3 segundos, texto en pantalla mínimo
Abrir con hook visual en los primeros 2 segundos.
Cerrar con pregunta o CTA: {{cta}}

Máximo 4 escenas. Indica transición sugerida entre cada una.`,
  },
  {
    id: 'tpl-003',
    name: 'Testimonial cliente',
    category: 'corporate',
    description: 'Entrevista emocional con estructura problema → resultado.',
    tags: ['testimonial', 'b2b'],
    uses: 31,
    updatedAt: 'Ayer',
    version: 'v1',
    prompt: `Redacta preguntas y respuestas guionizadas para testimonial de {{cliente}}.

Duración objetivo: 90 segundos
Enfoque: resultado medible tras usar {{servicio}}
Incluir:
- Intro del entrevistado (nombre, cargo, empresa)
- Situación anterior (15s)
- Cambio concreto (45s)
- Recomendación final (20s)
- B-roll sugerido por bloque`,
  },
  {
    id: 'tpl-004',
    name: 'Catálogo temporada',
    category: 'promo',
    description: 'Múltiples productos en secuencia uniforme.',
    tags: ['catálogo', 'ecommerce'],
    uses: 19,
    updatedAt: 'Hace 1 semana',
    version: 'v4',
    prompt: `Genera secuencia de video catálogo para {{temporada}}.

Productos: {{lista_productos}}
Por cada producto (8-10s):
- Plano detalle
- Beneficio principal en voz en off
- Precio u oferta si aplica

Mantener mismo ritmo musical y lower-third consistente.
Cierre con slide de marca {{marca}}.`,
  },
  {
    id: 'tpl-005',
    name: 'Montaje IA — transiciones',
    category: 'editing',
    description: 'Instrucciones para el asistente de edición automática.',
    tags: ['ia', 'timeline', 'transiciones'],
    uses: 67,
    updatedAt: 'Hace 3 días',
    version: 'v2',
    prompt: `Aplica las siguientes reglas de montaje al proyecto "{{proyecto}}":

- Transición entre escenas: {{tipo_transicion}} (duración {{duracion}}ms)
- Normalizar audio a -14 LUFS
- Insertar lower-third en {{timestamp}} con texto "{{texto}}"
- Recortar silencios mayores a 400ms
- Exportar en {{resolucion}} @ {{fps}} fps

Priorizar continuidad visual entre planos del mismo producto.`,
  },
  {
    id: 'tpl-006',
    name: 'Explicador servicio B2B',
    category: 'corporate',
    description: 'Video explicativo con diagrama conceptual.',
    tags: ['saas', 'explicador'],
    uses: 24,
    updatedAt: 'Hace 4 días',
    version: 'v1',
    prompt: `Escribe guion explicativo de 2 minutos para {{servicio}}.

Público: decisores técnicos y de negocio
Estructura:
1. Contexto del mercado
2. Problema operativo
3. Cómo funciona la solución (3 pasos)
4. Caso de uso {{caso}}
5. Cierre con demo o trial

Sugerir momentos para animación de UI o diagrama.`,
  },
]
