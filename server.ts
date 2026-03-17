import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Google OAuth Configuration
const getRedirectUri = () => {
  const baseUrl = process.env.APP_URL || "https://ais-dev-dmkapbsivdy7atgmlzabfm-201204816679.europe-west1.run.app";
  return `${baseUrl.replace(/\/$/, "")}/auth/google/callback`;
};

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  getRedirectUri()
);

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
];

async function startServer() {
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // --- Google OAuth Routes ---
  app.get("/api/auth/google/url", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "select_account"
    });
    res.json({ url });
  });

  app.get("/auth/google/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      // In a real app, store this in a database. For this demo, we use a secure cookie.
      res.cookie("google_tokens", JSON.stringify(tokens), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Autenticazione completata! Questa finestra si chiuderà automaticamente.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      res.status(500).send("Errore durante l'autenticazione.");
    }
  });

  app.get("/api/auth/google/status", (req, res) => {
    const tokens = req.cookies.google_tokens;
    res.json({ connected: !!tokens });
  });

  app.post("/api/auth/google/logout", (req, res) => {
    res.clearCookie("google_tokens");
    res.json({ success: true });
  });

  app.post("/api/gmail/fetch", async (req, res) => {
    const { url } = req.body;
    const tokensStr = req.cookies.google_tokens;

    if (!tokensStr) {
      return res.status(401).json({ error: "Non connesso a Google" });
    }

    try {
      const tokens = JSON.parse(tokensStr);
      oauth2Client.setCredentials(tokens);
      const gmail = google.gmail({ version: "v1", auth: oauth2Client });

      // Extract message ID from Gmail URL
      // Example: https://mail.google.com/mail/u/0/#inbox/FMfcgzGmvLpXq...
      const match = url.match(/#\w+\/([a-zA-Z0-9]+)/);
      const messageId = match ? match[1] : null;

      if (!messageId) {
        return res.status(400).json({ error: "URL Gmail non valido o ID messaggio non trovato" });
      }

      const response = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full"
      });

      const payload = response.data.payload;
      let body = "";

      if (payload?.parts) {
        const textPart = payload.parts.find(p => p.mimeType === "text/plain");
        if (textPart && textPart.body?.data) {
          body = Buffer.from(textPart.body.data, "base64").toString();
        }
      } else if (payload?.body?.data) {
        body = Buffer.from(payload.body.data, "base64").toString();
      }

      const headers = response.data.payload?.headers || [];
      const subject = headers.find(h => h.name === "Subject")?.value || "Senza Oggetto";
      const from = headers.find(h => h.name === "From")?.value || "Sconosciuto";

      res.json({
        content: `DA: ${from}\nOGGETTO: ${subject}\n\n${body}`,
        metadata: { from, subject }
      });
    } catch (error) {
      console.error("Error fetching Gmail message:", error);
      res.status(500).json({ error: "Impossibile recuperare l'e-mail. Verifica i permessi." });
    }
  });

  // Serve static files in production or use Vite in development
  if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

// Export for Vercel
export default app;

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
