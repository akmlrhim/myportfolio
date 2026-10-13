// Generic admin CRUD endpoint.
// /api/admin/[resource]
//   GET    -> list rows
//   POST   -> create row (or upsert singleton / conflictOn)
//   PUT    -> update row by pk (body must include __pk)
//   DELETE -> delete row by pk (?pk=<value>)
//
// Auth: Authorization: Bearer <token from /api/admin/login>

import { query, json, error, handleOptions } from '../_lib/db.js'
import { verifyToken } from '../_lib/auth.js'
import { findResource } from '../_lib/resources.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return handleOptions(req, res)

  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!verifyToken(token)) return error(res, 401, 'Unauthorized')

  const resource = findResource(req.query.resource)
  if (!resource) return error(res, 404, 'Unknown resource')

  try {
    switch (req.method) {
      case 'GET':
        return await list(req, res, resource)
      case 'POST':
        return await create(req, res, resource)
      case 'PUT':
      case 'PATCH':
        return await update(req, res, resource)
      case 'DELETE':
        return await remove(req, res, resource)
      default:
        return error(res, 405, 'Method not allowed')
    }
  } catch (err) {
    console.error(`Admin ${req.method} ${req.query.resource} failed:`, err)
    return error(res, 500, err.message || 'Operation failed')
  }
}

async function list(_req, res, resource) {
  const result = await query(`SELECT * FROM ${resource.table} ORDER BY ${resource.order}`)
  return json(res, 200, { rows: result.rows })
}

function sanitize(resource, body) {
  const values = {}
  for (const field of resource.fields) {
    if (!(field in body)) continue
    let value = body[field]
    if (resource.booleans?.includes(field)) value = Boolean(value)
    if (resource.numbers?.includes(field)) {
      value = value === '' || value === null ? null : Number(value)
      if (Number.isNaN(value)) throw new Error(`${field} must be a number`)
    }
    if (resource.jsonb?.includes(field)) {
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value)
        } catch {
          throw new Error(`${field} must be valid JSON`)
        }
      }
      if (!Array.isArray(value)) throw new Error(`${field} must be an array`)
      // pg expects JSON string for jsonb columns.
      value = JSON.stringify(value)
    }
    if (resource.nullable?.includes(field) && (value === '' || value === null)) value = null
    values[field] = value
  }
  return values
}

async function create(req, res, resource) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
  const values = sanitize(resource, body)

  const keys = Object.keys(values)

  // Singleton rows: upsert the fixed row with every provided field.
  if (resource.singleton) {
    if (!keys.length) return error(res, 400, 'No fields provided')
    const cols = [resource.pk, ...keys].join(', ')
    const holders = keys.map((_, i) => `$${i + 1}`).join(', ')
    const sets = keys.map((k) => `${k} = EXCLUDED.${k}`).join(', ')
    await query(
      `INSERT INTO ${resource.table} (${cols}) VALUES (1, ${holders})
       ON CONFLICT (${resource.pk}) DO UPDATE SET ${sets}, updated_at = now()`,
      keys.map((k) => values[k]),
    )
    return json(res, 200, { ok: true })
  }

  // Conflict-based upsert (e.g. content-blocks by key+lang+position).
  if (resource.conflictOn) {
    const cols = keys.join(', ')
    const holders = keys.map((_, i) => `$${i + 1}`).join(', ')
    const assign = keys.map((k, i) => `${k} = $${i + 1}`).join(', ')
    await query(
      `INSERT INTO ${resource.table} (${cols}) VALUES (${holders})
       ON CONFLICT (${resource.conflictOn.join(', ')}) DO UPDATE SET ${assign}`,
      keys.map((k) => values[k]),
    )
    return json(res, 200, { ok: true })
  }

  // Require pk for standard insert.
  if (!resource.generatedPk && !values[resource.pk]) {
    return error(res, 400, `${resource.pk} is required`)
  }

  const cols = keys.join(', ')
  const holders = keys.map((_, i) => `$${i + 1}`).join(', ')
  await query(
    `INSERT INTO ${resource.table} (${cols}) VALUES (${holders}) RETURNING ${resource.pk}`,
    keys.map((k) => values[k]),
  )

  if (resource.child && Array.isArray(body[resource.child.field])) {
    await replaceChild(resource, values[resource.pk] || values.id, body[resource.child.field])
  }

  return json(res, 200, { ok: true })
}

async function update(req, res, resource) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
  const pkValue = body.__pk
  if (!pkValue) return error(res, 400, '__pk is required')

  const values = sanitize(resource, body)
  const keys = Object.keys(values).filter((k) => k !== resource.pk)
  if (!keys.length) return error(res, 400, 'No fields to update')

  const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(', ')
  const updatedAt = resource.table === 'profile' ? ', updated_at = now()' : ''
  const result = await query(
    `UPDATE ${resource.table} SET ${sets}${updatedAt} WHERE ${resource.pk} = $1 RETURNING *`,
    [pkValue, ...keys.map((k) => values[k])],
  )
  if (!result.rowCount) return error(res, 404, 'Row not found')

  if (resource.child && Array.isArray(body[resource.child.field])) {
    await replaceChild(resource, pkValue, body[resource.child.field])
  }

  return json(res, 200, { row: result.rows[0] })
}

async function remove(req, res, resource) {
  const pkValue = req.query.pk
  if (!pkValue) return error(res, 400, 'pk query param is required')
  if (resource.singleton) return error(res, 400, 'Cannot delete a singleton row')

  const result = await query(`DELETE FROM ${resource.table} WHERE ${resource.pk} = $1`, [pkValue])
  if (!result.rowCount) return error(res, 404, 'Row not found')
  return json(res, 200, { ok: true })
}

async function replaceChild(resource, pkValue, labels) {
  const child = resource.child
  await query(`DELETE FROM ${child.table} WHERE ${child.fk} = $1`, [pkValue])
  for (let i = 0; i < labels.length; i++) {
    const label = String(labels[i] || '').trim()
    if (!label) continue
    await query(
      `INSERT INTO ${child.table} (${child.fk}, position, ${child.column}) VALUES ($1, $2, $3)
       ON CONFLICT (${child.fk}, position) DO UPDATE SET ${child.column} = EXCLUDED.${child.column}`,
      [pkValue, i, label],
    )
  }
}
