// tests_backend/controllers/test_controller.js

export const testPing = (req, res) => {
  res.json({ ok: true, message: "pong" });
};

export const testEcho = (req, res) => {
  const { text } = req.body;
  res.json({ received: text || null });
};
