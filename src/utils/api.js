const PORTFOLIO_URL = '/api/portfolio'
const ADMIN_LOGIN_URL = '/api/admin/login'
const ADMIN_DATA_URL = (resource) => `/api/admin/${encodeURIComponent(resource)}`

export async function fetchPortfolio() {
  const res = await fetch(PORTFOLIO_URL)
  if (!res.ok) throw new Error(`Portfolio API: ${res.status}`)
  return res.json()
}

export function getAdminToken() {
  try {
    return sessionStorage.getItem('admin-token')
  } catch {
    return null
  }
}

export function setAdminToken(token) {
  try {
    sessionStorage.setItem('admin-token', token)
  } catch {
    // noop
  }
}

export function clearAdminToken() {
  try {
    sessionStorage.removeItem('admin-token')
  } catch {
    // noop
  }
}

export function isAdminAuthed() {
  return !!getAdminToken()
}

export async function adminLogin(password) {
  const res = await fetch(ADMIN_LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Login failed' }))
    throw new Error(body.error || 'Login failed')
  }
  const { token } = await res.json()
  setAdminToken(token)
  return token
}

function authHeaders() {
  const token = getAdminToken()
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

export async function adminFetch(resource, { method = 'GET', body, pk } = {}) {
  const url = new URL(ADMIN_DATA_URL(resource), window.location.origin)
  if (pk) url.searchParams.set('pk', pk)

  const options = { method, headers: authHeaders() }
  if (body) options.body = typeof body === 'string' ? body : JSON.stringify(body)

  const res = await fetch(url.toString(), options)
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: `Admin API: ${res.status}` }))
    if (res.status === 401) clearAdminToken()
    throw new Error(data.error || `Admin API: ${res.status}`)
  }
  return res.json()
}
