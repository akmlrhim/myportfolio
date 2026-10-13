// Smoke test the admin login + CRUD handlers against the real database.
// Usage: node --env-file=.env db/smoke.mjs

import loginHandler from '../api/admin/login.js'
import resourceHandler from '../api/admin/[resource].js'

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) {
      this.headers[k] = v
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(data) {
      this.body = data
      return this
    },
    end() {
      return this
    },
  }
}

function mockReq({ method = 'GET', body, query = {}, token } = {}) {
  return {
    method,
    body,
    query,
    headers: token ? { authorization: `Bearer ${token}` } : {},
  }
}

function check(label, condition, detail) {
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${label}${detail ? ` (${detail})` : ''}`)
  if (!condition) {
    process.exitCode = 1
    if (typeof detail === 'object') console.log(JSON.stringify(detail, null, 2))
  }
}

// 1. Reject wrong password.
let res = mockRes()
await loginHandler(mockReq({ method: 'POST', body: { password: 'wrong-password' } }), res)
check('login rejects wrong password', res.statusCode === 401, `status ${res.statusCode}`)

// 2. Reject missing password.
res = mockRes()
await loginHandler(mockReq({ method: 'POST', body: {} }), res)
check('login rejects missing password', res.statusCode === 400, `status ${res.statusCode}`)

// 3. Accept correct password.
res = mockRes()
await loginHandler(mockReq({ method: 'POST', body: { password: process.env.ADMIN_PASSWORD } }), res)
const token = res.body?.token
check('login accepts correct password', res.statusCode === 200 && !!token, `status ${res.statusCode}`)

// 4. Admin endpoint rejects missing token.
res = mockRes()
await resourceHandler(mockReq({ query: { resource: 'skills' } }), res)
check('admin list rejects missing token', res.statusCode === 401, `status ${res.statusCode}`)

// 5. Admin list works with token.
res = mockRes()
await resourceHandler(mockReq({ query: { resource: 'skills' }, token }), res)
check('admin lists skills', res.statusCode === 200 && res.body.rows.length === 24, `rows ${res.body?.rows?.length}`)

// 6. Create a temp skill, update it, then delete it.
const tempId = '__smoke_test_skill'
res = mockRes()
await resourceHandler(
  mockReq({
    method: 'POST',
    query: { resource: 'skills' },
    token,
    body: { id: tempId, name: 'Smoke Test', category: 'tools', main: false, icon: 'bun', color: '#000', sort_order: 99 },
  }),
  res,
)
check('admin creates skill', res.statusCode === 200, `status ${res.statusCode}`)

res = mockRes()
await resourceHandler(
  mockReq({ method: 'PUT', query: { resource: 'skills' }, token, body: { __pk: tempId, name: 'Smoke Test Updated' } }),
  res,
)
check('admin updates skill', res.statusCode === 200 && res.body.row?.name === 'Smoke Test Updated')

res = mockRes()
await resourceHandler(mockReq({ method: 'DELETE', query: { resource: 'skills', pk: tempId }, token }), res)
check('admin deletes skill', res.statusCode === 200, `status ${res.statusCode}`)

// 7. Singleton profile update.
res = mockRes()
await resourceHandler(
  mockReq({ method: 'POST', query: { resource: 'profile' }, token, body: { name: 'Akmal Rahim', location: 'Kalimantan Selatan, Indonesia', verified: false, open_to_work: true } }),
  res,
)
check('admin updates profile singleton', res.statusCode === 200, `status ${res.statusCode}`)

// 8. Project with child stack round-trip.
res = mockRes()
await resourceHandler(mockReq({ query: { resource: 'projects' }, token }), res)
const project = res.body.rows.find((r) => r.slug === 'ms-construction')
check('admin lists projects with rows', !!project, `${res.body.rows.length} projects`)

console.log('\nSmoke test complete.')
