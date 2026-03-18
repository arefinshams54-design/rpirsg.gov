/**
 * server.js — Rajshahi Rover Scout Group · Express Backend
 * ─────────────────────────────────────────────────────────
 * Single-file, self-contained Express server.
 *
 * Stack  : Express · better-sqlite3 (SQLite) · bcryptjs · jsonwebtoken
 *          helmet · cors · express-rate-limit · multer (file upload)
 * Auth   : JWT access token (15 min) + refresh token (7 d)
 *          Refresh token hash stored in DB — single-use rotation
 * DB     : SQLite file at ./data/rover.db (auto-created + seeded)
 *
 * Install dependencies:
 *   npm init -y
 *   npm install express better-sqlite3 bcryptjs jsonwebtoken \
 *               helmet cors express-rate-limit multer dotenv
 *
 * Run:
 *   node server.js
 * Or with auto-reload:
 *   npx nodemon server.js
 *
 * Environment variables (.env):
 *   PORT=5000
 *   JWT_SECRET=replace_this_with_a_long_random_string
 *   JWT_REFRESH_SECRET=replace_this_with_another_secret
 *   CLIENT_ORIGIN=http://localhost:3000
 *
 * Project structure expected:
 *   /server.js          ← this file
 *   /public/
 *     index.html
 *     login.html
 *     dashboard.html
 *     admin.html
 *     css/style.css
 *     js/app.js
 *   /data/              ← auto-created
 *     rover.db
 *     uploads/
 */

"use strict";

require("dotenv").config();
const path       = require("path");
const fs         = require("fs");
const express    = require("express");
const Database   = require("better-sqlite3");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const helmet     = require("helmet");
const cors       = require("cors");
const rateLimit  = require("express-rate-limit");
const multer     = require("multer");

/* ═══════════════════════════════════════════════════════════
   CONFIG
   ══════════════════════════════════════════════════════════ */
const PORT               = process.env.PORT               || 5000;
const JWT_SECRET         = process.env.JWT_SECRET         || "rs_jwt_secret_dev_change_in_prod";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "rs_refresh_secret_dev_change_in_prod";
const CLIENT_ORIGIN      = process.env.CLIENT_ORIGIN      || "*";

const DATA_DIR   = path.join(__dirname, "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
[DATA_DIR, UPLOAD_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

/* ═══════════════════════════════════════════════════════════
   DATABASE
   ══════════════════════════════════════════════════════════ */
const db = new Database(path.join(DATA_DIR, "rover.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'member',
    unit          TEXT,
    phone         TEXT,
    blood_group   TEXT,
    badge_level   TEXT DEFAULT 'Bronze',
    status        TEXT DEFAULT 'active',
    bio           TEXT,
    council       TEXT DEFAULT 'Unit Council',
    created_at    TEXT DEFAULT (datetime('now')),
    updated_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     TEXT NOT NULL,
    token_hash  TEXT NOT NULL UNIQUE,
    expires_at  TEXT NOT NULL,
    created_at  TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS activities (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    date        TEXT NOT NULL,
    location    TEXT,
    status      TEXT DEFAULT 'planned',
    tags        TEXT DEFAULT '[]',
    emoji       TEXT DEFAULT '📌',
    created_by  TEXT,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS blood_requests (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    requester   TEXT NOT NULL,
    contact     TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    units       INTEGER DEFAULT 1,
    hospital    TEXT,
    urgency     TEXT DEFAULT 'medium',
    date_needed TEXT,
    status      TEXT DEFAULT 'open',
    created_by  TEXT,
    created_at  TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS documents (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    filename      TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mimetype      TEXT,
    size          INTEGER,
    uploaded_by   TEXT,
    created_at    TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_users_email     ON users(email);
  CREATE INDEX IF NOT EXISTS idx_refresh_user    ON refresh_tokens(user_id);
  CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
  CREATE INDEX IF NOT EXISTS idx_blood_status    ON blood_requests(status);
`);

/* ── Seed ── */
function seed() {
  if (db.prepare("SELECT id FROM users WHERE email = ?").get("admin@roverscout.org")) return;
  console.log("🌱  Seeding database…");

  const ROUNDS = 12;
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, name, email, password_hash, role, unit, phone, blood_group, badge_level, status, bio, council)
    VALUES (@id,@name,@email,@password_hash,@role,@unit,@phone,@blood_group,@badge_level,@status,@bio,@council)
  `);
  const users = [
    { id:"usr_admin_001", name:"Scout Admin",   email:"admin@roverscout.org",             password:"Admin@2026", role:"admin",          unit:"Alpha Crew",  phone:"+8801711000000", blood_group:"O+",  badge_level:"Platinum", status:"active", bio:"System administrator.",                                         council:"Executive Council" },
    { id:"usr_mem_001",   name:"Arif Hossain",  email:"arif.hossain@roverscout.org",      password:"Rover@2026", role:"member",         unit:"Alpha Crew",  phone:"+8801711000001", blood_group:"A+",  badge_level:"Silver",   status:"active", bio:"Passionate about outdoor activities and community service.",     council:"Unit Council" },
    { id:"usr_mem_002",   name:"Nusrat Jahan",  email:"nusrat.jahan@roverscout.org",      password:"Rover@2026", role:"member",         unit:"Beta Crew",   phone:"+8801711000002", blood_group:"B+",  badge_level:"Gold",     status:"active", bio:"Dedicated scout with a love for environmental campaigns.",       council:"Unit Council" },
    { id:"usr_mem_003",   name:"Tanvir Ahmed",  email:"tanvir.ahmed@roverscout.org",      password:"Rover@2026", role:"crew_leader",    unit:"Alpha Crew",  phone:"+8801711000003", blood_group:"O+",  badge_level:"Platinum", status:"active", bio:"Experienced crew leader focused on youth development.",         council:"Crew Council" },
    { id:"usr_mem_004",   name:"Fatema Begum",  email:"fatema.begum@roverscout.org",      password:"Rover@2026", role:"member",         unit:"Gamma Crew",  phone:"+8801711000004", blood_group:"AB-", badge_level:"Bronze",   status:"active", bio:"Enthusiastic about first aid training and disaster relief.",    council:"Unit Council" },
    { id:"usr_mem_005",   name:"Rakibul Islam", email:"rakibul.islam@roverscout.org",     password:"Rover@2026", role:"vice_president", unit:"Beta Crew",   phone:"+8801711000005", blood_group:"B-",  badge_level:"Platinum", status:"active", bio:"Senior rover with 6+ years of scouting.",                       council:"Executive Council" },
  ];
  db.transaction(rows => {
    for (const u of rows) insertUser.run({ ...u, password_hash: bcrypt.hashSync(u.password, ROUNDS) });
  })(users);

  const insertAct = db.prepare(`
    INSERT OR IGNORE INTO activities (id,title,description,date,location,status,tags,emoji,created_by)
    VALUES (@id,@title,@description,@date,@location,@status,@tags,@emoji,@created_by)
  `);
  db.transaction(acts => acts.forEach(a => insertAct.run(a)))([
    { id:"act_001", title:"Annual Tree Plantation Drive",      description:"Community-wide tree plantation campaign.", date:"2026-04-10", location:"Rajshahi University Campus",         status:"planned", tags:'["environment","community"]', emoji:"🌱", created_by:"usr_admin_001" },
    { id:"act_002", title:"First Aid & CPR Training Workshop", description:"Hands-on CPR certification workshop.",     date:"2026-03-22", location:"Rover Scout HQ, Rajshahi",           status:"done",    tags:'["health","training"]',      emoji:"🏥", created_by:"usr_admin_001" },
    { id:"act_003", title:"Blood Donation Camp",               description:"Voluntary blood donation camp.",          date:"2026-05-15", location:"Rajshahi Medical College Hospital",  status:"planned", tags:'["blood","health"]',         emoji:"🩸", created_by:"usr_admin_001" },
    { id:"act_004", title:"Annual Rover Camping Expedition",   description:"Three-day wilderness expedition.",        date:"2026-06-05", location:"Puthia, Rajshahi",                   status:"pending", tags:'["camping","outdoor"]',      emoji:"⛺", created_by:"usr_admin_001" },
    { id:"act_005", title:"Digital Literacy Workshop",         description:"Free digital literacy workshop.",         date:"2026-04-28", location:"Rajshahi City Corporation Hall",     status:"planned", tags:'["education","technology"]', emoji:"💻", created_by:"usr_admin_001" },
  ]);

  db.prepare(`
    INSERT OR IGNORE INTO blood_requests (requester,contact,blood_group,units,hospital,urgency,date_needed,status,created_by)
    VALUES (?,?,?,?,?,?,?,?,?)
  `).run("Karim Uddin","+8801800000001","A+",2,"Rajshahi Medical College Hospital","high","2026-03-20","open","usr_admin_001");

  console.log("✅  Seed complete.");
}
seed();

/* ═══════════════════════════════════════════════════════════
   JWT HELPERS
   ══════════════════════════════════════════════════════════ */
const signAccess  = p => jwt.sign(p, JWT_SECRET,         { expiresIn: "15m" });
const signRefresh = p => jwt.sign(p, JWT_REFRESH_SECRET, { expiresIn: "7d"  });

function sanitizeUser(u) {
  if (!u) return null;
  const { password_hash: _, ...safe } = u;
  return safe;
}
function storeRefresh(userId, token) {
  const hash = bcrypt.hashSync(token, 8);
  const exp  = new Date(Date.now() + 7*24*60*60*1000).toISOString();
  db.prepare("INSERT INTO refresh_tokens (user_id,token_hash,expires_at) VALUES (?,?,?)").run(userId, hash, exp);
}
function validateRefresh(userId, token) {
  const rows = db.prepare("SELECT id,token_hash,expires_at FROM refresh_tokens WHERE user_id=?").all(userId);
  for (const r of rows) {
    if (new Date(r.expires_at) < new Date()) { db.prepare("DELETE FROM refresh_tokens WHERE id=?").run(r.id); continue; }
    if (bcrypt.compareSync(token, r.token_hash)) return r.id;
  }
  return null;
}
function revokeRefresh(userId, token) {
  const rows = db.prepare("SELECT id,token_hash FROM refresh_tokens WHERE user_id=?").all(userId);
  for (const r of rows) {
    if (bcrypt.compareSync(token, r.token_hash)) { db.prepare("DELETE FROM refresh_tokens WHERE id=?").run(r.id); return; }
  }
}

/* ═══════════════════════════════════════════════════════════
   MIDDLEWARE
   ══════════════════════════════════════════════════════════ */
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try { req.user = jwt.verify(auth.slice(7), JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: "Token expired or invalid" }); }
}
function isAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Admin access required" });
  next();
}

/* ═══════════════════════════════════════════════════════════
   MULTER
   ══════════════════════════════════════════════════════════ */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req,  file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g,"_")}`),
});
const ALLOWED_TYPES = [
  "application/pdf","application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg","image/png","text/plain",
];
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    ALLOWED_TYPES.includes(file.mimetype) ? cb(null, true) : cb(new Error("File type not allowed")),
});

/* ═══════════════════════════════════════════════════════════
   EXPRESS APP
   ══════════════════════════════════════════════════════════ */
const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'","'unsafe-inline'","https://fonts.googleapis.com"],
      styleSrc:    ["'self'","'unsafe-inline'","https://fonts.googleapis.com","https://fonts.gstatic.com"],
      fontSrc:     ["'self'","https://fonts.gstatic.com"],
      imgSrc:      ["'self'","data:","blob:"],
      connectSrc:  ["'self'"],
    },
  },
}));

app.use(cors({
  origin:         CLIENT_ORIGIN === "*" ? "*" : CLIENT_ORIGIN.split(","),
  methods:        ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials:    CLIENT_ORIGIN !== "*",
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false, limit: "2mb" }));

/* Rate limiters */
app.use(rateLimit({ windowMs:15*60*1000, max:300, standardHeaders:true, legacyHeaders:false, message:{ error:"Too many requests." } }));
const authLimiter = rateLimit({ windowMs:15*60*1000, max:20, standardHeaders:true, legacyHeaders:false, message:{ error:"Too many auth attempts." } });

/* Static */
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(UPLOAD_DIR));

/* Health */
app.get("/api/health", (_req, res) =>
  res.json({ status:"ok", timestamp:new Date().toISOString(), service:"Rover Scout API v1" })
);

/* ═══════════════════════════════════════════════════════════
   AUTH  /api/auth
   ══════════════════════════════════════════════════════════ */

/* Register */
app.post("/api/auth/register", authLimiter, async (req, res) => {
  try {
    const { name, email, password, unit, phone, blood_group } = req.body;
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ error:"Name, email and password are required." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error:"Invalid email format." });
    if (password.length < 8)
      return res.status(400).json({ error:"Password must be at least 8 characters." });
    if (db.prepare("SELECT id FROM users WHERE email=?").get(email.toLowerCase()))
      return res.status(409).json({ error:"Email already registered." });

    const id   = `usr_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
    const hash = await bcrypt.hash(password, 12);
    db.prepare("INSERT INTO users (id,name,email,password_hash,role,unit,phone,blood_group) VALUES (?,?,?,?,'member',?,?,?)")
      .run(id, name.trim(), email.toLowerCase(), hash, unit||null, phone||null, blood_group||null);

    const user    = sanitizeUser(db.prepare("SELECT * FROM users WHERE id=?").get(id));
    const access  = signAccess({ id:user.id, email:user.email, role:user.role, name:user.name });
    const refresh = signRefresh({ id:user.id });
    storeRefresh(user.id, refresh);
    return res.status(201).json({ accessToken:access, refreshToken:refresh, user });
  } catch(err) { console.error(err); return res.status(500).json({ error:"Server error." }); }
});

/* Login */
app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error:"Email and password required." });

    const row  = db.prepare("SELECT * FROM users WHERE email=?").get(email.toLowerCase());
    const dummy = "$2a$12$invalidhashfortimingnnnnnnnnnnnnnnnnnnnnn";
    const valid = row ? await bcrypt.compare(password, row.password_hash)
                      : await bcrypt.compare(password, dummy).then(()=>false);

    if (!row || !valid) return res.status(401).json({ error:"Invalid email or password." });
    if (row.status !== "active") return res.status(403).json({ error:"Account inactive. Contact admin." });

    const user    = sanitizeUser(row);
    const access  = signAccess({ id:user.id, email:user.email, role:user.role, name:user.name });
    const refresh = signRefresh({ id:user.id });
    storeRefresh(user.id, refresh);
    return res.json({ accessToken:access, refreshToken:refresh, user });
  } catch(err) { console.error(err); return res.status(500).json({ error:"Server error." }); }
});

/* Refresh */
app.post("/api/auth/refresh", (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error:"Refresh token required." });
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const rowId   = validateRefresh(payload.id, refreshToken);
    if (!rowId) return res.status(401).json({ error:"Refresh token invalid or expired." });

    db.prepare("DELETE FROM refresh_tokens WHERE id=?").run(rowId);
    const user = db.prepare("SELECT * FROM users WHERE id=?").get(payload.id);
    if (!user) return res.status(401).json({ error:"User not found." });

    const newAccess  = signAccess({ id:user.id, email:user.email, role:user.role, name:user.name });
    const newRefresh = signRefresh({ id:user.id });
    storeRefresh(user.id, newRefresh);
    return res.json({ accessToken:newAccess, refreshToken:newRefresh });
  } catch { return res.status(401).json({ error:"Invalid refresh token." }); }
});

/* Logout */
app.post("/api/auth/logout", verifyToken, (req, res) => {
  try { if (req.body.refreshToken) revokeRefresh(req.user.id, req.body.refreshToken); }
  catch {}
  return res.json({ message:"Logged out." });
});

/* Me */
app.get("/api/auth/me", verifyToken, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id=?").get(req.user.id);
  return user ? res.json({ user:sanitizeUser(user) }) : res.status(404).json({ error:"Not found." });
});

/* Change password */
app.post("/api/auth/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error:"Both passwords required." });
    if (newPassword.length < 8) return res.status(400).json({ error:"Min 8 characters." });
    const user = db.prepare("SELECT * FROM users WHERE id=?").get(req.user.id);
    if (!await bcrypt.compare(currentPassword, user.password_hash))
      return res.status(401).json({ error:"Current password incorrect." });
    db.prepare("UPDATE users SET password_hash=?,updated_at=datetime('now') WHERE id=?")
      .run(await bcrypt.hash(newPassword, 12), user.id);
    db.prepare("DELETE FROM refresh_tokens WHERE user_id=?").run(user.id);
    return res.json({ message:"Password updated." });
  } catch(err) { console.error(err); return res.status(500).json({ error:"Server error." }); }
});

/* ═══════════════════════════════════════════════════════════
   MEMBERS  /api/members  /api/users/:id  /api/admin/members
   ══════════════════════════════════════════════════════════ */

/* Public member list (limited fields) */
app.get("/api/members", (_req, res) => {
  const members = db.prepare("SELECT id,name,role,unit,blood_group,badge_level,status,bio,council FROM users WHERE status='active' ORDER BY name ASC").all();
  return res.json({ members });
});

/* Admin full member list */
app.get("/api/admin/members", verifyToken, isAdmin, (_req, res) => {
  return res.json({ members: db.prepare("SELECT * FROM users ORDER BY created_at DESC").all().map(sanitizeUser) });
});

/* Admin create member */
app.post("/api/admin/members", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password="Rover@2026", role="member", unit, phone, blood_group, bio } = req.body;
    if (!name?.trim() || !email?.trim()) return res.status(400).json({ error:"Name and email required." });
    if (db.prepare("SELECT id FROM users WHERE email=?").get(email.toLowerCase()))
      return res.status(409).json({ error:"Email already registered." });
    const id = `usr_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
    db.prepare("INSERT INTO users (id,name,email,password_hash,role,unit,phone,blood_group,bio) VALUES (?,?,?,?,?,?,?,?,?)")
      .run(id, name.trim(), email.toLowerCase(), await bcrypt.hash(password, 12), role, unit||null, phone||null, blood_group||null, bio||null);
    return res.status(201).json({ user:sanitizeUser(db.prepare("SELECT * FROM users WHERE id=?").get(id)) });
  } catch(err) { console.error(err); return res.status(500).json({ error:"Server error." }); }
});

/* Get single user */
app.get("/api/users/:id", verifyToken, (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== "admin")
    return res.status(403).json({ error:"Forbidden." });
  const user = db.prepare("SELECT * FROM users WHERE id=?").get(req.params.id);
  return user ? res.json({ user:sanitizeUser(user) }) : res.status(404).json({ error:"Not found." });
});

/* Update user */
app.put("/api/users/:id", verifyToken, (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== "admin")
    return res.status(403).json({ error:"Forbidden." });
  const cur = db.prepare("SELECT * FROM users WHERE id=?").get(req.params.id);
  if (!cur) return res.status(404).json({ error:"Not found." });
  const { name, unit, phone, blood_group, bio, status, role, badge_level } = req.body;
  const newRole   = req.user.role==="admin" ? (role   ||cur.role)   : cur.role;
  const newStatus = req.user.role==="admin" ? (status ||cur.status) : cur.status;
  db.prepare(`UPDATE users SET name=?,unit=?,phone=?,blood_group=?,bio=?,status=?,role=?,badge_level=?,updated_at=datetime('now') WHERE id=?`)
    .run(name||cur.name, unit??cur.unit, phone??cur.phone, blood_group??cur.blood_group,
         bio??cur.bio, newStatus, newRole, badge_level??cur.badge_level, req.params.id);
  return res.json({ user:sanitizeUser(db.prepare("SELECT * FROM users WHERE id=?").get(req.params.id)) });
});

/* Delete member (admin) */
app.delete("/api/users/:id", verifyToken, isAdmin, (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error:"Cannot delete yourself." });
  const user = db.prepare("SELECT id FROM users WHERE id=?").get(req.params.id);
  if (!user) return res.status(404).json({ error:"Not found." });
  db.prepare("DELETE FROM users WHERE id=?").run(req.params.id);
  return res.json({ message:"User deleted." });
});

/* ═══════════════════════════════════════════════════════════
   ACTIVITIES  /api/activities
   ══════════════════════════════════════════════════════════ */
const parseActivity = a => ({ ...a, tags: JSON.parse(a.tags||"[]") });

app.get("/api/activities", (_req, res) =>
  res.json({ activities: db.prepare("SELECT * FROM activities ORDER BY date ASC").all().map(parseActivity) })
);

app.post("/api/activities", verifyToken, isAdmin, (req, res) => {
  const { title, description, date, location, status="planned", tags=[], emoji="📌" } = req.body;
  if (!title?.trim() || !date) return res.status(400).json({ error:"Title and date required." });
  const id = `act_${Date.now()}_${Math.random().toString(36).slice(2,5)}`;
  db.prepare("INSERT INTO activities (id,title,description,date,location,status,tags,emoji,created_by) VALUES (?,?,?,?,?,?,?,?,?)")
    .run(id, title.trim(), description||null, date, location||null, status, JSON.stringify(tags), emoji, req.user.id);
  return res.status(201).json({ activity:parseActivity(db.prepare("SELECT * FROM activities WHERE id=?").get(id)) });
});

app.put("/api/activities/:id", verifyToken, isAdmin, (req, res) => {
  const cur = db.prepare("SELECT * FROM activities WHERE id=?").get(req.params.id);
  if (!cur) return res.status(404).json({ error:"Not found." });
  const { title, description, date, location, status, tags, emoji } = req.body;
  db.prepare("UPDATE activities SET title=?,description=?,date=?,location=?,status=?,tags=?,emoji=?,updated_at=datetime('now') WHERE id=?")
    .run(title||cur.title, description??cur.description, date||cur.date, location??cur.location,
         status||cur.status, JSON.stringify(tags??JSON.parse(cur.tags||"[]")), emoji||cur.emoji, req.params.id);
  return res.json({ activity:parseActivity(db.prepare("SELECT * FROM activities WHERE id=?").get(req.params.id)) });
});

app.delete("/api/activities/:id", verifyToken, isAdmin, (req, res) => {
  if (!db.prepare("SELECT id FROM activities WHERE id=?").get(req.params.id))
    return res.status(404).json({ error:"Not found." });
  db.prepare("DELETE FROM activities WHERE id=?").run(req.params.id);
  return res.json({ message:"Activity deleted." });
});

/* ═══════════════════════════════════════════════════════════
   BLOOD DONATIONS  /api/donations
   ══════════════════════════════════════════════════════════ */
app.get("/api/donations",      (_req, res) => res.json({ requests:db.prepare("SELECT * FROM blood_requests ORDER BY created_at DESC").all() }));
app.get("/api/donations/open", (_req, res) => res.json({ requests:db.prepare("SELECT * FROM blood_requests WHERE status='open' ORDER BY created_at DESC").all() }));

app.post("/api/donations/request", verifyToken, (req, res) => {
  const { requester, contact, blood_group, units=1, hospital, urgency="medium", date_needed } = req.body;
  if (!requester?.trim() || !contact?.trim() || !blood_group)
    return res.status(400).json({ error:"Requester, contact and blood group required." });
  const result = db.prepare("INSERT INTO blood_requests (requester,contact,blood_group,units,hospital,urgency,date_needed,created_by) VALUES (?,?,?,?,?,?,?,?)")
    .run(requester.trim(), contact.trim(), blood_group, units, hospital||null, urgency, date_needed||null, req.user.id);
  return res.status(201).json({ request:db.prepare("SELECT * FROM blood_requests WHERE id=?").get(result.lastInsertRowid) });
});

app.patch("/api/donations/:id/status", verifyToken, isAdmin, (req, res) => {
  const { status } = req.body;
  if (!["open","fulfilled","cancelled"].includes(status)) return res.status(400).json({ error:"Invalid status." });
  if (!db.prepare("SELECT id FROM blood_requests WHERE id=?").get(req.params.id))
    return res.status(404).json({ error:"Not found." });
  db.prepare("UPDATE blood_requests SET status=? WHERE id=?").run(status, req.params.id);
  return res.json({ request:db.prepare("SELECT * FROM blood_requests WHERE id=?").get(req.params.id) });
});

/* ═══════════════════════════════════════════════════════════
   DOCUMENTS  /api/documents
   ══════════════════════════════════════════════════════════ */
app.get("/api/documents", verifyToken, (_req, res) =>
  res.json({ documents:db.prepare("SELECT * FROM documents ORDER BY created_at DESC").all() })
);

app.post("/api/documents", verifyToken, isAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error:"File required." });
  const result = db.prepare("INSERT INTO documents (title,filename,original_name,mimetype,size,uploaded_by) VALUES (?,?,?,?,?,?)")
    .run((req.body.title||req.file.originalname).trim(), req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, req.user.id);
  return res.status(201).json({ document:db.prepare("SELECT * FROM documents WHERE id=?").get(result.lastInsertRowid) });
});

app.delete("/api/documents/:id", verifyToken, isAdmin, (req, res) => {
  const doc = db.prepare("SELECT * FROM documents WHERE id=?").get(req.params.id);
  if (!doc) return res.status(404).json({ error:"Not found." });
  const fp = path.join(UPLOAD_DIR, doc.filename);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  db.prepare("DELETE FROM documents WHERE id=?").run(req.params.id);
  return res.json({ message:"Document deleted." });
});

/* ═══════════════════════════════════════════════════════════
   SPA FALLBACK
   ══════════════════════════════════════════════════════════ */
app.get(/^(?!\/api).*/, (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

/* ═══════════════════════════════════════════════════════════
   GLOBAL ERROR HANDLER
   ══════════════════════════════════════════════════════════ */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.code === "LIMIT_FILE_SIZE")          return res.status(413).json({ error:"File too large (max 10 MB)." });
  if (err.message === "File type not allowed") return res.status(415).json({ error:err.message });
  console.error("Unhandled:", err);
  return res.status(500).json({ error:"Internal server error." });
});

/* ═══════════════════════════════════════════════════════════
   LISTEN
   ══════════════════════════════════════════════════════════ */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║       Rajshahi Rover Scout — API Server           ║
╠═══════════════════════════════════════════════════╣
║  🚀  http://localhost:${PORT}                         ║
║  📁  Static  → /public                           ║
║  🗄️   DB      → ./data/rover.db                  ║
║  📤  Uploads → ./data/uploads                    ║
╠═══════════════════════════════════════════════════╣
║  Admin  admin@roverscout.org  / Admin@2026        ║
║  Member arif.hossain@…        / Rover@2026        ║
╚═══════════════════════════════════════════════════╝`);
  });
}

module.exports = app;
