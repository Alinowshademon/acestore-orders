export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Ensure request body is parsed
  let reqBody;
  try {
    reqBody = req.body;
    console.log("Received request body:", reqBody);
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "alinowshademon/acestore-orders"; // Replace with your repo

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: "GitHub token not set in environment variables" });
  }

  // Validate essential fields
  if (!reqBody.orderDetails || !reqBody.total) {
    return res.status(400).json({ error: "Missing orderDetails or total" });
  }

  const title = `🛍️ New Order - ${reqBody.customerName || "Guest"} (${reqBody.total}৳)`;

  const issueBody = `
**Order Details:** ${reqBody.orderDetails}
**Total:** ৳${reqBody.total}
**Customer:** ${reqBody.customerName || "Guest"}
**Contact:** ${reqBody.customerContact || "N/A"}
**Form URL:** ${reqBody.prefillFormUrl || "N/A"}
**Timestamp:** ${reqBody.timestamp || new Date().toISOString()}
`;

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
      method: "POST",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body: issueBody }),
    });

    const responseText = await response.text();
    console.log("GitHub response status:", response.status);
    console.log("GitHub response text:", responseText);

    if (!response.ok) {
      return res.status(response.status).json({ error: responseText });
    }

    res.status(200).json({ message: "✅ Order issue created!", githubResponse: responseText });
  } catch (err) {
    console.error("Serverless function error:", err);
    res.status(500).json({ error: err.message });
  }
}
