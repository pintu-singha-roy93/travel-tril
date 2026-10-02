const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");
const { Pool } = require("pg");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const { OAuth2Client } = require("google-auth-library");

dotenv.config({ path: path.join(__dirname, ".env") });

const postgresPool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, max: 5 })
  : null;
const authStorageAvailable = !process.env.VERCEL || Boolean(postgresPool);
let sqliteDatabase = null;
let databaseReady = Promise.resolve();

if (postgresPool) {
  databaseReady = postgresPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      picture TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS auth_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at BIGINT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx ON auth_sessions(user_id);
  `).then(() => undefined);
} else {
  const databasePath = process.env.AUTH_DATABASE_PATH
    || (process.env.VERCEL
      ? path.join(os.tmpdir(), "travel-tril-auth.sqlite")
      : path.join(__dirname, "data", "auth.sqlite"));
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });

  sqliteDatabase = new Database(databasePath);
  sqliteDatabase.pragma("journal_mode = WAL");
  sqliteDatabase.pragma("foreign_keys = ON");
  sqliteDatabase.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      picture TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS auth_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx ON auth_sessions(user_id);
  `);

  const userColumns = new Set(sqliteDatabase.pragma("table_info(users)").map((column) => column.name));
  if (!userColumns.has("picture")) sqliteDatabase.exec("ALTER TABLE users ADD COLUMN picture TEXT");
}

function postgresParameters(sql) {
  let parameterIndex = 0;
  return sql.replace(/\?/g, () => `$${++parameterIndex}`);
}

const database = {
  async get(sql, parameters = []) {
    await databaseReady;
    if (postgresPool) {
      const result = await postgresPool.query(postgresParameters(sql), parameters);
      return result.rows[0];
    }
    return sqliteDatabase.prepare(sql).get(...parameters);
  },
  async run(sql, parameters = []) {
    await databaseReady;
    if (postgresPool) return postgresPool.query(postgresParameters(sql), parameters);
    return sqliteDatabase.prepare(sql).run(...parameters);
  },
  async insert(sql, parameters = []) {
    await databaseReady;
    if (postgresPool) {
      const result = await postgresPool.query(
        `${postgresParameters(sql)} RETURNING id`,
        parameters,
      );
      return Number(result.rows[0].id);
    }
    return Number(sqliteDatabase.prepare(sql).run(...parameters).lastInsertRowid);
  },
};

const cookieName = "traveltril_session";
const googleStateCookieName = "traveltril_google_state";
const sessionDurationMs = 7 * 24 * 60 * 60 * 1000;
const cookieSameSite = (process.env.AUTH_COOKIE_SAME_SITE || "lax").toLowerCase();
const cookieSecure = process.env.NODE_ENV === "production" || cookieSameSite === "none";
const allowedOrigins = new Set(
  (process.env.AUTH_ALLOWED_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const cookieOptions = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: cookieSameSite,
  path: "/",
};
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI
  || "http://localhost:5173/api/auth/google/callback";
const authFrontendUrl = process.env.AUTH_FRONTEND_URL || "http://localhost:5173/home";
const googleOAuthClient = googleClientId && googleClientSecret
  ? new OAuth2Client(googleClientId, googleClientSecret, googleRedirectUri)
  : null;

const authCors = cors({
  origin(origin, callback) {
    callback(null, origin && allowedOrigins.has(origin) ? origin : false);
  },
  credentials: true,
});
const authAttemptLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

function verifyAuthOrigin(req, res, next) {
  const origin = req.get("origin");
  if (origin && !allowedOrigins.has(origin)) {
    return res.status(403).json({ message: "This origin is not allowed." });
  }
  return next();
}

function requireAuthStorage(req, res, next) {
  if (!authStorageAvailable) {
    return res.status(503).json({ message: "Authentication storage is not configured on this deployment." });
  }
  return next();
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function readSessionToken(req) {
  return readCookie(req, cookieName);
}

function readCookie(req, name) {
  const cookieHeader = req.headers.cookie || "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!cookie) return "";
  try {
    return decodeURIComponent(cookie.slice(name.length + 1));
  } catch {
    return "";
  }
}

function stateMatches(expected, received) {
  if (typeof expected !== "string" || typeof received !== "string") return false;
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);
  return expectedBytes.length === receivedBytes.length
    && crypto.timingSafeEqual(expectedBytes, receivedBytes);
}

function googleErrorRedirect(code) {
  const destination = new URL(authFrontendUrl);
  destination.searchParams.set("authError", code);
  return destination.toString();
}

async function createSession(userId, res) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + sessionDurationMs;
  await database.run("DELETE FROM auth_sessions WHERE expires_at <= ?", [Date.now()]);
  await database.run(
    "INSERT INTO auth_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
    [hashToken(token), userId, expiresAt],
  );
  res.cookie(cookieName, token, { ...cookieOptions, maxAge: sessionDurationMs });
}

function clearSession(res) {
  res.clearCookie(cookieName, cookieOptions);
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture || null,
  };
}

async function getUserBySession(req) {
  const token = readSessionToken(req);
  if (!token) return null;

  const session = await database.get(
    `
      SELECT users.id, users.name, users.email, auth_sessions.expires_at
      FROM auth_sessions
      JOIN users ON users.id = auth_sessions.user_id
      WHERE auth_sessions.token_hash = ?
    `,
    [hashToken(token)],
  );

  if (!session) return null;
  if (session.expires_at <= Date.now()) {
    await database.run("DELETE FROM auth_sessions WHERE token_hash = ?", [hashToken(token)]);
    return null;
  }
  return session;
}

function registerAuthRoutes(app) {
  app.get("/api/auth/google/status", (req, res) => {
    return res.json({ enabled: Boolean(googleOAuthClient && authStorageAvailable) });
  });

  app.get("/api/auth/google", requireAuthStorage, (req, res) => {
    if (!googleOAuthClient) {
      return res.status(503).send("Google sign-in is not configured on this server.");
    }

    const state = crypto.randomBytes(32).toString("hex");
    res.cookie(googleStateCookieName, state, {
      ...cookieOptions,
      maxAge: 10 * 60 * 1000,
    });
    return res.redirect(googleOAuthClient.generateAuthUrl({
      access_type: "online",
      include_granted_scopes: true,
      scope: ["openid", "email", "profile"],
      nonce: state,
      state,
    }));
  });

  app.get("/api/auth/google/callback", requireAuthStorage, async (req, res) => {
    const stateCookie = readCookie(req, googleStateCookieName);
    res.clearCookie(googleStateCookieName, cookieOptions);

    if (!googleOAuthClient || req.query.error || !req.query.code
      || !stateMatches(stateCookie, req.query.state)) {
      return res.redirect(googleErrorRedirect("google_sign_in_failed"));
    }

    try {
      const { tokens } = await googleOAuthClient.getToken({
        code: req.query.code,
        redirect_uri: googleRedirectUri,
      });
      if (!tokens.id_token) throw new Error("Google did not return an ID token.");

      const ticket = await googleOAuthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: googleClientId,
      });
      const profile = ticket.getPayload();
      if (!profile?.email || profile.email_verified !== true || profile.nonce !== req.query.state) {
        throw new Error("Google did not provide a verified email address.");
      }

      const email = profile.email.trim().toLowerCase();
      const name = typeof profile.name === "string" && profile.name.trim()
        ? profile.name.trim().slice(0, 80)
        : email;
      const picture = typeof profile.picture === "string"
        && profile.picture.startsWith("https://")
        ? profile.picture
        : null;
      let user = await database.get(
        "SELECT id, name, email, picture FROM users WHERE email = ?",
        [email],
      );

      if (user) {
        await database.run("UPDATE users SET picture = ? WHERE id = ?", [picture, user.id]);
        user = { ...user, picture };
      } else {
        const unusablePasswordHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12);
        const id = await database.insert(
          "INSERT INTO users (name, email, password_hash, picture) VALUES (?, ?, ?, ?)",
          [name, email, unusablePasswordHash, picture],
        );
        user = { id, name, email, picture };
      }

      await createSession(user.id, res);
      return res.redirect(authFrontendUrl);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      return res.redirect(googleErrorRedirect("google_sign_in_failed"));
    }
  });

  app.post("/api/auth/register", authAttemptLimit, requireAuthStorage, async (req, res) => {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({ message: "Enter a name between 2 and 80 characters." });
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({ message: "Password must be 8 to 72 bytes long." });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const id = await database.insert(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, passwordHash],
      );
      const user = { id, name, email, picture: null };
      await createSession(user.id, res);
      return res.status(201).json({ user });
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE" || error.code === "23505") {
        return res.status(409).json({ message: "An account with this email already exists." });
      }
      console.error("Account registration failed:", error);
      return res.status(500).json({ message: "Could not create your account." });
    }
  });

  app.post("/api/auth/login", authAttemptLimit, requireAuthStorage, async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const user = await database.get(
      "SELECT id, name, email, password_hash, picture FROM users WHERE email = ?",
      [email],
    );

    const passwordMatches = user && password
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!passwordMatches) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    await createSession(user.id, res);
    return res.json({ user: publicUser(user) });
  });

  app.get("/api/auth/me", requireAuthStorage, async (req, res) => {
    const user = await getUserBySession(req);
    if (!user) return res.json({ user: null });
    return res.json({ user: publicUser(user) });
  });

  app.post("/api/auth/logout", requireAuthStorage, async (req, res) => {
    const token = readSessionToken(req);
    if (token) {
      await database.run("DELETE FROM auth_sessions WHERE token_hash = ?", [hashToken(token)]);
    }
    clearSession(res);
    return res.json({ message: "Signed out." });
  });
}

module.exports = { authCors, registerAuthRoutes, verifyAuthOrigin };