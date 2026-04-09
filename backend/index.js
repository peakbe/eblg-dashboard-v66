// ======================================================
// BACKEND PROXY EBLG — VERSION PRO+
// Compatible GitHub Pages + Render
// CORS OK, routes OK, logs OK
// ======================================================

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------
// CORS PRO+
// ------------------------------------------------------
app.use(cors({
    origin: "*",               // GitHub Pages
    methods: "GET",            // read-only
    allowedHeaders: "*"
}));

// ------------------------------------------------------
// Logging PRO+
// ------------------------------------------------------
const log = (...a) => console.log("[PROXY]", ...a);
const logErr = (...a) => console.error("[PROXY ERROR]", ...a);

// ------------------------------------------------------
// Helper : fetch sécurisé
// ------------------------------------------------------
async function safeFetch(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("HTTP " + res.status);
        return await res.json();
    } catch (err) {
        logErr("Erreur fetch :", err);
        return { fallback: true };
    }
}

// ------------------------------------------------------
// ROUTES PROXY
// ------------------------------------------------------

// METAR
app.get("/metar", async (req, res) => {
    const data = await safeFetch("https://api.checkwx.com/metar/EBLG/decoded?x-api-key=YOUR_KEY");
    res.json(data);
});

// TAF
app.get("/taf", async (req, res) => {
    const data = await safeFetch("https://api.checkwx.com/taf/EBLG/decoded?x-api-key=YOUR_KEY");
    res.json(data);
});

// FIDS
app.get("/fids", async (req, res) => {
    const data = await safeFetch("https://opensky-network.org/api/flights/departure?airport=EBLG&begin=NOW-3600&end=NOW");
    res.json(data);
});

// SONOMETERS (si tu en as besoin)
app.get("/sonos", async (req, res) => {
    res.json({ ok: true });
});

// ------------------------------------------------------
// SERVER START
// ------------------------------------------------------
app.listen(PORT, () => {
    log("Proxy EBLG PRO+ lancé sur port", PORT);
});
