// Quick admin account setup / reset.
//
//   npm run admin:setup            create the default admin if missing
//   npm run admin:setup -- --reset force-reset the password (and role) to the
//                                  configured/CLI values
//   node scripts/create-admin.js --email you@example.com --password secret [--reset]
//
// Reads ADMIN_EMAIL / ADMIN_PASSWORD from .env when CLI flags are absent.

require('dotenv').config()
const bcrypt = require('bcryptjs')
const db = require('../db')

const BCRYPT_HASH_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function argValue(flag) {
  const idx = process.argv.indexOf(flag)
  return idx !== -1 && process.argv[idx + 1] ? String(process.argv[idx + 1]) : null
}

const email = (argValue('--email') || process.env.ADMIN_EMAIL || 'admin@echopride.com').trim().toLowerCase()
const password = argValue('--password') || process.env.ADMIN_PASSWORD || 'admin110'
const reset = process.argv.includes('--reset')

if (!EMAIL_RE.test(email)) {
  console.error(`[create-admin] Invalid email: ${email}`)
  process.exit(1)
}
if (String(password).length < 8) {
  console.error('[create-admin] Password must be at least 8 characters.')
  process.exit(1)
}

const existing = db.prepare('SELECT id, password_hash, role FROM users WHERE email = ?').get(email)

if (!existing) {
  const hash = bcrypt.hashSync(password, 10)
  db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(
    'Echo Pride Admin',
    email,
    hash,
    'admin',
  )
  console.log(`[create-admin] Created admin account: ${email}`)
} else if (reset || !BCRYPT_HASH_RE.test(String(existing.password_hash || ''))) {
  const hash = bcrypt.hashSync(password, 10)
  db.prepare('UPDATE users SET password_hash = ?, role = ? WHERE id = ?').run(hash, 'admin', existing.id)
  console.log(
    `[create-admin] ${reset ? 'Reset' : 'Repaired invalid hash for'} admin account: ${email}`,
  )
} else {
  console.log(`[create-admin] Admin already exists with a valid password: ${email}`)
  console.log('[create-admin] Use --reset to overwrite the password.')
}

// Round-trip verification: the stored hash must authenticate with the password.
const row = db.prepare('SELECT id, password_hash, role FROM users WHERE email = ?').get(email)
if (!row || !bcrypt.compareSync(password, row.password_hash) || row.role !== 'admin') {
  console.error('[create-admin] Verification FAILED — login would still not work.')
  db.close()
  process.exit(1)
}

console.log(`[create-admin] Verified OK → email: ${email} | role: ${row.role} | id: ${row.id}`)
db.close()
