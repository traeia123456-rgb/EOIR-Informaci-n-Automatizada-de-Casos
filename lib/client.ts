import { createBrowserClient } from "@supabase/ssr"

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

/**
 * Safely create the Supabase browser client.
 * If the NEXT_PUBLIC_SUPABASE_* env vars are not present, return null
 * instead of throwing so callers can handle the missing client on the UI.
 */
export function createClient() {
  if (supabaseInstance) return supabaseInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Avoid throwing on the client — return null and let the UI handle it.
    return null
  }

  // Debugging helper: log presence of the public URL (do NOT log the anon key).
  // This is safe for local debugging because it does not expose secrets.
  try {
    // eslint-disable-next-line no-console
    console.info("Supabase config: NEXT_PUBLIC_SUPABASE_URL is present")
  } catch (e) {
    // ignore
  }

  supabaseInstance = createBrowserClient(url, key, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 2,
      },
    },
  })

  return supabaseInstance
}
