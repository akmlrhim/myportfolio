import pg from 'pg'

const { Pool } = pg

let pool = null

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL is not configured')
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 8000,
    })
  }
  return pool
}

export function query(text, params) {
  return getPool().query(text, params)
}

export function json(res, status, data) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  return res.status(status).json(data)
}

export function error(res, status, message) {
  return json(res, status, { error: message })
}

export async function handleOptions(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return res.status(204).end()
}
