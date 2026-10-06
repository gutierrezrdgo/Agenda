import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const WHATSAPP_NUMBER = "528139600745";

const encounterTypes = [
  {
    id: "primera",
    eyebrow: "PRIMER ENCUENTRO",
    title: "Primera sesión",
    duration: "75 min",
    copy: "Para conocernos, entender qué estás viviendo y decidir si este espacio tiene sentido para ti.",
  },
  {
    id: "seguimiento",
    eyebrow: "SEGUIMIENTO",
    title: "Sesión individual",
    duration: "60 min",
    copy: "Para continuar un proceso ya iniciado y trabajar con atención sobre lo que está ocurriendo ahora.",
  },
];

const modalities = [
  {
    id: "online",
    label: "A distancia",
    detail: "Videollamada",
  },
  {
    id: "cdmx",
    label: "CDMX",
    detail: "Presencial · sujeto a disponibilidad",
  },
];

function formatDate(date) {
  if (!date) return "Sin fecha elegida";
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function App() {
  const [encounter, setEncounter] = useState("primera");
  const [modality, setModality] = useState("online");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const selectedEncounter = encounterTypes.find((item) => item.id === encounter);
  const selectedModality = modalities.find((item) => item.id === modality);

  const minDate = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const ready = Boolean(date && time && name.trim());

  const openWhatsApp = () => {
    if (!ready) return;

    const lines = [
      "Hola, Dr. Rodrigo. Me gustaría solicitar un horario.",
      "",
      `Nombre: ${name.trim()}`,
      `Encuentro: ${selectedEncounter.title} · ${selectedEncounter.duration}`,
      `Modalidad: ${selectedModality.label}`,
      `Fecha preferente: ${formatDate(date)}`,
      `Hora preferente: ${time}`,
    ];

    if (note.trim()) {
      lines.push(`Nota: ${note.trim()}`);
    }

    lines.push("", "Entiendo que el horario queda confirmado cuando reciba respuesta.");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Inicio">
          <img src="/elsewhere-mark.svg" alt="" aria-hidden="true" />
        </a>
        <div className="topbar-title">AGENDA</div>
        <div className="topbar-meta">RODRIGO GUTIÉRREZ-VÁSQUEZ</div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-kicker">CONSULTA · PSICOTERAPIA</div>
          <h1>
            AGENDA
            <em>UNA SESIÓN.</em>
          </h1>
          <p className="hero-copy">
            Elige el tipo de encuentro, modalidad, fecha y hora que te resulten convenientes.
            La solicitud se confirma personalmente por WhatsApp.
          </p>
          <div className="hero-strip">
            <span>01 ENCUENTRO</span>
            <span>02 MODALIDAD</span>
            <span>03 FECHA</span>
            <span>04 CONFIRMACIÓN</span>
          </div>
        </section>

        <section className="booking">
          <aside className="booking-intro">
            <span>01 / ENCUENTRO</span>
            <h2>¿QUÉ NECESITAS?</h2>
            <p>
              No hace falta decidirlo con precisión clínica. Sólo elige la opción que mejor describe
              el tipo de cita que buscas.
            </p>
          </aside>

          <div className="booking-flow">
            <div className="choice-grid">
              {encounterTypes.map((item) => (
                <button
                  key={item.id}
                  className={encounter === item.id ? "choice-card active" : "choice-card"}
                  onClick={() => setEncounter(item.id)}
                  type="button"
                >
                  <span>{item.eyebrow}</span>
                  <strong>{item.title}</strong>
                  <b>{item.duration}</b>
                  <p>{item.copy}</p>
                </button>
              ))}
            </div>

            <div className="block">
              <div className="block-head">
                <span>02 / MODALIDAD</span>
                <h3>¿DÓNDE?</h3>
              </div>
              <div className="modality-grid">
                {modalities.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={modality === item.id ? "modality active" : "modality"}
                    onClick={() => setModality(item.id)}
                  >
                    <span>{item.label}</span>
                    <small>{item.detail}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="block">
              <div className="block-head">
                <span>03 / FECHA Y HORA</span>
                <h3>¿CUÁNDO?</h3>
              </div>

              <div className="field-grid">
                <label>
                  <span>FECHA PREFERENTE</span>
                  <input
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </label>

                <label>
                  <span>HORA PREFERENTE</span>
                  <input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                  />
                </label>
              </div>
              <p className="microcopy">
                Elegir una hora no la bloquea automáticamente. La disponibilidad se confirma antes
                de considerar la cita reservada.
              </p>
            </div>

            <div className="block">
              <div className="block-head">
                <span>04 / TUS DATOS</span>
                <h3>¿A NOMBRE DE QUIÉN?</h3>
              </div>

              <div className="field-grid single">
                <label>
                  <span>NOMBRE</span>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>

                <label>
                  <span>NOTA OPCIONAL</span>
                  <textarea
                    rows="4"
                    placeholder="Algo que convenga saber antes de confirmar."
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="summary-section">
          <div className="summary-label">RESUMEN</div>
          <div className="summary-main">
            <p>{selectedEncounter.title}</p>
            <p>{selectedEncounter.duration}</p>
            <p>{selectedModality.label}</p>
            <p>{formatDate(date)}</p>
            <p>{time || "Sin hora elegida"}</p>
          </div>
          <div className="summary-action">
            <button type="button" onClick={openWhatsApp} disabled={!ready}>
              Solicitar horario por WhatsApp ↗
            </button>
            <small>
              La cita sólo queda confirmada después de recibir respuesta. Nada de calendarios
              fingiendo certeza metafísica donde todavía no la hay.
            </small>
          </div>
        </section>

        <section className="note-section">
          <span>ANTES DE AGENDAR</span>
          <p>
            Este formulario sirve para solicitar una cita. No es un servicio de urgencias ni sustituye
            atención médica inmediata cuando existe una situación de riesgo.
          </p>
        </section>
      </main>

      <footer>
        <img src="/elsewhere-mark.svg" alt="" aria-hidden="true" />
        <p>RODRIGO GUTIÉRREZ-VÁSQUEZ · MÉDICO PSICOTERAPEUTA</p>
        <p>CDMX · 2026</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
