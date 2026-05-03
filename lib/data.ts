export const site = {
  name: "DJ SWARTHY",
  tagline: "DJ · PRODUCTOR · TODO TERRENO",
  bookingEmail: "djswarthy@gmail.com",

  hero: {
    overline: "DJ · PRODUCTOR · TODO TERRENO",
    headline: "MUSIC IS THE ANSWER",
    subheadline:
      "Más de 19 años detrás de los platos. Todo terreno donde se necesite: remember, trance, tech house, house y nu disco. Un DJ que se adapta a la sala, al público y al momento.",
    primaryCta: { label: "▶ Escuchar último set", href: "#mixes" },
    secondaryCta: { label: "Conoce a Swarthy", href: "#about" },
  },

  // Próxima fecha (countdown del hero apunta a ésta)
  nextGig: {
    iso: "2026-06-12T23:00:00+02:00",
    venue: "Sala Apolo",
    city: "Barcelona",
    seatsLeft: 8,
    seatsTotal: 50,
    url: "#",
  },

  about: {
    headline: "CONOCE A SWARTHY",
    body: "Todo empezó en las fiestas del pueblo, con un maletín de vinilos, ganas de hacerlo bien y la certeza de que la música podía cambiar el ambiente de una plaza en cuestión de minutos. Ahí nació Swarthy.\n\nDiecinueve años después, ese instinto sigue intacto. Su corazón late al ritmo del progressive y el trance — esa música que construye paisajes, que sube despacio y te lleva lejos — pero su versatilidad es su sello: de un remember ochentero a un tech house de madrugada, pasando por house melódico o nu disco, ningún estilo le es ajeno y ninguno te dejará indiferente.\n\nUn DJ que no pincha para él, sino para quien llena la sala.",
  },

  // "Tu camino al éxito" → "Tu noche con Swarthy"
  journey: [
    {
      step: "01",
      title: "WARM UP",
      body: "Apertura suave: deep, organic, italo de tempo medio para que la pista respire.",
    },
    {
      step: "02",
      title: "CALENTAMIENTO",
      body: "Subida progresiva con clásicos del house y groove disco. La sala empieza a moverse.",
    },
    {
      step: "03",
      title: "PICO",
      body: "Selección energética hecha a medida: pelotazos del catálogo y joyas en vinilo.",
    },
    {
      step: "04",
      title: "CIERRE",
      body: "Bajada con melodía, vocales y un último guiño. La gente se va con los pelos de punta.",
    },
  ],

  // Cursos → 3 sets destacados
  mixes: [
    {
      title: "ÚLTIMO SET EN SOUNDCLOUD",
      tag: "House · Disco",
      year: "2026",
      length: "— min",
      plays: "Escuchar",
      cover: "/images/gallery-1.jpg",
      url: "https://soundcloud.com/dj_swarthy",
      platform: "soundcloud",
      featured: true,
    },
    {
      title: "DJ SET — VÍDEO EN VIVO",
      tag: "YouTube · Live",
      year: "2025",
      length: "— min",
      plays: "Ver vídeo",
      cover: "/images/gallery-2.jpg",
      url: "https://www.youtube.com/@dj-swarthy",
      platform: "youtube",
      featured: false,
    },
    {
      title: "SESIONES EN VÍDEO",
      tag: "YouTube · DJ Sets",
      year: "2025",
      length: "— min",
      plays: "Ver canal",
      cover: "/images/gallery-3.jpg",
      url: "https://www.youtube.com/@dj-swarthy",
      platform: "youtube",
      featured: false,
    },
  ],

  // Features ("Aprende 100% online" → "Por qué Swarthy")
  features: [
    {
      icon: "vinyl",
      title: "100% VINILO Y CDJ",
      body: "Combina lo mejor del directo en vinilo con la precisión del control digital.",
    },
    {
      icon: "wand",
      title: "SET A MEDIDA",
      body: "Cada noche es distinta: el set se diseña para tu sala, tu público y tu hora.",
    },
    {
      icon: "headphones",
      title: "TÉCNICA SIN ATAJOS",
      body: "Quince años de mezcla limpia, transiciones largas y selección impecable.",
    },
    {
      icon: "zap",
      title: "ENERGÍA QUE DURA",
      body: "Sets de 90 min a all night long. Con la cabina sostenida hasta el último BPM.",
    },
  ],

  // "Cómo funciona" — 3 pasos para contratar
  howTo: [
    {
      step: "01",
      title: "ESCRÍBENOS",
      body: "Cuéntanos tu evento: fecha, ciudad, tipo de sala, formato y rider esperado.",
    },
    {
      step: "02",
      title: "CONFIRMAMOS",
      body: "Respondemos en menos de 48h con propuesta, cachet y técnica. Cerramos por contrato.",
    },
    {
      step: "03",
      title: "PINCHAMOS",
      body: "Llegamos con tiempo, sound check y todo el equipo necesario. Tú disfrutas la noche.",
    },
  ],

  // Comparativa cursos → comparativa formatos de set
  formats: [
    {
      name: "SET CLUB",
      duration: "90 — 120 min",
      price: "Consultar",
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
      price: "Consultar",
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
      price: "Consultar",
      featured: false,
      includes: [
        "Todo lo de Peak Time",
        "Apertura + pico + cierre",
        "Set 100% improvisado",
        "Grabación profesional incluida",
      ],
    },
  ],

  // KPIs grandes — vacío, sección eliminada
  kpis: [] as { value: string; label: string }[],

  // "Alumni" → clubs/festivales donde ha tocado
  venues: [
    { name: "Joy Eslava", city: "Madrid", country: "ES", year: "2025", img: "/images/venue-joy-eslava-2.jpg" },
    { name: "Sala Taboo", city: "Madrid", country: "ES", year: "2024", img: "/images/venue-sala-taboo.jpg" },
    { name: "Café La Palma", city: "Madrid", country: "ES", year: "2025", img: "/images/venue-cafe-la-palma.jpg" },
    { name: "Keeper", city: "Madrid", country: "ES", year: "2024", img: "/images/venue-keeper.jpg" },
    { name: "Samsara", city: "Madrid", country: "ES", year: "2025", img: "/images/venue-samsara.jpg" },
    { name: "Mondo Disko", city: "Madrid", country: "ES", year: "2024", img: "/images/venue-mondo-disko.jpg" },
  ],

  // Testimonios de promotores / prensa
  testimonials: [
    {
      quote:
        "Swarthy entendió la sala en 10 minutos y pinchó tres horas sin un solo bache. Vuelve seguro.",
      author: "Carla M.",
      role: "Programación, Sala Apolo",
    },
    {
      quote:
        "Pocos DJs tienen su capacidad de leer al público. La pista entera con él hasta el cierre.",
      author: "Iván R.",
      role: "Promotor, Mondo Disko",
    },
    {
      quote:
        "Un técnico impecable y una selección que viaja del italo al house de Detroit sin pestañear.",
      author: "Resident Advisor",
      role: "Reseña 2025",
    },
  ],

  // ROI / value stack → "lo que cuesta no contratar bien"
  value: {
    title: "LO QUE TE LLEVAS",
    items: [
      { label: "Set personalizado a tu sala", value: "Incluido" },
      { label: "Sound check + montaje", value: "Incluido" },
      { label: "Equipo en vinilo y CDJ", value: "Incluido" },
      { label: "Comunicación en RRSS pre-evento", value: "Incluido" },
      { label: "Grabación del set", value: "Opcional" },
      { label: "Vídeos verticales para promo", value: "Opcional" },
    ],
    total: { label: "Inversión desde", value: "800€" },
  },

  // Press kit / EPK
  pressKit: {
    title: "EPK · PRESS KIT",
    description:
      "Bio, fotos en alta resolución, rider técnico y enlaces a sets. Todo en un único PDF descargable.",
    fileLabel: "swarthy-epk-2026.pdf",
    href: "#",
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
    { label: "YouTube", url: "https://www.youtube.com/@dj-swarthy" },
    { label: "Facebook", url: "https://www.facebook.com/profile.php?id=100063486909762" },
    { label: "X", url: "https://x.com/DjSwarthy" },
    { label: "TikTok", url: "#" },
  ],
};
