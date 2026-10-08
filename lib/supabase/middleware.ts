import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Email-link handlers (e.g. /auth/confirm) manage their own session
  if (pathname.startsWith('/auth/')) return supabaseResponse

  // Routes that require no session
  const publicRoutes = ['/login', '/change-password', '/forgot-password', '/reset-password']
  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r))

  const isSetPasswordRoute = pathname.startsWith('/set-password')

  // If no session and trying to access a protected route (or /set-password) → redirect to login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If authenticated user has not completed activation (is_activated !== true) and not on /set-password → redirect to /set-password
  if (user && !isSetPasswordRoute && pathname !== '/change-password') {
    const isActivated = user.user_metadata?.is_activated as boolean | undefined
    if (isActivated !== true) {
      const url = request.nextUrl.clone()
      url.pathname = '/set-password'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
