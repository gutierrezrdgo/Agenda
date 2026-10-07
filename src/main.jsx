import { useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./styles/success-burst.css";
import { SuccessBurst } from "./components/SuccessBurst";
import {
  buildBookingWhatsAppUrl,
  buildContactWhatsAppUrl,
  buildGlobalAccessWhatsAppUrl,
  buildWaitlistWhatsAppUrl,
} from "./lib/booking";

const scheduleSections = [
  {
    id: "manana",
    eyebrow: "MAÑANA",
    note: "Antes de que empiece el resto del día.",
    slots: [
      {
        id: "0700",
        time: "7:00 h",
        title: "Primera hora",
        description:
          "Para quienes prefieren empezar temprano y dejar este espacio protegido antes de entrar en la jornada.",
        status: "available",
        statusLabel: "Disponible",
        fixed: true,
        priceLabel: "4 sesiones · $4,800 al mes",
        cost: "$4,800 al mes",
        sessionCost: "$1,200 por sesión",
        cta: "Disponible",
      },
      {
        id: "1000",
        time: "10:00 h",
        description: "Una sesión a media mañana, con tiempo para continuar tu día después.",
        status: "booked",
        statusLabel: "Completo por ahora",
        fixed: false,
        priceLabel: "Sesión · $900",
        cost: "$900",
        cta: "Avísame si se libera",
      },
      {
        id: "1230",
        time: "12:30 h",
        description: "Para hacer una pausa antes de continuar con el resto de tus actividades.",
        status: "booked",
        statusLabel: "Completo por ahora",
        fixed: false,
        priceLabel: "Sesión · $900",
        cost: "$900",
        cta: "Avísame si se libera",
      },
    ],
  },
  {
    id: "tarde",
    eyebrow: "TARDE",
    note: "Un espacio entre todo lo demás.",
    slots: [
      {
        id: "1600",
        time: "16:00 h",
        title: "Media tarde",
        description:
          "Un horario reservado para tener continuidad sin llevar la sesión hasta el final del día.",
        status: "booked",
        statusLabel: "Completo por ahora",
        fixed: true,
        priceLabel: "4 sesiones · $4,800 al mes",
        cost: "$4,800 al mes",
        sessionCost: "$1,200 por sesión",
        cta: "Avísame si se libera",
      },
      {
        id: "1730",
        time: "17:30 h",
        description:
          "Para terminar la tarde con un espacio propio antes de seguir con el resto del día.",
        status: "booked",
        statusLabel: "Completo por ahora",
        fixed: false,
        priceLabel: "Sesión · $900",
        cost: "$900",
        cta: "Avísame si se libera",
      },
      {
        id: "1900",
        time: "19:00 h",
        description:
          "Cuando la jornada empieza a bajar de ritmo y puedes llegar a sesión con un poco más de espacio.",
        status: "available",
        statusLabel: "Disponible",
        fixed: false,
        priceLabel: "Sesión · $900",
        cost: "$900",
        cta: "Reservar",
      },
    ],
  },
  {
    id: "after-hours",
    eyebrow: "AFTER HOURS",
    note: "Para quienes terminan el día más tarde.",
    slots: [
      {
        id: "2230",
        time: "22:30 h",
        description:
          "No todos los horarios caben entre las nueve y las seis. After Hours es un espacio nocturno reservado para personas cuya jornada, responsabilidades o rutina hacen difícil acudir en horarios convencionales.",
        status: "available",
        statusLabel: "Disponible",
        fixed: true,
        priceLabel: "4 sesiones · $6,000 al mes",
        cost: "$6,000 al mes",
        sessionCost: "$1,500 por sesión",
        cta: "Reservar",
        wide: true,
      },
    ],
  },
];

const allSlots = scheduleSections.flatMap((section) =>
  section.slots.map((slot) => ({ ...slot, section: section.eyebrow }))
);

function formatDate(date) {
  if (!date) return "Por elegir";
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function App() {
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [date, setDate] = useState("");
  const [modality, setModality] = useState("online");
  const [confirmed, setConfirmed] = useState(false);
  const [burst, setBurst] = useState({ id: 0, active: false });

  const sessionRef = useRef(null);
  const successRef = useRef(null);

  const selectedSlot = allSlots.find((slot) => slot.id === selectedSlotId);

  const minDate = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const ready = Boolean(selectedSlot && date && modality);

  const selectSlot = (slot) => {
    setSelectedSlotId(slot.id);
    setConfirmed(false);
    requestAnimationFrame(() => {
      sessionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const confirmSession = () => {
    if (!ready || !selectedSlot) return;

    const url = buildBookingWhatsAppUrl({
      formattedDate: formatDate(date),
      modality: modality === "online" ? "En línea" : "Presencial",
      slot: selectedSlot,
    });

    window.open(url, "_blank", "noopener,noreferrer");
    setConfirmed(true);
    setBurst((previous) => ({ id: previous.id + 1, active: true }));

    requestAnimationFrame(() => {
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Inicio">
          <img src="/elsewhere-mark.svg" alt="" aria-hidden="true" />
        </a>
        <div className="topbar-title">AGENDA</div>
        <div className="topbar-meta">DR. RODRIGO GUTIÉRREZ VÁSQUEZ</div>
      </header>

      <main id="top">
        <section className="intro-hero">
          <div className="intro-kicker">PSICOTERAPIA · CDMX / EN LÍNEA</div>
          <div className="intro-grid">
            <h1>
              Agenda
              <br />
              <em>tu sesión</em>
            </h1>
            <div className="intro-copy">
              <p>
                A veces necesitas trabajar algo que lleva tiempo contigo. Otras, ordenar una decisión,
                atravesar un cambio o simplemente tener un espacio para detenerte y entender mejor cómo estás.
              </p>
              <p>La psicoterapia puede servir para ambas cosas.</p>
              <p>Aquí puedes conocer cómo trabajo y elegir el horario que mejor se adapte a tu día.</p>
              <a className="hero-cta" href="#horarios">
                <span>Ver horarios disponibles</span>
                <ArrowIcon />
              </a>
            </div>
          </div>

          <div className="clinician-card">
            <div>
              <strong>Dr. Rodrigo Gutiérrez Vásquez</strong>
              <span>Médico psicoterapeuta · Psicoterapia basada en evidencia</span>
            </div>
            <b>50 min · Presencial o en línea</b>
          </div>
        </section>

        <section className="landing-section" id="sobre-mi">
          <div className="landing-heading">
            <span>PSICOTERAPIA PARA ADULTOS</span>
            <div>
              <h2>Un espacio para entender lo que estás viviendo y trabajar sobre ello.</h2>
              <p className="landing-lead">
                Soy médico y psicoterapeuta. Mi formación integra medicina, psicología clínica
                cognitivo-conductual y neurociencias cognitivas.
              </p>
              <p>
                Trabajo con adultos que quieren comprender mejor lo que les está pasando y encontrar
                formas de responder que tengan sentido en su vida cotidiana, no sólo dentro de la sesión.
              </p>
            </div>
          </div>

          <div className="concerns-grid">
            <article>
              <span>01</span>
              <h3>Cuando todo empieza a pesar más de la cuenta</h3>
              <p>
                Ansiedad, estrés, ánimo bajo, insomnio o una mente que no termina de apagarse. A veces no
                hay una sola causa; simplemente llevas demasiado tiempo sosteniendo demasiado.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Cuando estás entre una etapa y la siguiente</h3>
              <p>
                Cambiar de trabajo, perder algo importante, tomar una decisión o empezar de nuevo puede mover
                más de lo que parece. Podemos ordenar lo que estás viviendo sin apresurarte a tener todas las respuestas.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Cuando con los demás siempre terminan en el mismo lugar</h3>
              <p>
                Pareja, familia, límites, distancia o conversaciones que se repiten. No se trata de decidir
                quién tiene razón, sino de entender qué está pasando y qué puedes hacer distinto.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Cuando cuidar tu salud también tiene que caber en tu vida</h3>
              <p>
                Si vives con diabetes, hipertensión, obesidad o colesterol elevado, podemos trabajar hábitos,
                adherencia y autocuidado para que el tratamiento encaje mejor en tu día a día, de la mano de tus especialistas.
              </p>
            </article>
          </div>
        </section>

        <section className="approach-section">
          <div className="approach-label">CÓMO TRABAJO</div>
          <div className="approach-copy">
            <h2>La terapia no empieza por darte una receta para vivir mejor.</h2>
            <div className="approach-columns">
              <p>
                Empezamos por entender qué estás viviendo, qué lo mantiene, qué has intentado hasta ahora y
                qué está teniendo un costo en tu vida. A partir de ahí construimos objetivos concretos y
                revisamos qué cambios vale la pena probar.
              </p>
              <p>
                Trabajo desde psicoterapia cognitivo-conductual y enfoques contextuales basados en evidencia.
                Eso puede incluir observar patrones, practicar habilidades, cambiar hábitos o aprender a
                relacionarte de otra manera con pensamientos y emociones difíciles.
              </p>
              <p>
                No necesitas llegar con un diagnóstico, una explicación perfecta ni una meta formulada como
                proyecto corporativo trimestral. Podemos empezar por lo que hoy te resulta difícil.
              </p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-heading">
            <span>DR. RODRIGO GUTIÉRREZ VÁSQUEZ</span>
            <h2>Médico psicoterapeuta con formación en neurociencias.</h2>
          </div>

          <div className="profile-grid">
            <div className="profile-copy">
              <p>
                Mi trabajo clínico combina una mirada médica con herramientas psicológicas orientadas a
                comprender conducta, emociones, aprendizaje y contexto.
              </p>
              <p>
                La intención no es reducir lo que te ocurre a una etiqueta ni convertir cada dificultad en
                una enfermedad. Es entenderla con suficiente precisión para poder hacer algo distinto con ella.
              </p>
              <a className="profile-cta" href="#horarios">
                <span>Ir a horarios</span>
                <ArrowIcon />
              </a>
            </div>

            <div className="credentials-list">
              <article>
                <span>MEDICINA</span>
                <strong>Universidad Durango Santander · Sonora</strong>
                <small>Cédula profesional 12527781</small>
              </article>
              <article>
                <span>CLÍNICA COGNITIVO-CONDUCTUAL</span>
                <strong>Universidad de Monterrey</strong>
                <small>Cédula 14950386</small>
              </article>
              <article>
                <span>NEUROCIENCIAS</span>
                <strong>Universitat Autònoma de Barcelona</strong>
                <small>Máster Universitario en Psicobiología y Neurociencia Cognitiva</small>
              </article>
              <article>
                <span>ACTUALIZACIÓN PROFESIONAL</span>
                <strong>Consejo Mexicano de Neurociencias</strong>
                <small>Miembro activo</small>
              </article>
            </div>
          </div>
        </section>

        <section className="session-format-section">
          <div>
            <span>SESIONES</span>
            <strong>50 min</strong>
            <p>Un espacio clínico individual para adultos.</p>
          </div>
          <div>
            <span>MODALIDAD</span>
            <strong>Presencial o en línea</strong>
            <p>CDMX o videollamada, según el horario disponible.</p>
          </div>
          <div>
            <span>PRIMERA SESIÓN</span>
            <strong>Empezamos por donde estés</strong>
            <p>No necesitas saber exactamente qué decir ni tener claro todavía qué nombre ponerle.</p>
          </div>
        </section>

        <section className="schedule-section" id="horarios">
          <div className="section-heading">
            <span>HORARIOS</span>
            <div>
              <h2>Elige tu horario</h2>
              <p>Busca un espacio que puedas sostener con calma, sin tener que correr de una cosa a otra.</p>
            </div>
          </div>

          <div className="schedule-groups">
            {scheduleSections.map((section) => (
              <section className={"time-band time-band-" + section.id} key={section.id}>
                <div className="time-band-head">
                  <h3>{section.eyebrow}</h3>
                  <p>{section.note}</p>
                </div>

                <div className={"schedule-grid" + (section.id === "after-hours" ? " schedule-grid-single" : "")}>
                  {section.slots.map((slot) => {
                    const available = slot.status === "available";
                    const selected = selectedSlotId === slot.id;

                    return (
                      <article
                        className={[
                          "schedule-card",
                          available ? "is-available" : "is-booked",
                          selected ? "is-selected" : "",
                          slot.fixed ? "is-fixed" : "",
                          slot.wide ? "is-wide" : "",
                        ].join(" ")}
                        key={slot.id}
                      >
                        <div className="slot-header">
                          <div>
                            <h4>
                              {slot.time}
                              {slot.title && <span> · {slot.title}</span>}
                            </h4>
                            <p>{slot.description}</p>
                          </div>
                          <span className={"status-pill " + (available ? "available" : "booked")}>
                            {slot.statusLabel}
                          </span>
                        </div>

                        <div className="slot-meta">
                          {slot.fixed && <span>HORARIO FIJO MENSUAL</span>}
                          <strong>{slot.priceLabel}</strong>
                          {slot.sessionCost && <small>{slot.sessionCost}</small>}
                        </div>

                        {available ? (
                          <button
                            className="slot-action primary"
                            type="button"
                            onClick={() => selectSlot(slot)}
                          >
                            <span>{slot.cta}</span>
                            <ArrowIcon />
                          </button>
                        ) : (
                          <a
                            className="slot-action secondary"
                            href={buildWaitlistWhatsAppUrl(slot)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{slot.cta}</span>
                            <ArrowIcon />
                          </a>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="global-access-section">
          <div className="global-access-label">GLOBAL ACCESS</div>
          <div className="global-access-copy">
            <h2>Psicoterapia en línea, aunque tu reloj esté en otra parte.</h2>
            <p>
              Si vives fuera de México, viajas con frecuencia o tu zona horaria no coincide con los horarios
              publicados, podemos buscar un espacio que funcione para ambos.
            </p>
            <p>
              Cuéntame desde dónde te conectarías y en qué momentos del día tienes mayor disponibilidad.
            </p>
            <a
              className="global-access-action"
              href={buildGlobalAccessWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Solicitar Global Access</span>
              <ArrowIcon />
            </a>
          </div>
        </section>

        <section className="before-section">
          <div className="section-heading compact">
            <span>ANTES DE RESERVAR</span>
            <div>
              <h2>Dos cosas que conviene saber.</h2>
            </div>
          </div>

          <div className="before-grid">
            <article>
              <span>01</span>
              <h3>Horario fijo mensual</h3>
              <p>
                Algunos horarios se reservan de manera mensual para poder mantenerlos disponibles
                exclusivamente para ti.
              </p>
              <p>
                Al elegir uno de estos espacios se reservan <strong>cuatro sesiones</strong>.
              </p>
              <p>Podrás revisar las fechas antes de confirmar.</p>
            </article>

            <article>
              <span>02</span>
              <h3>Si un horario está completo</h3>
              <p>Puedes dejar tus datos y te avisaremos si vuelve a estar disponible.</p>
              <p>
                Sin listas misteriosas ni compromisos. Si se libera, decides en ese momento si todavía te funciona.
              </p>
              <a
                className="text-action"
                href={buildWaitlistWhatsAppUrl({ time: "cualquier horario" })}
                target="_blank"
                rel="noopener noreferrer"
              >
                Avísame si se libera <ArrowIcon />
              </a>
            </article>
          </div>
        </section>

        <section className="session-section" ref={sessionRef}>
          <div className="session-shell">
            <div className="session-heading">
              <span>TU SESIÓN</span>
              <h2>Revisa antes de confirmar.</h2>
            </div>

            <div className="session-controls">
              <label className="date-control">
                <span>FECHA</span>
                <input
                  type="date"
                  min={minDate}
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setConfirmed(false);
                  }}
                />
              </label>

              <div className="modality-control">
                <span>MODALIDAD</span>
                <div className="segmented">
                  <button
                    type="button"
                    className={modality === "online" ? "active" : ""}
                    onClick={() => {
                      setModality("online");
                      setConfirmed(false);
                    }}
                    aria-pressed={modality === "online"}
                  >
                    En línea
                  </button>
                  <button
                    type="button"
                    className={modality === "presencial" ? "active" : ""}
                    onClick={() => {
                      setModality("presencial");
                      setConfirmed(false);
                    }}
                    aria-pressed={modality === "presencial"}
                  >
                    Presencial
                  </button>
                </div>
              </div>
            </div>

            <div className="session-summary">
              <div>
                <span>FECHA</span>
                <strong>{formatDate(date)}</strong>
              </div>
              <div>
                <span>HORA</span>
                <strong>{selectedSlot?.time || "Elige un horario"}</strong>
              </div>
              <div>
                <span>MODALIDAD</span>
                <strong>{modality === "online" ? "En línea" : "Presencial"}</strong>
              </div>
              <div>
                <span>COSTO</span>
                <strong>{selectedSlot?.cost || "Por definir"}</strong>
              </div>
            </div>

            {selectedSlot?.fixed && (
              <p className="fixed-note">
                Este es un horario fijo mensual. Al confirmarlo solicitas cuatro sesiones y podrás revisar
                las fechas del mes antes de finalizar.
              </p>
            )}

            <div className="confirm-wrap">
              <button className="confirm-button" type="button" onClick={confirmSession} disabled={!ready}>
                <span>{ready ? "Confirmar sesión" : "Elige fecha y horario"}</span>
                <ArrowIcon />
              </button>
              {burst.active && (
                <SuccessBurst
                  key={burst.id}
                  onComplete={() => setBurst((previous) => ({ ...previous, active: false }))}
                />
              )}
              <small>
                Al confirmar se abrirá WhatsApp con los datos de tu solicitud para completar la reserva.
              </small>
            </div>
          </div>
        </section>

        <section className={"success-section" + (confirmed ? " is-visible" : "")} ref={successRef} aria-live="polite">
          <div className="success-mark" aria-hidden="true">✓</div>
          <div>
            <span>LISTO</span>
            <h2>Tu sesión está reservada.</h2>
            <p>Recibirás la información necesaria para conectarte o acudir al consultorio.</p>
            <p>No necesitas preparar una explicación perfecta de lo que te pasa.</p>
            <p className="success-closing">Empezamos desde donde estés.</p>
          </div>
        </section>

        <section className="closing-section">
          <article>
            <span>SI ES TU PRIMERA SESIÓN</span>
            <p>
              Puedes llegar con una idea muy clara de lo que quieres trabajar o simplemente con la sensación
              de que algo merece atención.
            </p>
            <p>Ambas son buenas maneras de empezar.</p>
          </article>

          <article>
            <span>SI ESTÁS PASANDO POR UN MOMENTO ESPECIALMENTE DIFÍCIL</span>
            <p>
              Si necesitas atención en poco tiempo o no estás seguro de que una cita ordinaria sea suficiente
              para lo que estás viviendo, escríbeme antes de reservar.
            </p>
            <a className="text-action" href={buildContactWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              Contactar <ArrowIcon />
            </a>
          </article>
        </section>
      </main>

      <footer>
        <img src="/elsewhere-mark.svg" alt="" aria-hidden="true" />
        <p>Psicoterapia presencial y en línea</p>
        <p>Dr. Rodrigo Gutiérrez Vásquez · Médico psicoterapeuta</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
