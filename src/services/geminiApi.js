const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDmEA-pb_wNzwuVnsdQfG7UfrmyJj_tog0";

export const fetchWithRetry = async (url, options, retries = 3) => {
  const delays = [1000, 2000, 4000];
  const fetchOptions = {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  };
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, fetchOptions);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `Error HTTP ${res.status}`);
      return data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, delays[i]));
    }
  }
};

/**
 * Procesa la imagen: recorte cuadrado centrado 600x600 + filtros profesionales de catálogo
 */
export const processImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const SIZE = 600;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');

        // Recorte centrado (object-cover)
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);

        // --- Mejora publicitaria con filtros Canvas ---
        const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          // Brillo +10, Contraste x1.15, Saturación x1.2
          let r = d[i], g = d[i+1], b = d[i+2];
          // Brillo
          r += 10; g += 10; b += 10;
          // Contraste (factor 1.15)
          r = 1.15 * (r - 128) + 128;
          g = 1.15 * (g - 128) + 128;
          b = 1.15 * (b - 128) + 128;
          // Saturación x1.2 (convertir a luminancia y escalar)
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          r = lum + 1.2 * (r - lum);
          g = lum + 1.2 * (g - lum);
          b = lum + 1.2 * (b - lum);
          d[i]   = Math.min(255, Math.max(0, r));
          d[i+1] = Math.min(255, Math.max(0, g));
          d[i+2] = Math.min(255, Math.max(0, b));
        }
        ctx.putImageData(imageData, 0, 0);

        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.9), mimeType: 'image/jpeg' });
      };
    };
  });
};

/**
 * Optimización publicitaria con Gemini Vision:
 * Analiza la imagen del producto y genera título + descripción de catálogo profesional.
 */
export const enhancePublication = async (draft) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  // Partes del mensaje: texto del anuncio + imagen del producto (si existe)
  const parts = [];
  if (draft.img) {
    const base64 = draft.img.split(',')[1]; // quitar "data:image/jpeg;base64,"
    parts.push({ inlineData: { mimeType: draft.mime || 'image/jpeg', data: base64 } });
  }
  parts.push({
    text: `Analiza este producto escolar. Datos del vendedor: Título="${draft.title}", Descripción="${draft.desc}", Categoría="${draft.cat}", Precio="${draft.price}".
    
Como publicista experto en e-commerce para mercados escolares, crea un anuncio irresistible.
Devuelve SOLO un JSON válido (sin markdown, sin backticks) con exactamente estos campos:
{
  "title": "título corto y atractivo (máx 45 caracteres)",
  "description": "descripción persuasiva de 1-2 oraciones que destaque beneficios únicos y llame a la acción (máx 120 caracteres)"
}`
  });

  const payload = {
    contents: [{ parts }],
    generationConfig: { temperature: 0.8 }
  };

  const data = await fetchWithRetry(url, { method: 'POST', body: JSON.stringify(payload) });
  const raw = data.candidates[0].content.parts[0].text;
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
  return JSON.parse(cleaned);
};
