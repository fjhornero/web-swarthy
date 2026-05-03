export const site = {
  name: "DJ SWARTHY",
  tagline: "DJ · PRODUCTOR · SELECTOR",
  bookingEmail: "booking@djswarthy.es",

  hero: {
    overline: "DJ · PRODUCTOR · SELECTOR",
    headline: "PINCHA TU NOCHE\nCOMO UN PROFESIONAL",
    subheadline:
      "Más de 15 años llenando pistas. House, disco y electrónica con alma para clubes, festivales y eventos privados.",
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
    body: "Quince años detrás de los platos, residencias en Madrid, Barcelona e Ibiza, y un sonido que mezcla house clásico, disco italiano y electrónica orgánica. Sets construidos con paciencia, que respiran y empujan a partes iguales.",
    stats: [
      { value: "15+", label: "AÑOS EN CABINA" },
      { value: "120", label: "SETS / AÑO" },
      { value: "3", label: "RESIDENCIAS ACTIVAS" },
    ],
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
      title: "LATE NIGHT CUTS VOL. 04",
      tag: "House · Disco",
      year: "2026",
      length: "72 min",
      plays: "12.4K",
      cover: "/images/gallery-1.jpg",
      url: "#",
      featured: true,
    },
    {
      title: "BASEMENT TAPES",
      tag: "Deep · Italo",
      year: "2025",
      length: "65 min",
      plays: "8.2K",
      cover: "/images/gallery-2.jpg",
      url: "#",
      featured: false,
    },
    {
      title: "SALA ROJA RESIDENCY",
      tag: "Live recording",
      year: "2025",
      length: "118 min",
      plays: "21.7K",
      cover: "/images/gallery-3.jpg",
      url: "#",
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
      price: "Desde 800€",
      featured: false,
      includes: [
        "Vinilo + CDJ",
        "Set personalizado a tu sala",
        "Sound check incluido",
        "Rider técnico estándar",
      ],
    },
    {
      name: "PEAK TIME",
      duration: "2 — 3 h",
      price: "Desde 1.400€",
      featured: true,
      includes: [
        "Todo lo de Set Club",
        "Selección con vinilos exclusivos",
        "Visuales sincronizados (opcional)",
        "Meet & greet con promotor",
        "Vídeo del set (extra)",
      ],
    },
    {
      name: "ALL NIGHT LONG",
      duration: "5 — 7 h",
      price: "A consultar",
      featured: false,
      includes: [
        "Todo lo de Peak Time",
        "Apertura + pico + cierre",
        "Set 100% improvisado",
        "Grabación profesional incluida",
      ],
    },
  ],

  // KPIs grandes
  kpis: [
    { value: "15+", label: "AÑOS EN ACTIVO" },
    { value: "1.8K", label: "SETS PINCHADOS" },
    { value: "47", label: "CIUDADES" },
    { value: "120K", label: "OYENTES MENSUALES" },
  ],

  // "Alumni" → 6 clubs/festivales donde ha tocado
  venues: [
    { name: "Sala Apolo", city: "Barcelona", country: "ES", year: "2025", img: "/images/gallery-1.jpg" },
    { name: "Pacha", city: "Ibiza", country: "ES", year: "2024", img: "/images/gallery-2.jpg" },
    { name: "Mondo Disko", city: "Madrid", country: "ES", year: "2025", img: "/images/gallery-3.jpg" },
    { name: "Watergate", city: "Berlin", country: "DE", year: "2024", img: "/images/portrait.jpg" },
    { name: "Lux Frágil", city: "Lisboa", country: "PT", year: "2025", img: "/images/hero.jpg" },
    { name: "Sónar", city: "Barcelona", country: "ES", year: "2024", img: "/images/gallery-1.jpg" },
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
        "Pocos selectores tienen su capacidad de leer al público. La pista entera con él hasta el cierre.",
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
      q: "¿Cuál es el cachet base de Swarthy?",
      a: "Depende del formato y la ciudad. El set club arranca en 800€; peak time desde 1.400€. Escríbenos con los detalles del evento y enviamos propuesta cerrada.",
    },
    {
      q: "¿Pincha solo en vinilo?",
      a: "No. Combina vinilo y CDJ-3000 según el formato y la sala. Para festivales y picos largos, formato híbrido. Para sesiones íntimas, 100% vinilo siempre que la cabina lo permita.",
    },
    {
      q: "¿Puedo proponer un setlist o petición?",
      a: "Por supuesto. Atendemos peticiones del promotor pero el set lo construye Swarthy: él lee la pista mejor que nadie y sabe cuándo soltar cada tema.",
    },
    {
      q: "¿Cuánto dura el sound check?",
      a: "Llegamos 60-90 min antes con todo el equipo. Sound check breve (15-20 min) y revisión de cabina, monitores y CDJs.",
    },
    {
      q: "¿Toca fuera de España?",
      a: "Sí, gira regular por Berlín, Lisboa, Ámsterdam y París. Para fechas internacionales, mejor con 4-6 semanas de antelación.",
    },
    {
      q: "¿Qué necesito tener en cabina?",
      a: "2x CDJ-3000 (o equivalente), 1x DJM-A9 o V10, 2x giradiscos Technics 1200 con cápsulas Concorde, y monitor en cabina. El rider completo va en el EPK.",
    },
  ],

  socials: [
    { label: "Instagram", url: "https://instagram.com" },
    { label: "SoundCloud", url: "https://soundcloud.com" },
    { label: "Mixcloud", url: "https://mixcloud.com" },
    { label: "Spotify", url: "https://open.spotify.com" },
    { label: "YouTube", url: "https://youtube.com" },
  ],
};
