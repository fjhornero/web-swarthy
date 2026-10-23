# Prompt: revisión de diseño web para un DJ profesional

Prompt reutilizable para lanzar, desde Claude Code, una revisión de **diseño y
producto** de esta web con la mirada de un diseñador web especializado en artistas de
música electrónica. Complementa a `docs/AUDIT_PROMPT.md` (seguridad, a11y, SEO,
rendimiento, infra): aquí la pregunta no es "¿está bien hecha?" sino "¿consigue bolos
y fans como la web de un DJ profesional?". Copiar el bloque de abajo tal cual en una
sesión nueva.

---

```text
Actúa como director de arte y diseñador web senior especializado en artistas de música
electrónica (has diseñado webs y EPKs para DJs de trance y club, sellos y agencias de
booking). Vas a revisar djswarthy.es (repo ~/repos/web-swarthy) y proponer qué mejorar
para que funcione como la web de un DJ profesional. Lee primero CLAUDE.md y lib/data.ts.

CONTEXTO DEL ARTISTA
- DJ Swarthy: DJ de Madrid con 19 años en cabina. Corazón trance/progressive (uplifting,
  energía de mainfloor), pero versátil: remember, tech house, house, nu disco. Ha pinchado
  en salas reales (ver site.venues). Crea contenido en YouTube, Twitch, TikTok e Instagram
  y tiene perfil de artista en Spotify.
- La web tiene dos públicos con objetivos distintos:
  1. Promotor / sala / agencia / evento privado → en menos de 30 s debe saber qué estilo
     pincha, si tiene nivel, en qué salas ha estado, qué formatos ofrece y cómo pedir
     fecha (y descargar el press kit sin tener que pedirlo por email).
  2. Fan → escuchar un set ya, ver próximas fechas, seguirle en redes.

RESTRICCIONES (no se discuten; se diseña dentro de ellas)
- Identidad visual FIJADA: negro, gradiente rojo #e11d48 → naranja #f97316, Bebas Neue +
  Inter, glows radiales. Viene de la referencia https://fictional-octo-guacamole-rose.vercel.app/.
  Prohibido proponer "club neón" o "editorial cinematográfico": se probaron y se
  rechazaron. Se puede refinar (ritmo, jerarquía, fotografía, densidad, microinteracción),
  no cambiar de dirección.
- Trade-offs aceptados: contraste del texto blanco sobre el extremo naranja de los botones
  y animaciones infinitas del hero (respetan prefers-reduced-motion).
- Nunca inventar contenido: ni fechas, ni testimonios, ni cifras, ni logos de salas en
  las que no ha pinchado, ni citas de prensa. Si una mejora necesita material que no
  existe, va a la lista "Material que tiene que aportar Swarthy".
- Reproductores siempre como fachada (components/MediaFacade.tsx): nada de iframes ni
  autoplay en la carga inicial. Cualquier embed nuevo exige ampliar la CSP.
- Las secciones son server components con Reveal; usar `m` de framer-motion, nunca `motion`.

FASE 1 — Ver la web como la ve un promotor (tú)
- Arranca `npm run build && npm run start` (o usa https://djswarthy.es si está en línea)
  y haz capturas a 1440, 768 y 390 px de la home completa, /press-kit, una 404 y la
  imagen OG (/opengraph-image).
- Haz el "test de los 5 segundos" y el "test de los 30 segundos del promotor": anota qué
  se entiende sin hacer scroll, cuántos clics hay hasta el formulario de booking y hasta
  el primer audio sonando, y qué preguntas de booking quedan sin respuesta.
- Recorre los formularios de booking y contacto en móvil (teclado, tipos de input,
  número de campos, mensajes de error y de éxito).

FASE 2 — Benchmark (un agente, sólo lectura)
Lanza un agente con WebSearch/WebFetch que analice 6-8 webs de DJs profesionales de
referencia, mezclando cabezas de cartel del trance (p. ej. Armin van Buuren, Ferry
Corsten, Aly & Fila, Giuseppe Ottaviani, Paul van Dyk) y DJs de club de nivel nacional
con web propia, más perfiles de Resident Advisor y EPKs de agencias de booking. Que
devuelva una tabla de patrones recurrentes (qué ponen arriba del todo, cómo presentan
la música, fechas, EPK/rider, contacto de booking, prueba social, fotografía, vídeo) y
qué hacen mejor que djswarthy.es, citando URL. Nada de copiar estilos: sólo patrones
de contenido y de flujo.

FASE 3 — Revisores en paralelo (sólo lectura; que NO editen nada)
Lanza en un mismo mensaje estos agentes, cada uno con su brief, las restricciones de
arriba, las capturas/rutas y este formato de salida: hallazgos P0→P3 con sección o
fichero:línea, problema en una frase, por qué le cuesta un bolo o un fan, propuesta
concreta (copy, layout o snippet) y esfuerzo (S/M/L).
  1. Dirección de arte y sistema visual (skill frontend-design / ecc:frontend-design-direction):
     jerarquía y escala tipográfica, ritmo vertical entre secciones (¿todas iguales?),
     uso del gradiente (¿se diluye por exceso?), tratamiento fotográfico del retrato y de
     las salas, consistencia de tarjetas, iconografía, estados hover/focus/active,
     densidad en móvil, vídeo (¿loop corto de directo en el hero con poster? coste en
     LCP), detalles que delatan plantilla.
  2. Conversión de booking (ecc:marketing-agent): propuesta de valor del hero
     ("MUSIC IS THE ANSWER" + subtítulo), orden de secciones según el embudo del
     promotor, CTAs (cantidad, texto, repetición, StickyCta), formatos de set presentados
     como "producto", fricción del formulario (campos, tipo de evento, aforo, presupuesto),
     tiempo de respuesta prometido, descarga del EPK, señales de profesionalidad que faltan.
  3. Experiencia musical (ecc:frontend-patterns): ¿el audio es protagonista? Set
     destacado frente a grid, reproductor persistente entre secciones, tracklists,
     duración/género/fecha de cada mix, coherencia YouTube/SoundCloud/Spotify, estado
     cuando un feed falla, carga percibida de las miniaturas.
  4. Marca personal y copy (ecc:brand-voice): bio corta frente a larga, tono (¿español
     consistente o mezcla con inglés intencionada?), claims verificables, tagline
     "TODO TERRENO" frente al posicionamiento trance (¿suma o resta para el booking?),
     microcopy de botones, FAQ orientada a las objeciones reales de un promotor.
  5. Press kit y móvil (ecc:a11y-architect con foco en UX): /press-kit como EPK de
     agencia (one-sheet, fotos en alta descargables con crédito, rider técnico, logos en
     SVG/PNG transparente, versión imprimible), experiencia táctil (targets de 44 px,
     menú, carruseles), legibilidad nocturna (el promotor la abre en el móvil a las 3 a. m.).

FASE 4 — Consolidación (tú)
- Cruza benchmark, revisores y tu propio recorrido. Descarta lo que choque con las
  restricciones y anótalo como "descartado y por qué".
- Entrega un informe en español con:
  1. Diagnóstico en 5 líneas: qué transmite hoy la web y qué debería transmitir.
  2. Top 10 de mejoras por impacto/esfuerzo (quick wins primero), cada una con la
     sección afectada, el antes/después en copy o un mockup ASCII, y los ficheros a tocar.
  3. Propuesta de orden de secciones, si cambia, justificada con el embudo del promotor.
  4. "Material que tiene que aportar Swarthy": fotos (en cabina, con público, retrato
     horizontal para el hero), vídeo corto de directo, citas reales de promotores, fechas,
     logos de salas con permiso, rider en PDF, número de WhatsApp… con el formato exacto
     que necesita cada pieza (proporción, resolución, peso).
  5. Ideas grandes para más adelante (esfuerzo L), separadas de lo inmediato.
- Publica el informe como artifact privado y dame el enlace.
- NO apliques cambios todavía: espera a que elija qué mejoras implementar. Cuando lo
  haga: rama `task/<nombre>` (nunca push a main), cambios por sección,
  `npm run lint && npm run typecheck && npm test && npm run build`, capturas
  antes/después a 390 y 1440 px, `graphify update .`, CLAUDE.md al día y PR en español.
- Guarda en el context lake (entidad "Web de artista DJ Swarthy") las decisiones de
  diseño que tome.

Reglas: responde en español; no inventes contenido; no cambies la dirección visual;
cada propuesta debe decir qué gana el promotor o el fan, no sólo "queda mejor".
```
