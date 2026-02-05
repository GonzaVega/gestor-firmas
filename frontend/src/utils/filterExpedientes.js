const normalize = (str = "") => str.toLowerCase().replace(/^p-/, "");

export function filterByExpediente(list = [], term = "") {
  const needle = normalize(term.trim());
  if (!needle) return list;
  return list.filter((item) => {
    // Soporte para estructura anidada (Firmas) o plana (Tareas/Notas)
    const numero = item?.expediente?.numero || item?.expediente || item?.expediente_numero;
    if (!numero) return false;
    return normalize(numero).startsWith(needle);
  });
}
