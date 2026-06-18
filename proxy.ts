import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DASHBOARD_HOST = 'app.webjoz.com'
const BASE_DOMAIN = 'webjoz.com'

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // Pass dashboard or local development requests through normally, unless they are local subdomains
  const isVercelApp = host === 'webjoz.vercel.app' || host.endsWith('.vercel.app')
  if (host === DASHBOARD_HOST || isVercelApp || host === 'localhost:3000' || host === '127.0.0.1:3000') {
    return NextResponse.next()
  }

  // Support local subdomain testing: redirect to path-based route /s/[subdomain]
  // e.g. cafe-jogja.localhost:3000 -> localhost:3000/s/cafe-jogja
  const localSubdomainMatch = host.match(/^([a-zA-Z0-9-]+)\.localhost(:\d+)?$/)
  if (localSubdomainMatch) {
    const subdomain = localSubdomainMatch[1]
    const port = localSubdomainMatch[2] || ''
    if (subdomain !== 'app' && subdomain !== 'www') {
      const pathUrl = new URL(request.url)
      pathUrl.hostname = 'localhost'
      pathUrl.port = port.replace(':', '') || '3000'
      pathUrl.pathname = `/s/${subdomain}${request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname}`
      return NextResponse.redirect(pathUrl)
    }
  }

  // Production Subdomain check (e.g. cafe-jogja.webjoz.com)
  if (host.endsWith(`.${BASE_DOMAIN}`)) {
    const subdomain = host.replace(`.${BASE_DOMAIN}`, '')
    return NextResponse.rewrite(
      new URL(`/site/${subdomain}${request.nextUrl.pathname}`, request.url)
    )
  }

  // Custom domain routing: rewrite to internal /site-by-domain/[host] path
  return NextResponse.rewrite(
    new URL(`/site-by-domain/${host}${request.nextUrl.pathname}`, request.url)
  )
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static / favicon.ico, images, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|opengraph-image.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|ico|json)$).*)',
  ],
}
