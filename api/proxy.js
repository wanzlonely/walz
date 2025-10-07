export default async function handler(req, res) {
  try {
    const response = await fetch("https://agentrouter.org/api/v1/ask", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AGENTROUTER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
