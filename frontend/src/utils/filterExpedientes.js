const normalize = (str = "") => str.toLowerCase().replace(/^p-/, "");

export function filterByExpediente(list = [], term = "") {
  const needle = normalize(term.trim());
  if (!needle) return list;
  return list.filter((item) => {
    const numero = item?.expediente?.numero;
    if (!numero) return false;
    return normalize(numero).startsWith(needle);
  });
}
