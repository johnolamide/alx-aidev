import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required')
}

/**
 * Authentication Middleware for Next.js
 * Handles session management and route protection for Supabase authentication
 *
 * This middleware:
 * - Creates a Supabase server client with proper cookie handling
 * - Refreshes expired sessions automatically
 * - Protects routes that require authentication
 * - Manages authentication state across requests
 *
 * @param request - The incoming Next.js request object
 * @returns NextResponse with updated cookies and authentication state
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  /**
   * Create Supabase server client with cookie handling
   * This enables server-side authentication and session management
   */
  const supabase = createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        /**
         * Get all cookies from the request
         * Used by Supabase to read authentication cookies
         */
        getAll() {
          return request.cookies.getAll()
        },
        /**
         * Set multiple cookies in the response
         * Used by Supabase to update authentication cookies
         */
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  /**
   * Get the current authenticated user
   * This call refreshes the session if it's expired
   */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object instead of the supabaseResponse object
  //    before returning it.

  return supabaseResponse
}
