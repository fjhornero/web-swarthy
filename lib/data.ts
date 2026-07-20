export const site = {
  name: "DJ SWARTHY",
  tagline: "DJ · PRODUCTOR · TODO TERRENO",
  bookingEmail: "djswarthy@gmail.com",

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
    { name: "Keeper", city: "Madrid", country: "ES", year: "2024", img: "/images/venue-keeper.jpg" },
    { name: "Samsara", city: "Madrid", country: "ES", year: "2025", img: "/images/venue-samsara.jpg" },
    { name: "Mondo Disko", city: "Madrid", country: "ES", year: "2024", img: "/images/venue-mondo-disko.jpg" },
  ],

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
