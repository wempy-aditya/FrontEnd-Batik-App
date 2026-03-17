import { NextResponse } from 'next/server'

export function middleware(request) {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')
  const { pathname } = request.nextUrl
  const isInternalPath = pathname.startsWith('/_next') || pathname.startsWith('/__nextjs')

  if (basePath && !isInternalPath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) {
    const rewrittenUrl = request.nextUrl.clone()
    const strippedPath = pathname.slice(basePath.length)
    rewrittenUrl.pathname = strippedPath || '/'
    return NextResponse.rewrite(rewrittenUrl)
  }

  const normalizedPathname = pathname

  // Check if the user is accessing the dashboard
  if (normalizedPathname.startsWith('/dashboard')) {
    // In a real app, you would verify the JWT token here
    // For now, we'll let the client-side handle the auth check
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*'
}