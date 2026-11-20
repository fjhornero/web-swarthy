# Prompt: análisis de posicionamiento en buscadores

Prompt reutilizable para lanzar, desde Claude Code, un análisis de **posicionamiento y
visibilidad** de djswarthy.es: Google y Bing, el mapa, YouTube y los asistentes de IA.
Complementa a `docs/AUDIT_PROMPT.md`, que comprueba que la superficie SEO esté bien
construida, y a `docs/DESIGN_PROMPT.md`, que mira la conversión: aquí la pregunta es
"¿quién encuentra esta web, buscando qué, y qué falta para aparecer donde hoy no
aparece?". Produce un informe; los cambios sólo se aplican después de elegirlos. Copiar
el bloque de abajo tal cual en una sesión nueva (o quitar agentes de la Fase 2 si sólo
interesa una parte).

---

```text
Actúa como consultor SEO senior especializado en músicos, DJs y servicios locales en
España (SEO técnico, de contenidos, local y de entidad). Vas a analizar
https://djswarthy.es (repo ~/repos/web-swarthy) y proponer qué hacer para que la
encuentre más gente: en Google y Bing, en el mapa, en YouTube y en los asistentes de IA.
Lee primero CLAUDE.md y lib/data.ts, y ejecuta `graphify query "<pregunta>"` antes de
leer código (díselo también a cada agente que lances).

CONTEXTO
- DJ Swarthy: DJ y productor de Madrid con 19 años en cabina. Base trance/progressive;
  también tech house, house, nu disco y remember. Las salas donde ha pinchado están en
  site.venues y sus canales, en site.socials.
- Hay cuatro tipos de búsqueda y cada uno se gana de una manera:
  1. Marca ("dj swarthy", "swarthy dj", "djswarthy"): la web tiene que ser el primer
     resultado y sus perfiles, el resto de la página. "Swarthy" a secas es un adjetivo
     inglés: por esa palabra no se compite.
  2. Contratación ("contratar dj madrid", "dj para eventos madrid", "dj trance madrid",
     "dj remember madrid", "dj para bodas madrid"…): quien no le conoce y busca un DJ.
     Ahí está el negocio y ahí es donde más cuesta aparecer.
  3. Música ("sesión trance", "set remember", títulos de sus sets): se gana en YouTube y
     SoundCloud; la web recoge ese tráfico, no lo sustituye.
  4. Asistentes de IA (ChatGPT, Perplexity, Gemini, AI Overviews de Google): que le
     conozcan como entidad y le citen cuando alguien pide un DJ de su perfil.

PUNTO DE PARTIDA (medido el 2026-11-20; confírmalo, puede haber cambiado)
- La superficie técnica ya se auditó (PR #24): title y description, canónicas, imagen
  OG, JSON-LD, sitemap, robots, noindex de /privacidad, www → apex. Compruébala contra
  producción en diez minutos y no la relitigues: el esfuerzo va a lo que nunca se ha
  mirado (demanda, competencia, arquitectura de contenidos, entidad, autoridad, medición).
- Sólo hay dos URL indexables: la home, un scroll largo que intenta responder a todas
  las búsquedas, y /press-kit. Todo en es-ES y sin hreflang; el inglés son dos bios del
  press kit.
- El JSON-LD sale de app/layout.tsx y se emite idéntico en todas las rutas: FAQPage y
  Service también en /press-kit, donde esa FAQ no se ve.
- Lo que anima Reveal llega en el HTML del servidor con `opacity:0` hasta que hidrata el
  JavaScript (43 nodos en la home).
- Las sesiones salen de los feeds dentro de la home: ninguna tiene URL propia.
- site.dates y site.testimonials están vacíos, falta Instagram en site.socials y el
  alias cambia de una red a otra (swarthy_dj, dj_swarthy, DjSwarthy, swarthydj).
- La única analítica es Plausible, sin cookies. En el HTML no hay etiqueta de
  verificación de Search Console (podría estar verificado por DNS).

RESTRICCIONES (no se discuten)
- Nada inventado en la web: ni fechas, ni testimonios, ni reseñas, ni cifras, ni citas
  de prensa. Los datos estructurados sólo describen lo que la página enseña de verdad.
- Nada inventado en el análisis: cada volumen, posición o enlace lleva su fuente y su
  fecha. Sin una herramienta de palabras clave no hay volúmenes: el autocompletado, las
  búsquedas relacionadas y Trends son indicios, y se dice. No prometas posiciones ni
  plazos.
- Sólo SEO limpio: ni compra de enlaces, ni redes de blogs, ni texto oculto, ni relleno
  de palabras clave, ni páginas puerta (una por municipio con el mismo texto), ni
  contenido generado en masa. Cada página nueva responde a una intención distinta con
  contenido real; si no existe, va a "Material que tiene que aportar Swarthy".
- Las directrices cambian: antes de recomendar un dato estructurado o un resultado
  enriquecido, comprueba en la documentación vigente de Google que sigue existiendo
  (los de FAQ se restringieron en 2023 y desde entonces ha retirado más).
- Lo de fuera del repo (verificar Search Console, crear o reclamar perfiles, ficha de
  Google Business, pedir enlaces o reseñas, editar descripciones de YouTube) no lo
  ejecutas tú: va a "Tareas fuera del repo", paso a paso, para que las haga yo.
- Del proyecto: dirección visual fijada; reproductores siempre como fachada; home
  estática con `revalidate = 3600` (nunca `cache: "no-store"`); el contenido vive en
  lib/data.ts y no se importa desde componentes cliente; no empeorar los Core Web Vitals
  ni el First Load JS; ningún script de terceros ni analítica con cookies sin revisar
  la CSP y /privacidad.

FASE 0 — Lo que sólo sé yo
No me preguntes al empezar. Búscalo en el context lake (entidad "Web de artista DJ
Swarthy") y en el repo; lo que falte, asúmelo como hipótesis, márcalo como tal y deja
la pregunta abierta en el informe para que yo la corrija.
- Search Console y Bing Webmaster: ¿verificados? Si lo están, export de consultas,
  páginas, países y dispositivos (de 3 a 16 meses) y el informe de indexación. Si no,
  verificarlos es la primera tarea del plan y el análisis sigue con datos públicos.
- Plausible, últimos 3 meses: fuentes, páginas de entrada y conversiones de los
  objetivos "Booking enviado", "Contacto enviado" y "Reproducir".
- Prioridad de negocio: ¿qué bolos quiero más, clubs y festivales o bodas, fiestas
  privadas y eventos de empresa? ¿Madrid, toda España o también fuera? De esto depende
  a qué búsquedas se apunta: el copy menciona las bodas, pero el posicionamiento es de
  DJ de club.
- Perfiles que existen y no están en la web: Instagram, Google Business, Resident
  Advisor, Beatport, Mixcloud, Bandsintown, bodas.net…

FASE 1 — Línea base medible (tú, siempre contra producción: es lo que ve Google)
- Indexación: `site:djswarthy.es`, el título y el snippet que enseña Google (¿reescribe
  el title?), otras propiedades con su nombre (la landing de Academy en vercel.app,
  despliegues antiguos) y si el servidor responde con la web por su IP.
- Rastreo: códigos y cadena de redirecciones de las cuatro variantes http/https ×
  www/apex, parámetros (`?utm_source=`) frente a la canónica, 404 reales, robots.txt,
  sitemap.xml, caché, compresión y TTFB.
- Lo que ve el robot: el HTML servido sin JavaScript (curl) frente al DOM renderizado
  con el user-agent de Googlebot móvil. ¿Están en el HTML todo el copy, los encabezados
  y los enlaces? ¿Queda algo invisible si la animación no se dispara?
- Datos estructurados: extrae el JSON-LD de cada ruta en producción y valídalo contra
  schema.org y contra la documentación vigente de Google.
- Core Web Vitals: Lighthouse en móvil y escritorio y una traza de rendimiento (LCP,
  CLS, INP) de la home y de /press-kit; datos de campo de CrUX si los hay. Di siempre si
  un dato es de laboratorio o de campo.
- SERP de marca: qué ocupa la primera página de "dj swarthy", "swarthy dj", "djswarthy"
  y "dj swarthy madrid" (web, imágenes y vídeos), si hay panel de conocimiento y si
  aparecen homónimos o perfiles ajenos.
- SERP de negocio: 20-30 búsquedas objetivo (contratación, estilo + ciudad, tipo de
  evento). De cada una: si aparece djswarthy.es, quién ocupa el top 10 (directorios,
  agencias, webs de DJs) y qué módulos salen (mapa, vídeos, preguntas, AI Overview).
  Buscar desde una herramienta no es el Google de alguien en Madrid: dilo, y donde haya
  datos de Search Console, mandan ellos.
Guárdalo en una tabla con fecha: es contra lo que se comparará dentro de tres meses.

FASE 2 — Agentes en paralelo (sólo lectura; que NO editen nada)
Lanza en un mismo mensaje estos agentes, cada uno con su brief, el contexto, las
restricciones, la línea base de la Fase 1 y este formato de salida: hallazgos P0→P3 con
URL o fichero:línea, evidencia literal (cabecera, fragmento de HTML, resultado de
búsqueda con URL y fecha, dato de Search Console), a qué tipo de búsqueda afecta,
propuesta concreta (copy, snippet o pasos) y esfuerzo S/M/L. Lo que no puedan
evidenciar, fuera o marcado como hipótesis.
  1. Demanda y arquitectura de contenidos (ecc:seo-specialist): palabras clave en
     español para Madrid y España (y en inglés si se apunta fuera), agrupadas por
     intención: marca, contratar DJ + ciudad, DJ + tipo de evento, estilo + ciudad y
     dudas ("cuánto cuesta un DJ", "qué equipo necesita un DJ"). Resultado: un mapa
     búsqueda → URL que diga qué sostiene la home y qué necesita página propia (p. ej.
     /contratar-dj-madrid, una por tipo de evento, /sets/[slug] con tracklist, versión
     en inglés). De cada página propuesta: búsqueda objetivo, borrador de title, H1 y
     description, guion, material real que exige, enlaces internos y riesgo de
     canibalizar la home. Que compare "una home larga" con "home + landings" y
     recomiende; que revise el title, la description, los encabezados y el copy
     actuales frente a esas búsquedas; y que deje la lista de semillas por si quiero
     sacar volúmenes reales del Planificador de palabras clave de Google Ads.
  2. Competencia en el SERP (general-purpose con WebSearch/WebFetch): para 8-10
     búsquedas clave, las 3-5 webs propias de DJs mejor colocadas en Madrid y España
     (no directorios), más dos o tres de DJs de trance internacionales. Tabla con su
     arquitectura de páginas, títulos, tipo y extensión del contenido, datos
     estructurados, señales locales, reseñas y quién les enlaza. Qué hacen que
     djswarthy.es no hace, y qué de eso es spam que hoy funciona y no se copia.
  3. Técnico, renderizado y datos estructurados (ecc:seo-specialist), con la línea base
     y el código: indexabilidad y canónicas por ruta; contenido que depende de
     JavaScript para verse; JSON-LD por página (cada ruta declara sólo lo que enseña);
     MusicGroup frente a Person para un solista; qué tipos dan hoy resultado
     enriquecido (Event cuando haya fechas, VideoObject sólo si el set es el contenido
     principal de su página, BreadcrumbList, logo, MusicRecording/MusicAlbum para los
     lanzamientos, licencia y autor en las fotos de prensa); hreflang si hay versión en
     inglés; enlazado interno; SEO de imágenes; y qué frena los Core Web Vitals.
  4. Entidad y marca (general-purpose con WebSearch/WebFetch): que los buscadores
     resuelvan "DJ Swarthy" como una sola entidad. Mismo nombre, alias, bio, foto y
     enlace a la web en todos los perfiles; `sameAs` completo, sólo con perfiles suyos
     y vivos; ruta realista hacia el panel de conocimiento (MusicBrainz, Discogs,
     Wikidata, canal oficial de artista en YouTube, Spotify for Artists) respetando las
     normas de cada sitio, sin artículos autopromocionales; inventario de propiedades
     propias y si alguna le disputa su nombre a la web. Y sus canales como buscadores:
     títulos, descripciones, tracklists con marcas de tiempo, listas y enlaces de
     YouTube y SoundCloud hacia la web, con UTM para que Plausible los atribuya.
  5. SEO local y autoridad (ecc:marketing-agent): ficha de Google Business como negocio
     sin local que atiende una zona (categoría, área, fotos, enlace de contratación;
     reseñas sólo de clientes reales), Bing Places y Apple Business Connect; los
     directorios que de verdad ocupan esos SERP (bodas y eventos; agenda de club:
     Resident Advisor, Bandsintown, Songkick, ticketeras de Madrid); quién enlaza hoy a
     djswarthy.es y a sus competidores; y una lista de enlaces legítimos alcanzables:
     salas donde ha pinchado, promotoras, festivales, radios y podcasts de trance con
     guest mix, medios de electrónica en España, sellos de sus lanzamientos. De cada
     uno: a quién escribir, qué pedir y qué aporta. Que compruebe que cada sitio sigue
     activo.
  6. Buscadores de IA (general-purpose con WebSearch/WebFetch): qué dicen hoy de DJ
     Swarthy los asistentes y de qué fuentes lo sacan; qué reciben sus rastreadores,
     que no ejecutan JavaScript, y qué política de robots conviene para los de búsqueda
     y para los de entrenamiento (lo decido yo); cómo hacer citable el contenido (datos
     rápidos, frases completas con quién, dónde, desde cuándo, estilos, salas y cómo
     contratarle, FAQ con preguntas reales); y si llms.txt u otras recetas de moda
     tienen hoy un efecto demostrado: con pruebas o fuera.

FASE 3 — Consolidación (tú)
- Cruza la línea base, los agentes y tu propia lectura. Quita duplicados y lo que
  choque con las restricciones o no tenga evidencia, y anótalo como "descartado y por
  qué".
- Entrega un informe en español con:
  1. Diagnóstico en 5 líneas: para qué búsquedas aparece hoy la web, para cuáles
     debería aparecer y cuál es el freno principal.
  2. Línea base con fecha: indexación, Core Web Vitals, SERP de marca, posición por
     búsqueda objetivo y enlaces entrantes.
  3. Mapa búsqueda → URL con las páginas actuales y las propuestas, y sus borradores de
     title, H1 y description.
  4. Top 10-15 de mejoras por impacto/esfuerzo (quick wins primero), cada una con su
     evidencia, el tipo de búsqueda al que ayuda, los ficheros a tocar o la tarea de
     fuera del repo, cómo se verifica y cuándo es razonable notar el efecto (días,
     semanas o meses).
  5. "Tareas fuera del repo", en orden y paso a paso.
  6. "Material que tiene que aportar Swarthy": fechas, testimonios, tracklists, fotos,
     el Instagram… con el formato que necesita cada pieza.
  7. Plan de medición: qué mirar en Search Console y en Plausible, cada cuánto, y qué
     contaría como avance a las 4 y a las 12 semanas.
  8. Ideas grandes para más adelante (esfuerzo L), separadas de lo inmediato.
- Publica el informe como artifact privado y dame el enlace.
- NO apliques cambios todavía: espera a que elija. Cuando lo haga: rama `task/<nombre>`
  (nunca push a main); copy en lib/data.ts, metadata por ruta, JSON-LD en
  lib/json-ld.ts con sus tests, rutas nuevas en app/sitemap.ts y `CONTENT_UPDATED_AT`
  al día; `npm run lint && npm run typecheck && npm test && npm run build`;
  `next start` + curl de cada ruta (title, canónica, robots, JSON-LD, sitemap);
  `graphify update .`, CLAUDE.md al día y PR en español. Después del despliegue, dame
  la lista de comprobación: inspección de URL y solicitud de indexación en Search
  Console, reenvío del sitemap y prueba de resultados enriquecidos.
- Guarda en el context lake (entidad "Web de artista DJ Swarthy") la línea base y las
  decisiones que tome, sin secretos ni IPs.

Reglas: responde en español; no inventes contenido ni datos; no cambies la dirección
visual; cada propuesta dice qué búsqueda gana y cómo se medirá, no sólo "es buena
práctica".
```
