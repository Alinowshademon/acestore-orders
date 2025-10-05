export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { username, order } = req.body;

  if (!username || !order) {
    return res.status(400).json({ error: "Missing username or order" });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "alinowshademon/acestore-orders"; // change if needed

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
      method: "POST",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: `🛒 Order from ${username}`,
        body: `**User:** ${username}\n**Order:** ${order}\n**Time:** ${new Date().toLocaleString()}`,
        labels: ["order"]
      })
    });

    if (!response.ok) {
      const data = await response.text();
      return res.status(500).json({ error: "GitHub API failed", details: data });
    }

    const issue = await response.json();
    return res.status(200).json({ success: true, issue });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
