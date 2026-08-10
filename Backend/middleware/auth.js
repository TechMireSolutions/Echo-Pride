require('dotenv').config()
const jwt = require('jsonwebtoken')
const db = require('../db')

const ACCESS_SECRET = process.env.JWT_SECRET || 'echopride-access-secret'

function verifyAccessToken(req) {
  const header = req.headers.authorization || ''
  const match = /^Bearer\s+(.+)$/i.exec(header)
  if (!match) return null
  try {
    return jwt.verify(match[1], ACCESS_SECRET)
  } catch {
    return null
  }
}

function requireAuth(req, res, next) {
  const payload = verifyAccessToken(req)
  if (!payload) {
    res.status(401).json({ success: false, message: 'Authentication required.' })
    return
  }
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(payload.sub)
  if (!user) {
    res.status(401).json({ success: false, message: 'Account no longer exists.' })
    return
  }
  req.user = user
  next()
}

function optionalAuth(req, res, next) {
  const payload = verifyAccessToken(req)
  if (payload) {
    const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(payload.sub)
    if (user) req.user = user
  }
  next()
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin access required.' })
    return
  }
  next()
}

const asyncWrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = { requireAuth, optionalAuth, requireAdmin, asyncWrap }
