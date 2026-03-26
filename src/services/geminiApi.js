const GEMINI_API_KEY = "AIzaSyCV8OH6v4trZrxLS1zdytMH5_h_pXjTtUY"; 

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

export const processImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800;
        let w = img.width, h = img.height;
        if (w > h && w > MAX_SIZE) { h *= MAX_SIZE / w; w = MAX_SIZE; }
        else if (h > MAX_SIZE) { w *= MAX_SIZE / h; h = MAX_SIZE; }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.8), mimeType: 'image/jpeg' });
      };
    };
  });
};

export const enhancePublication = async (draft) => {
  const textUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
  const textPayload = {
    contents: [{ parts: [{ text: `Título: ${draft.title}. Desc: ${draft.desc}. Cat: ${draft.cat}.` }] }],
    systemInstruction: { parts: [{ text: "Eres un experto en e-commerce escolar. Mejora el título (<50 chars) y la descripción para que sea persuasiva. Devuelve un JSON con 'title' y 'description'." }] },
    generationConfig: { responseMimeType: "application/json" }
  };
  
  const textData = await fetchWithRetry(textUrl, { method: 'POST', body: JSON.stringify(textPayload) });
  return JSON.parse(textData.candidates[0].content.parts[0].text);
};
