import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect in production environment
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next()
  }

  // Check if password protection is enabled
  const PROTECT_WITH_PASSWORD = process.env.PROTECT_WITH_PASSWORD === 'true'

  if (!PROTECT_WITH_PASSWORD) {
    return NextResponse.next()
  }

  // Check for the password cookie
  const passwordCookie = request.cookies.get('decision-mirror-access')
  const correctPassword = process.env.ACCESS_PASSWORD || 'preview2025'

  // If password cookie is valid, allow access
  if (passwordCookie?.value === correctPassword) {
    return NextResponse.next()
  }

  // Check for password in query string (for direct access)
  const password = request.nextUrl.searchParams.get('password')
  if (password === correctPassword) {
    const response = NextResponse.next()
    // Set password cookie for future requests
    response.cookies.set('decision-mirror-access', correctPassword, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return response
  }

  // If accessing auth page, allow it
  if (request.nextUrl.pathname === '/auth') {
    return NextResponse.next()
  }

  // Redirect to auth page
  const authUrl = new URL('/auth', request.url)
  return NextResponse.redirect(authUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
