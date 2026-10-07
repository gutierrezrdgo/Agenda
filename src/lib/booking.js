const WHATSAPP_NUMBER = "528139600745";

function whatsappUrl(lines) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
}

export function buildBookingWhatsAppUrl({ formattedDate, modality, slot }) {
  const lines = [
    "Hola, Dr. Rodrigo. Me gustaría confirmar una sesión.",
    "",
    "Fecha: " + formattedDate,
    "Hora: " + slot.time,
    "Modalidad: " + modality,
    "Costo: " + slot.cost,
  ];

  if (slot.fixed) {
    lines.push(
      "Horario fijo mensual: 4 sesiones",
      slot.sessionCost ? "Costo por sesión: " + slot.sessionCost : ""
    );
  }

  lines.push("", "Entiendo que la reserva queda sujeta a confirmación por este medio.");
  return whatsappUrl(lines.filter(Boolean));
}

export function buildWaitlistWhatsAppUrl(slot) {
  const time = slot?.time || "un horario que está completo";
  return whatsappUrl([
    "Hola, Dr. Rodrigo. Me gustaría que me avisaran si se libera " + time + ".",
    "",
    "Si vuelve a estar disponible, decidiré en ese momento si todavía me funciona.",
  ]);
}

export function buildGlobalAccessWhatsAppUrl() {
  return whatsappUrl([
    "Hola, Dr. Rodrigo. Me gustaría solicitar Global Access.",
    "",
    "Me conectaría desde:",
    "Mi zona horaria es:",
    "Los momentos del día que normalmente me funcionan son:",
  ]);
}

export function buildContactWhatsAppUrl() {
  return whatsappUrl([
    "Hola, Dr. Rodrigo. Estoy pasando por un momento especialmente difícil y quisiera escribirle antes de reservar una sesión ordinaria.",
  ]);
}
