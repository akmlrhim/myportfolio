// Admin login.
// POST /api/admin/login   body: { password }  ->  { token }

import { json, error, handleOptions } from '../_lib/db.js'
import { verifyPassword, createToken } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return handleOptions(req, res)
  if (req.method !== 'POST') return error(res, 405, 'Method not allowed')

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
    if (!body.password) return error(res, 400, 'Password is required')

    if (!verifyPassword(body.password)) return error(res, 401, 'Invalid password')

    const token = createToken()
    return json(res, 200, { token })
  } catch (err) {
    console.error('Login error:', err)
    return error(res, 500, 'Login failed')
  }
}
