// Simple password + HMAC token auth.
// ADMIN_PASSWORD env var is the login secret.
// ADMIN_SECRET (or ADMIN_PASSWORD) signs tokens.

import { createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || ''
}

export function verifyPassword(password) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !password) return false
  if (password.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected))
  } catch {
    return false
  }
}

export function createToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS, sub: 'admin' }),
  ).toString('base64url')
  const sig = createHmac('sha256', secret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyToken(token) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const payload = parts[0]
  const sig = parts[1]
  const expectedSig = createHmac('sha256', secret()).update(payload).digest('base64url')
  if (sig.length !== expectedSig.length) return false
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return false
  } catch {
    return false
  }
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return data.exp > Date.now()
  } catch {
    return false
  }
}
