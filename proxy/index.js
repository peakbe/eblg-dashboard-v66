import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

/* ----------------------------------------------------------
   PROXY GÉNÉRIQUE (déjà existant)
---------------------------------------------------------- */
app.get("/proxy", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing url");

  try {
    const r = await fetch(url);
    const data = await r.text();
    res.send(data);
  } catch (e) {
    res.status(500).send("Proxy error");
  }
});

/* ----------------------------------------------------------
   METAR SÉCURISÉ
---------------------------------------------------------- */
app.get("/metar", async (req, res) => {
  try {
    const url = `https://avwx.rest/api/metar/EBLG?format=json&token=${process.env.AVWX_API_KEY}`;

    const r = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "EBLG-Dashboard/1.0"
      }
    });

    if (!r.ok) {
      console.error("AVWX error:", await r.text());
      return res.status(500).json({ error: "Erreur AVWX" });
    }

    const data = await r.json();
    res.json(data);

  } catch (err) {
    console.error("Erreur METAR :", err);
    res.status(500).json({ error: "Erreur serveur METAR" });
  }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});


