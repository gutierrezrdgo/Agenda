export function buildWhatsAppUrl({ name, encounter, modality, formattedDate, slot, note }) {
  const lines = [
    "Hola, Dr. Rodrigo. Me gustaría solicitar un horario.",
    "",
    "Nombre: " + name.trim(),
    "Encuentro: " + encounter.title + " · " + encounter.duration,
    "Modalidad: " + modality.label,
    "Fecha preferente: " + formattedDate,
    "Horario: " + slot.time + " h · " + slot.group,
  ];

  if (slot.special) {
    lines.push(
      "Modalidad de agenda: " + slot.packageLabel + " en conjunto",
      "Costo: " + slot.price,
      "Total mensual a cubrir: " + slot.packageTotal
    );
  }

  if (note.trim()) lines.push("Nota: " + note.trim());

  lines.push("", "Entiendo que el horario queda confirmado cuando reciba respuesta.");
  return "https://wa.me/528139600745?text=" + encodeURIComponent(lines.join("\n"));
}
