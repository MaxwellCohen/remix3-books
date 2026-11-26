import { MAX_API_DELAY_MS } from './url-state.ts'
import { delay } from './utils.ts'

export async function waitForApiDelay(requestedMs = 0) {
  const envMs = Number(process.env.API_DELAY_MS ?? 0)
  const uiMs = Number.isFinite(requestedMs)
    ? Math.min(MAX_API_DELAY_MS, Math.max(0, requestedMs))
    : 0
  const ms = uiMs > 0 ? uiMs : envMs
  return delay(ms, ms > 0)
}
