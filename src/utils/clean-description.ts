export default function cleanDescription(html: string): string {
  if (typeof window === "undefined") {
    // Si estamos en Node.js, usar DOMParser de JSDOM o alguna alternativa si lo deseas
    // Pero como no queremos jsdom, seguimos con esta implementación universal
  }

  // Reemplaza <br> por \n
  let sanitized = html.replace(/<br\s*\/?>/gi, "\n");

  // Elimina etiquetas <img>
  sanitized = sanitized.replace(/<img[^>]*>/gi, "");

  // Elimina estilos inline (solo atributo style, no CSS completo)
  sanitized = sanitized.replace(/ style="[^"]*"/gi, "");

  // Extrae el contenido de los <p>, si querés conservarlos como párrafos
  const paragraphs =
    sanitized.match(/<p[^>]*>([\s\S]*?)<\/p>/g)?.map((p) => {
      const inner = p.replace(/<\/?p[^>]*>/gi, "").trim();
      return inner;
    }) || [];

  return paragraphs.join("\n\n").trim();
}
