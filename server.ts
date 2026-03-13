import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database
const db = new Database("phishguard.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS archive (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    reliabilityScore INTEGER,
    threatLevel TEXT,
    summary TEXT,
    sender TEXT,
    redFlags TEXT,
    recommendations TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Archive API
  app.post("/api/archive", (req, res) => {
    const { reliabilityScore, threatLevel, summary, sender, redFlags, recommendations } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO archive (reliabilityScore, threatLevel, summary, sender, redFlags, recommendations)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(
        reliabilityScore,
        threatLevel,
        summary,
        sender,
        JSON.stringify(redFlags),
        JSON.stringify(recommendations)
      );
      res.json({ id: info.lastInsertRowid });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to save to archive" });
    }
  });

  app.get("/api/archive", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM archive ORDER BY timestamp DESC").all();
      const results = rows.map((row: any) => ({
        ...row,
        redFlags: JSON.parse(row.redFlags),
        recommendations: JSON.parse(row.recommendations)
      }));
      res.json(results);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to fetch archive" });
    }
  });

  app.delete("/api/archive/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM archive WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete from archive" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
