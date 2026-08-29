// Thin localStorage wrapper used by the mock/local data layer (patientService,
// screeningService, offlineSyncService). This is the "database" until Team 3
// wires up a real backend — swap the internals here without touching callers.

const NAMESPACE = 'drishtiai'

function key(name) {
  return `${NAMESPACE}:${name}`
}

export function readJSON(name, fallback) {
  try {
    const raw = window.localStorage.getItem(key(name))
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(name, value) {
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value))
  } catch {
    // localStorage can throw in private-browsing / quota-exceeded situations.
    // Fail silently — the in-memory value is still correct for this session.
  }
}

export function removeKey(name) {
  try {
    window.localStorage.removeItem(key(name))
  } catch {
    /* noop */
  }
}
