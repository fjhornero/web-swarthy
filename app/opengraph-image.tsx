import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Imagen social 1200x630 (la que ven WhatsApp, Telegram, X, LinkedIn…).
// Antes se declaraba el retrato vertical de 864x1212 y las plataformas lo
// recortaban por el centro, perdiendo la cara y sin ningún texto. Se genera
// en el build (ruta estática) con la tipografía de marca vendorizada en
// assets/fonts (OFL) porque next/font no está disponible dentro de ImageResponse.
export const dynamic = "force-static";
export const alt = "DJ Swarthy, DJ en Madrid: trance, house, tech house y remember. Booking abierto.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [font, portrait] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/BebasNeue-Regular.ttf")),
    readFile(join(process.cwd(), "public/images/og.jpg")),
  ]);
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "Bebas Neue",
          position: "relative",
        }}
      >
        {/* glow rojo */}
        <div
          style={{
            position: "absolute",
            left: -200,
            top: -300,
            width: 900,
            height: 900,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(225,29,72,0.35) 0%, rgba(225,29,72,0) 65%)",
          }}
        />

        {/* texto */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 0 0 80px",
            width: 760,
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 8,
              color: "#9ca3af",
              display: "flex",
            }}
          >
            DJ · PRODUCTOR · MADRID
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 168,
              lineHeight: 0.9,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            DJ SWARTHY
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 56,
              lineHeight: 1,
              display: "flex",
              background: "linear-gradient(135deg, #e11d48 0%, #f97316 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            MUSIC IS THE ANSWER
          </div>
          <div
            style={{
              marginTop: 34,
              fontSize: 28,
              letterSpacing: 4,
              color: "#9ca3af",
              display: "flex",
            }}
          >
            TRANCE · HOUSE · TECH HOUSE · REMEMBER
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 28,
              letterSpacing: 4,
              color: "#f97316",
              display: "flex",
            }}
          >
            BOOKING ABIERTO · DJSWARTHY.ES
          </div>
        </div>

        {/* retrato */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 440,
            height: 630,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <img
            src={portraitSrc}
            alt=""
            width={440}
            height={630}
            style={{ objectFit: "cover", width: 440, height: 630 }}
          />
          {/* degradado hacia el fondo para fundir el retrato con el panel de texto */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 200,
              height: 630,
              background: "linear-gradient(90deg, #0a0a0a 0%, rgba(10,10,10,0) 100%)",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bebas Neue", data: font, style: "normal", weight: 400 }],
    }
  );
}
