import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/data";
import { SITE_URL } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata DJ Swarthy los datos personales enviados a través de los formularios de contratación y contacto de djswarthy.es.",
  alternates: { canonical: `${SITE_URL}/privacidad` },
};

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-dark-primary pb-24 pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h1 className="font-display text-4xl uppercase md:text-6xl">
            Política de <span className="text-gradient">privacidad</span>
          </h1>
          <p className="mt-4 text-sm text-text-secondary">
            Última actualización: agosto de 2026
          </p>

          <div className="mt-12 space-y-10 text-text-secondary [&_a:hover]:underline [&_a]:text-accent-orange [&_h2]:font-display [&_h2]:text-2xl [&_h2]:uppercase [&_h2]:text-text-primary [&_h2]:md:text-3xl [&_li]:list-disc [&_li]:leading-relaxed [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5">
            <section>
              <h2>1. Responsable del tratamiento</h2>
              <p>
                El responsable del tratamiento de los datos recogidos en este
                sitio es DJ Swarthy. Puedes contactar en cualquier momento
                escribiendo a{" "}
                <a href={`mailto:${site.bookingEmail}`}>{site.bookingEmail}</a>.
              </p>
            </section>

            <section>
              <h2>2. Qué datos recogemos</h2>
              <p>
                Únicamente los que introduces voluntariamente en alguno de los dos
                formularios del sitio:
              </p>
              <ul>
                <li>
                  <strong className="text-text-primary">
                    Formulario de contratación:
                  </strong>{" "}
                  nombre o empresa, email, teléfono (opcional), tipo de evento,
                  fecha, ciudad, aforo estimado, formato de set y el mensaje
                  adicional que escribas.
                </li>
                <li>
                  <strong className="text-text-primary">
                    Formulario de contacto:
                  </strong>{" "}
                  nombre, email y mensaje.
                </li>
              </ul>
              <p>
                No se recogen datos de categorías especiales, no se elaboran
                perfiles y no se toman decisiones automatizadas sobre ti.
              </p>
            </section>

            <section>
              <h2>3. Para qué los usamos y con qué base legal</h2>
              <p>
                Los datos se usan exclusivamente para responder a tu solicitud:
                preparar una propuesta de contratación o contestar a tu consulta.
                La base legal es tu{" "}
                <strong className="text-text-primary">consentimiento</strong>, que
                prestas al marcar la casilla del formulario antes de enviarlo, y
                la aplicación de medidas precontractuales a petición tuya.
              </p>
              <p>
                No se usan para enviarte comunicaciones comerciales ni
                newsletters, y no se ceden ni venden a terceros con fines
                publicitarios.
              </p>
            </section>

            <section>
              <h2>4. Destinatarios</h2>
              <p>
                El contenido de los formularios se entrega como notificación
                privada a través de{" "}
                <strong className="text-text-primary">Telegram</strong> (Telegram
                FZ-LLC), que actúa como canal de comunicación. Puedes consultar su{" "}
                <a
                  href="https://telegram.org/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  política de privacidad
                </a>
                . Fuera de eso, no se comparten con nadie más.
              </p>
              <p>
                El sitio está alojado en un servidor ubicado en la Unión Europea.
              </p>
            </section>

            <section>
              <h2>5. Cuánto tiempo se conservan</h2>
              <p>
                Los mensajes se conservan mientras dure la relación con el
                promotor o el interesado y, después, el tiempo necesario para
                atender posibles responsabilidades legales. Puedes pedir su
                supresión en cualquier momento.
              </p>
            </section>

            <section>
              <h2>6. Tus derechos</h2>
              <p>
                Tienes derecho a acceder a tus datos, rectificarlos, suprimirlos,
                limitar u oponerte a su tratamiento, y a la portabilidad. Para
                ejercerlos, escribe a{" "}
                <a href={`mailto:${site.bookingEmail}`}>{site.bookingEmail}</a>{" "}
                indicando qué derecho quieres ejercer.
              </p>
              <p>
                También puedes retirar tu consentimiento en cualquier momento, sin
                que ello afecte a la licitud del tratamiento previo, y presentar
                una reclamación ante la{" "}
                <a
                  href="https://www.aepd.es"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Agencia Española de Protección de Datos
                </a>{" "}
                si consideras que no se han respetado tus derechos.
              </p>
            </section>

            <section>
              <h2>7. Cookies y analítica</h2>
              <p>
                Este sitio{" "}
                <strong className="text-text-primary">
                  no instala cookies propias
                </strong>{" "}
                ni de seguimiento publicitario. La analítica se hace con{" "}
                <a
                  href="https://plausible.io/data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plausible
                </a>
                , que mide visitas de forma agregada y anónima, sin cookies y sin
                datos personales, por lo que no requiere banner de consentimiento.
              </p>
              <p>
                Si reproduces un vídeo de YouTube o un track de SoundCloud
                incrustados en la web, esos servicios sí pueden instalar sus
                propias cookies. Por eso los reproductores{" "}
                <strong className="text-text-primary">
                  no se cargan hasta que pulsas play
                </strong>
                : mientras no lo hagas, no se establece ninguna conexión con
                ellos.
              </p>
            </section>

            <section>
              <h2>8. Seguridad</h2>
              <p>
                El sitio se sirve íntegramente sobre HTTPS y aplica cabeceras de
                seguridad (CSP, protección contra sniffing de contenido y
                clickjacking). Los formularios están protegidos con limitación de
                envíos por IP para evitar abuso.
              </p>
            </section>
          </div>

          <div className="mt-16 border-t border-border-dark pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-accent-orange hover:underline"
            >
              ← Volver a la portada
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
