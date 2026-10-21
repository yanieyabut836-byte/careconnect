import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const { pathname } = request.nextUrl

  // Email-link handlers (e.g. /auth/confirm) manage their own session
  if (pathname.startsWith('/auth/')) return supabaseResponse

  // Routes that require no session
  const publicRoutes = ['/login', '/change-password', '/forgot-password', '/reset-password']
  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r))
  const isSetPasswordRoute = pathname.startsWith('/set-password')

  // If Supabase keys are not set, allow public routes and redirect protected routes to /login
  if (!supabaseUrl || !supabaseAnonKey) {
    if (!isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session — do NOT add logic between createServerClient and getUser()
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user ?? null
  } catch (err) {
    console.warn('[middleware] Unable to retrieve user session:', err)
  }

  // If no session and trying to access a protected route (or /set-password) → redirect to login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If authenticated user has not completed activation (is_activated !== true)
  // and is attempting to access protected internal routes (not /login, /change-password, or root /)
  // → redirect to /set-password
  if (user && !isSetPasswordRoute && !isPublicRoute && pathname !== '/') {
    const isActivated = user.user_metadata?.is_activated as boolean | undefined
    if (isActivated !== true) {
      const url = request.nextUrl.clone()
      url.pathname = '/set-password'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
