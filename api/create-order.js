export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const order = req.body;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "YOUR_USERNAME/YOUR_REPO"; // e.g., alinowshad/acestore-orders

  const title = `🛍️ New Order - ${order.customerName || "Guest"} (${order.total}৳)`;
  const issueBody = `
**Order Details:** ${order.orderDetails}
**Total:** ৳${order.total}
**Customer:** ${order.customerName}
**Contact:** ${order.customerContact}
**Form:** ${order.prefillFormUrl}
**Timestamp:** ${order.timestamp}
`;

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body: issueBody }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    res.status(200).json({ message: "Order issue created!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
