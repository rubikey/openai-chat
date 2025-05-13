
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ output: "Método no permitido" });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ output: "Falta el texto de entrada." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Sin respuesta";
    res.status(200).json({ output: text });

  } catch (error) {
    console.error("Error en OpenAI:", error);
    res.status(500).json({ output: "Error al contactar con OpenAI." });
  }
}
