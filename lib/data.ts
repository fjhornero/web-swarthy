// Fuente única de verdad del contenido estático del sitio.
// Las secciones importan de aquí: cambiar copy nunca debe tocar componentes.

export interface GigDate {
  /** ISO YYYY-MM-DD — se usa tal cual en el JSON-LD de tipo Event */
  date: string;
  venue: string;
  city: string;
  country: string;
  /** URL de venta de entradas; si falta, la tarjeta no muestra botón */
  ticketsUrl?: string;
  /** Texto libre: "B2B con X", "Opening", "Closing"… */
  note?: string;
  status?: "confirmada" | "agotada";
}

export interface Testimonial {
  quote: string;
  author: string;
  /** Cargo y sala: "Promotor · Sala Taboo" */
  role: string;
}

export interface Venue {
  name: string;
  city: string;
  country: string;
  year: string;
  /** Sin imagen, la tarjeta cae al tratamiento tipográfico (ver Venues.tsx) */
  img?: string;
}

export interface Stat {
  value: string;
  label: string;
  /** Si está, Stats.tsx la cambia por el dato vivo correspondiente */
  live?: "sessions";
}

export interface PressAsset {
  label: string;
  /** Qué es y a qué tamaño, tal cual: sin llamar "alta" a lo que no lo es */
  note: string;
  /** Imagen que se enseña en la tarjeta de descarga */
  preview: string;
  /** Fondo de la vista previa: los logos negros necesitan uno claro */
  previewOn: "dark" | "light";
  /** "cover" para fotos (llenan la tarjeta); los logos van enteros y con aire */
  previewFit?: "cover";
  files: Array<{ label: string; href: string; download: string }>;
}

// Bio corta: quién es, dónde está, cuánto lleva y en qué salas ha pinchado, en
// tres frases que se pueden citar tal cual. Es la del press kit
// (`press.bioShort`) y la que abre «Sobre mí» en la home (`about.intro`): una
// sola constante para que las dos digan siempre lo mismo. Su traducción es
// `press.bioShortEn` y cambia con ella.
const BIO_SHORT =
  "DJ Swarthy es un DJ y productor afincado en Madrid con más de 19 años de carrera. Su base es el trance y el progressive, pero se mueve con la misma soltura por el tech house, el house, el nu disco y el remember. Ha pinchado en salas como Joy Eslava, Mondo Disko, Sala Taboo o Café La Palma.";

export const site = {
  name: "DJ SWARTHY",
  tagline: "DJ · PRODUCTOR · TODO TERRENO",
  bookingEmail: "djswarthy@gmail.com",

  // ID de artista en Spotify. Lo usan lib/spotify.ts (API/oEmbed) y la
  // sección de lanzamientos para construir los reproductores incrustados.
  spotifyArtistId: "3Ua2pcw8yGQ4bD2Ouf7d4b",

  // Número en formato internacional sin signos ni espacios (ej. "34600123456").
  // Vacío = no se muestra ningún CTA de WhatsApp en la web.
  whatsapp: "",

  // Estilos, del núcleo a la periferia. Los usan el hero, el press kit y el
  // JSON-LD: una sola lista para que no se desajusten.
  genres: ["Trance", "Progressive", "Tech House", "House", "Nu Disco", "Remember"],

  hero: {
    // Dice a la vista qué es y dónde ("DJ … en Madrid"), que es lo que busca
    // quien llega: antes lo decía un texto oculto dentro del h1.
    overline: "DJ Y PRODUCTOR EN MADRID",
    // El nombre es el titular y el lema va debajo: quien llega tiene que saber
    // de quién es la web antes que su eslogan. Es la misma jerarquía que la
    // imagen social (app/opengraph-image.tsx), para que lo que se ve al
    // compartir el enlace coincida con lo que se encuentra al abrirlo.
    name: "DJ SWARTHY",
    slogan: "MUSIC IS THE ANSWER",
    // Primero la especialidad y después la versatilidad: un promotor ubica
    // antes a "un DJ de trance que se adapta" que a "un DJ de todo".
    subheadline:
      "Más de 19 años detrás de los platos. Trance y progressive de corazón, todoterreno de oficio: un DJ que se adapta a la sala, al público y al momento.",
    // El primario lleva al booking: un promotor que llega con prisa tiene que
    // ver la acción principal sin bajar doce secciones.
    primaryCta: { label: "Solicitar fecha", href: "#booking" },
    secondaryCta: { label: "Escuchar último set", href: "#mixes" },
  },

  // Barra de cifras (stat band) — datos verificables, sin inventar.
  // `live: "sessions"` marca la cifra que Stats.tsx sustituye por el número
  // real de sesiones publicadas cuando los feeds responden: un dato que el
  // promotor comprueba dos secciones más abajo. Sin feeds se ve lo de aquí.
  stats: [
    { value: "19", label: "Años en cabina" },
    { value: "6", label: "Estilos que domina", live: "sessions" },
    { value: "100%", label: "En directo, sin playback" },
    { value: "Madrid", label: "Base · toda España" },
  ] as Stat[],

  about: {
    headline: "CONOCE A SWARTHY",
    // Primer párrafo de la sección: los hechos (quién, dónde, cuánto lleva, en
    // qué salas) antes que la historia, que por sí sola no nombra Madrid ni
    // ninguna sala.
    intro: BIO_SHORT,
    // Datos rápidos de la sección (components/QuickFacts.tsx): los tres que no
    // salen de una lista de este fichero. No añaden ningún dato: repiten en
    // corto lo que ya dicen la bio, las cifras de arriba y la FAQ, y cambian
    // con ellas.
    facts: {
      who: "DJ Swarthy, DJ y productor",
      where: "Base en Madrid · fechas en toda España",
      career: "Más de 19 años en cabina",
    },
    body: "Todo empezó en las fiestas del pueblo, con un maletín de vinilos, ganas de hacerlo bien y la certeza de que la música podía cambiar el ambiente de una plaza en cuestión de minutos. Ahí nació Swarthy.\n\nDiecinueve años después, ese instinto sigue intacto. Su corazón late al ritmo del progressive y el trance — esa música que construye paisajes, que sube despacio y te lleva lejos — pero su versatilidad es su sello: de un remember ochentero a un tech house de madrugada, pasando por house melódico o nu disco, ningún estilo le es ajeno y ninguno te dejará indiferente.\n\nUn DJ que no pincha para él, sino para quien llena la sala.",
  },

  // Próximas fechas confirmadas. Las pasadas se filtran solas (ver lib/dates.ts)
  // y cada una se emite como MusicEvent en el JSON-LD, así que aquí sólo
  // entran bolos cerrados de verdad. Con el array vacío la sección no se
  // renderiza. Nunca rellenar con datos de ejemplo: una fecha inventada en
  // una sala real es un evento falso publicado con el nombre de un tercero.
  dates: [] as GigDate[],

  // Testimonios de promotores. Misma regla: sólo citas reales y atribuibles.
  // Es prueba social y un testimonio inventado vale menos que ninguno.
  testimonials: [] as Testimonial[],

  // Comparativa de formatos de set. `option` es el texto con el que cada
  // formato aparece en el desplegable del formulario de booking: el botón
  // "Solicitar este formato" lo deja ya elegido.
  formats: [
    {
      name: "SET CLUB",
      duration: "90 — 120 min",
      option: "Set Club (90-120 min)",
      featured: false,
      includes: [
        "Set personalizado a tu sala",
        "Sound check incluido",
        "Rider técnico estándar",
        "Trance · House · Tech House",
      ],
    },
    {
      name: "PEAK TIME",
      duration: "2 — 3 h",
      option: "Peak Time (2-3 h)",
      featured: true,
      includes: [
        "Todo lo de Set Club",
        "Selección a medida del público",
        "Visuales sincronizados (opcional)",
        "Meet & greet con promotor",
        "Vídeo del set (extra)",
      ],
    },
    {
      name: "ALL NIGHT LONG",
      duration: "5 — 7 h",
      option: "All Night Long (5-7 h)",
      featured: false,
      includes: [
        "Todo lo de Peak Time",
        "Apertura + pico + cierre",
        "Set 100% improvisado",
        "Grabación profesional incluida",
      ],
    },
  ],

  // Clubs/festivales donde ha tocado
  venues: [
    { name: "Joy Eslava", city: "Madrid", country: "ES", year: "2025", img: "/images/venue-joy-eslava-2.jpg" },
    { name: "Sala Taboo", city: "Madrid", country: "ES", year: "2024", img: "/images/venue-sala-taboo.jpg" },
    { name: "Café La Palma", city: "Madrid", country: "ES", year: "2025", img: "/images/venue-cafe-la-palma.jpg" },
    // Sin foto de sala: cae al tratamiento tipográfico en vez de usar una
    // imagen que desentona con el resto de la rejilla.
    { name: "Keeper", city: "Madrid", country: "ES", year: "2024" },
    // Sin foto: la anterior llevaba el logo de la sala y caras reconocibles de público.
    { name: "Samsara", city: "Madrid", country: "ES", year: "2025" },
    { name: "Mondo Disko", city: "Madrid", country: "ES", year: "2024", img: "/images/venue-mondo-disko.jpg" },
  ] as Venue[],

  // Contenido del press kit (/press-kit)
  press: {
    bioShort: BIO_SHORT,
    rider: [
      "2x CDJ-3000 (o equivalente: CDJ-2000NXS2)",
      "1x mixer profesional (DJM-A9, DJM-900NXS2, Xone o V10)",
      "Monitor de cabina",
      "Cabina estable a ~1 m de altura, con espacio para el equipo",
      "2 tomas de corriente Schuko en cabina",
      "Llegada 60-90 min antes · sound check de 15-20 min",
    ],
    // Las mismas bios en inglés, para el promotor o el medio de fuera que
    // copia y pega. Son traducción de las de arriba: si cambian aquellas,
    // cambian éstas. "Remember" se glosa porque fuera de España no se entiende.
    bioShortEn:
      "DJ Swarthy is a Madrid-based DJ and producer with more than 19 years behind the decks. Trance and progressive are his home ground, but he is just as comfortable with tech house, house, nu disco and remember (90s and 2000s club classics). He has played at venues such as Joy Eslava, Mondo Disko, Sala Taboo and Café La Palma.",
    bioLongEn:
      "It all started at village fiestas, with a case of vinyl, the will to do it right and the certainty that music could change the mood of a whole square in a matter of minutes. That is where Swarthy was born.\n\nNineteen years on, that instinct is intact. His heart beats to progressive and trance — music that builds landscapes, rises slowly and takes you far — but versatility is his signature: from eighties remember classics to late-night tech house, by way of melodic house or nu disco, no style is foreign to him and none will leave you indifferent.\n\nA DJ who doesn't play for himself, but for the people who fill the room.",
    // Material descargable. El retrato va también en JPG porque es lo que
    // abre cualquier programa de maquetación; el isotipo en SVG y PNG con
    // transparencia real (trazados una vez a partir de logo-isotype.png).
    assets: [
      {
        label: "Retrato",
        note: "Blanco y negro · 864×1110 px",
        preview: "/images/portrait-bw.webp",
        previewOn: "dark",
        previewFit: "cover",
        files: [
          { label: "JPG", href: "/images/og.jpg", download: "dj-swarthy-retrato.jpg" },
          { label: "WEBP", href: "/images/portrait-bw.webp", download: "dj-swarthy-retrato.webp" },
        ],
      },
      {
        label: "Isotipo",
        note: "Vectorial y PNG transparente de 1024 px",
        preview: "/logo-isotype-white.svg",
        previewOn: "dark",
        files: [
          { label: "SVG", href: "/logo-isotype.svg", download: "dj-swarthy-isotipo.svg" },
          { label: "PNG negro", href: "/logo-isotype-black.png", download: "dj-swarthy-isotipo-negro.png" },
          { label: "PNG blanco", href: "/logo-isotype-white.png", download: "dj-swarthy-isotipo-blanco.png" },
        ],
      },
      {
        label: "Logotipo completo",
        note: "PNG sobre blanco · 291×173 px",
        preview: "/logo-wordmark.png",
        previewOn: "light",
        files: [{ label: "PNG", href: "/logo-wordmark.png", download: "dj-swarthy-logotipo.png" }],
      },
    ] as PressAsset[],
  },

  // FAQ
  faq: [
    {
      q: "¿Cuál es el cachet de Swarthy?",
      a: "Varía según el formato (set club, peak time o all night long), la ciudad y la fecha. Escríbenos con los detalles del evento y te enviamos propuesta cerrada en menos de 48h.",
    },
    {
      q: "¿Qué estilos pincha?",
      a: "Es un DJ todoterreno: trance y progressive como base, pero también tech house, house, nu disco y remember. Cada set se construye en función del público, la sala y la hora.",
    },
    {
      q: "¿Puedo proponer un setlist o pedir un estilo concreto?",
      a: "Por supuesto. Acepta peticiones y briefing del promotor, pero el set lo construye Swarthy: él lee la pista mejor que nadie y sabe cuándo soltar cada tema.",
    },
    {
      q: "¿Cuánto tiempo necesita para sound check?",
      a: "Llega 60-90 min antes con todo el equipo. Sound check breve (15-20 min) y revisión de cabina, monitores y CDJs.",
    },
    {
      q: "¿Toca fuera de Madrid y de España?",
      a: "Sí. Aunque su base es Madrid, está disponible para fechas en toda España e internacional. Para fuera de España, mejor avisar con 4-6 semanas de antelación.",
    },
    {
      q: "¿Qué equipo técnico necesita en cabina?",
      a: "Setup estándar: 2x CDJ (CDJ-3000 o equivalente), 1x mixer profesional (DJM-A9, V10 o similar) y monitor en cabina. El rider completo se envía al confirmar la fecha.",
    },
    {
      q: "¿Hace eventos privados, bodas o fiestas de empresa?",
      a: "Sí. Adapta el repertorio a eventos privados, bodas, cumpleaños y eventos corporativos. Para esos formatos amplía a remember, pop electrónico y selección bailable transversal.",
    },
  ],

  socials: [
    { label: "Spotify", url: "https://open.spotify.com/artist/3Ua2pcw8yGQ4bD2Ouf7d4b" },
    { label: "SoundCloud", url: "https://soundcloud.com/dj_swarthy" },
    { label: "YouTube", url: "https://www.youtube.com/@swarthy_dj" },
    { label: "Facebook", url: "https://www.facebook.com/profile.php?id=100063486909762" },
    { label: "X", url: "https://x.com/DjSwarthy" },
    { label: "TikTok", url: "https://www.tiktok.com/@swarthy_dj" },
    { label: "Twitch", url: "https://www.twitch.tv/swarthydj" },
  ],
};
