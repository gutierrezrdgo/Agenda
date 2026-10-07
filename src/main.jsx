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
  { id: "online", label: "A distancia", detail: "Videollamada" },
  { id: "cdmx", label: "CDMX", detail: "Presencial · sujeto a disponibilidad" },
];

const slotGroups = [
  {
    id: "matutino",
    label: "MATUTINO",
    note: "Antes de que empiece el resto del día.",
    slots: [
      {
        id: "0700",
        time: "07:00",
        status: "available",
        special: true,
        price: "$1,200 / sesión",
        packageTotal: "$4,800",
        packageLabel: "4 sesiones del mes",
      },
      { id: "1000", time: "10:00", status: "booked" },
      { id: "1230", time: "12:30", status: "booked" },
    ],
  },
  {
    id: "vespertino",
    label: "VESPERTINO",
    note: "El tramo habitual de la tarde.",
    slots: [
      {
        id: "1600",
        time: "16:00",
        status: "booked",
        special: true,
        price: "$1,200 / sesión",
        packageTotal: "$4,800",
        packageLabel: "4 sesiones del mes",
      },
      { id: "1730", time: "17:30", status: "booked" },
      { id: "1900", time: "19:00", status: "available" },
    ],
  },
  {
    id: "global-access",
    label: "GLOBAL ACCESS",
    note: "After hours. Para quienes necesitan un horario fuera del bloque habitual.",
    slots: [
      {
        id: "2230",
        time: "22:30",
        status: "available",
        special: true,
        price: "$1,500 / sesión",
        packageTotal: "$6,000",
        packageLabel: "4 sesiones del mes",
      },
    ],
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
  const [slotId, setSlotId] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const selectedEncounter = encounterTypes.find((item) => item.id === encounter);
  const selectedModality = modalities.find((item) => item.id === modality);
  const selectedSlot = slotGroups.flatMap((group) => group.slots.map((slot) => ({ ...slot, group: group.label }))).find((slot) => slot.id === slotId);

  const minDate = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const ready = Boolean(date && selectedSlot && name.trim());

  const openWhatsApp = () => {
    if (!ready || !selectedSlot) return;

    const lines = [
      "Hola, Dr. Rodrigo. Me gustaría solicitar un horario.",
      "",
      `Nombre: ${name.trim()}`,
      `Encuentro: ${selectedEncounter.title} · ${selectedEncounter.duration}`,
      `Modalidad: ${selectedModality.label}`,
      `Fecha preferente: ${formatDate(date)}`,
      `Horario: ${selectedSlot.time} h · ${selectedSlot.group}`,
    ];

    if (selectedSlot.special) {
      lines.push(
        `Modalidad de agenda: ${selectedSlot.packageLabel} reservadas en conjunto`,
        `Costo: ${selectedSlot.price}`,
        `Total mensual: ${selectedSlot.packageTotal}`
      );
    }

    if (note.trim()) lines.push(`Nota: ${note.trim()}`);

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
            Elige el tipo de encuentro, modalidad, fecha y un horario disponible. Algunos horarios especiales se reservan como bloque mensual.
          </p>
          <div className="hero-strip">
            <span>01 ENCUENTRO</span>
            <span>02 MODALIDAD</span>
            <span>03 FECHA + SLOT</span>
            <span>04 CONFIRMACIÓN</span>
          </div>
        </section>

        <section className="booking">
          <aside className="booking-intro">
            <span>01 / ENCUENTRO</span>
            <h2>¿QUÉ NECESITAS?</h2>
            <p>No hace falta decidirlo con precisión clínica. Elige la opción que mejor describe el tipo de cita que buscas.</p>
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
                <span>03 / FECHA Y HORARIO</span>
                <h3>¿CUÁNDO?</h3>
              </div>

              <label className="date-field">
                <span>{selectedSlot?.special ? "FECHA DE INICIO PREFERENTE" : "FECHA PREFERENTE"}</span>
                <input
                  type="date"
                  min={minDate}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>

              <div className="slot-groups">
                {slotGroups.map((group) => (
                  <section className="slot-group" key={group.id}>
                    <div className="slot-group-head">
                      <div>
                        <span>{group.label}</span>
                        <p>{group.note}</p>
                      </div>
                    </div>

                    <div className="slot-grid">
                      {group.slots.map((slot) => {
                        const booked = slot.status === "booked";
                        const selected = slotId === slot.id;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={booked}
                            className={[
                              "slot-card",
                              booked ? "booked" : "available",
                              selected ? "selected" : "",
                              slot.special ? "special" : "",
                            ].join(" ")}
                            onClick={() => !booked && setSlotId(slot.id)}
                          >
                            <div className="slot-top">
                              <strong>{slot.time}</strong>
                              <span>{booked ? "APARTADO" : selected ? "SELECCIONADO" : "DISPONIBLE"}</span>
                            </div>

                            {slot.special ? (
                              <div className="slot-special-copy">
                                <b>SLOT ESPECIAL</b>
                                <p>{slot.price}</p>
                                <p>Se reserva únicamente como bloque de {slot.packageLabel}.</p>
                                <em>Total: {slot.packageTotal}</em>
                              </div>
                            ) : (
                              <p className="slot-regular-copy">
                                {booked ? "Este horario ya está reservado." : "Sesión individual disponible."}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              <p className="microcopy">
                Los horarios marcados como “apartado” no pueden seleccionarse. Elegir un slot especial implica solicitar las cuatro sesiones del mes en ese mismo horario y aceptar el total mensual indicado.
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
            <p>{selectedSlot ? `${selectedSlot.time} h · ${selectedSlot.group}` : "Sin horario elegido"}</p>
            {selectedSlot?.special && <p>{selectedSlot.packageLabel} · {selectedSlot.packageTotal}</p>}
          </div>
          <div className="summary-action">
            <button type="button" onClick={openWhatsApp} disabled={!ready}>
              Solicitar horario por WhatsApp ↗
            </button>
            <small>
              La solicitud no queda confirmada hasta recibir respuesta. En slots especiales, seleccionar el horario implica solicitar el bloque completo de cuatro sesiones del mes.
            </small>
          </div>
        </section>

        <section className="note-section">
          <span>ANTES DE AGENDAR</span>
          <p>
            Este formulario sirve para solicitar una cita. No es un servicio de urgencias ni sustituye atención médica inmediata cuando existe una situación de riesgo.
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
