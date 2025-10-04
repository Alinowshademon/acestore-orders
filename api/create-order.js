export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const reqBody = req.body;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "alinowshad/acestore-orders";

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: "GitHub token not set" });
  }

  const title = `🛍️ New Order - ${reqBody.customerName || "Guest"} (${reqBody.total}৳)`;

  const issueContent = `
**Order Details:** ${reqBody.orderDetails}
**Total:** ৳${reqBody.total}
**Customer:** ${reqBody.customerName || "Guest"}
**Contact:** ${reqBody.customerContact || "N/A"}
**Form URL:** ${reqBody.prefillFormUrl}
**Timestamp:** ${reqBody.timestamp}
`;

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
      method: "POST",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body: issueContent }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.log("GitHub Error:", text);
      return res.status(response.status).json({ error: text });
    }

    res.status(200).json({ message: "✅ Order issue created!" });
  } catch (err) {
    console.log("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
}
