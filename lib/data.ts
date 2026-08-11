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

export const site = {
  name: "DJ SWARTHY",
  tagline: "DJ · PRODUCTOR · TODO TERRENO",
  bookingEmail: "djswarthy@gmail.com",

  // Número en formato internacional sin signos ni espacios (ej. "34600123456").
  // Vacío = no se muestra ningún CTA de WhatsApp en la web.
  whatsapp: "",

  hero: {
    overline: "DJ · PRODUCTOR · TODO TERRENO",
    headline: "MUSIC IS THE ANSWER",
    subheadline:
      "Más de 19 años detrás de los platos. Todo terreno donde se necesite: remember, trance, tech house, house y nu disco. Un DJ que se adapta a la sala, al público y al momento.",
    primaryCta: { label: "Escuchar último set", href: "#mixes" },
    secondaryCta: { label: "Conoce a Swarthy", href: "#about" },
  },

  // Barra de cifras (stat band) — datos verificables, sin inventar
  stats: [
    { value: "19", label: "Años en cabina" },
    { value: "6", label: "Estilos que domina" },
    { value: "100%", label: "En directo, sin playback" },
    { value: "Madrid", label: "Base · toda España" },
  ],

  about: {
    headline: "CONOCE A SWARTHY",
    body: "Todo empezó en las fiestas del pueblo, con un maletín de vinilos, ganas de hacerlo bien y la certeza de que la música podía cambiar el ambiente de una plaza en cuestión de minutos. Ahí nació Swarthy.\n\nDiecinueve años después, ese instinto sigue intacto. Su corazón late al ritmo del progressive y el trance — esa música que construye paisajes, que sube despacio y te lleva lejos — pero su versatilidad es su sello: de un remember ochentero a un tech house de madrugada, pasando por house melódico o nu disco, ningún estilo le es ajeno y ninguno te dejará indiferente.\n\nUn DJ que no pincha para él, sino para quien llena la sala.",
  },

  // Próximas fechas. Vacío = la sección se oculta por completo y no se emite
  // el JSON-LD de eventos. Las fechas pasadas se filtran solas (ver Dates.tsx).
  dates: [] as GigDate[],

  // Testimonios de promotores. Vacío = la sección no se renderiza.
  // No rellenar con texto inventado: es prueba social, tiene que ser real.
  testimonials: [] as Testimonial[],

  // Comparativa de formatos de set
  formats: [
    {
      name: "SET CLUB",
      duration: "90 — 120 min",
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
    { name: "Samsara", city: "Madrid", country: "ES", year: "2025", img: "/images/venue-samsara.jpg" },
    { name: "Mondo Disko", city: "Madrid", country: "ES", year: "2024", img: "/images/venue-mondo-disko.jpg" },
  ] as Venue[],

  // Contenido del press kit (/press-kit)
  press: {
    bioShort:
      "DJ Swarthy es un DJ y productor afincado en Madrid con más de 19 años de carrera. Su base es el trance y el progressive, pero se mueve con la misma soltura por el tech house, el house, el nu disco y el remember. Ha pinchado en salas como Joy Eslava, Mondo Disko, Sala Taboo o Café La Palma.",
    rider: [
      "2x CDJ-3000 (o equivalente: CDJ-2000NXS2)",
      "1x mixer profesional (DJM-A9, DJM-900NXS2, Xone o V10)",
      "Monitor de cabina",
      "Cabina estable a ~1 m de altura, con espacio para el equipo",
      "2 tomas de corriente Schuko en cabina",
      "Llegada 60-90 min antes · sound check de 15-20 min",
    ],
    assets: [
      { label: "Retrato en alta (WEBP)", href: "/images/portrait-bw.webp" },
      { label: "Isotipo (PNG)", href: "/logo-isotype.png" },
      { label: "Logotipo completo (PNG)", href: "/logo-wordmark.png" },
    ],
  },

  // FAQ
  faq: [
    {
      q: "¿Cuál es el cachet de Swarthy?",
      a: "Varía según el formato (set club, peak time o all night long), la ciudad y la fecha. Escríbenos con los detalles del evento y te enviamos propuesta cerrada en menos de 48h.",
    },
    {
      q: "¿Qué estilos pincha?",
      a: "Es un DJ todo terreno: trance y progressive como base, pero también tech house, house, nu disco y remember. Cada set se construye en función del público, la sala y la hora.",
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
    { label: "SoundCloud", url: "https://soundcloud.com/dj_swarthy" },
    { label: "YouTube", url: "https://www.youtube.com/@swarthy_dj" },
    { label: "Facebook", url: "https://www.facebook.com/profile.php?id=100063486909762" },
    { label: "X", url: "https://x.com/DjSwarthy" },
    { label: "TikTok", url: "https://www.tiktok.com/@swarthy_dj" },
    { label: "Twitch", url: "https://www.twitch.tv/swarthydj" },
  ],
};
