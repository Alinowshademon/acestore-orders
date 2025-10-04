import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const body = req.body;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Add in Vercel
  const REPO = "alinowshad/acestore-orders"; // e.g., alinowshad/acestore-orders

  const title = `🛍️ New Order - ${body.customerName || "Guest"} (${body.total}৳)`;
  const issueBody = `
**Order Details:** ${body.orderDetails}
**Total:** ৳${body.total}
**Customer:** ${body.customerName}
**Contact:** ${body.customerContact}
**Form:** ${body.prefillFormUrl}
**Timestamp:** ${body.timestamp}
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

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    res.status(200).json({ message: "Order issue created!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
