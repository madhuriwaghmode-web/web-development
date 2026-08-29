// Small deterministic hash so the mock services return a stable result for
// the same image instead of a different random grade on every re-render.
export function hashString(input) {
  let hash = 0
  const str = String(input || 'default')
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
