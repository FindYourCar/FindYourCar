export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const ollamaRes = await fetch('https://ollama.com/api/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-oss:20b',
        messages: [
          { role: 'user', content: message }
        ],
        stream: false
      })
    });

    const data = await ollamaRes.json();

    return res.status(200).json({
      reply: data?.message?.content || 'No response'
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
}