export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Falta el mensaje" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        input: [
          {
            role: "system",
            content:
              "Eres Mi Robot IA, un compañero virtual que vive en el teléfono. Hablas español. Eres divertido, expresivo, amable y natural. Puedes mostrar emociones. Responde de forma breve y apropiada para ser escuchado por voz."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Error de OpenAI"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "No pude generar una respuesta."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
              }
