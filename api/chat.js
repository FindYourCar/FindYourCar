export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content:
              "You are FindMyCar, an expert AI car advisor for Europe. Help users choose cars based on budget, fuel type, reliability, body style, country, and use case. Ask follow-up questions when needed. Be practical, honest, and concise."
          },
          ...(messages || [])
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Groq request failed"
      });
    }

    const reply = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
