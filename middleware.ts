import { NextRequest, NextResponse } from 'next/server'

// Sous-domaine public dédié aux replays.
// Sur cet hôte, on n'expose QUE la page /replays (servie à la racine),
// tout le reste (dashboard, /admin, /evaluation…) est renvoyé vers /replays.
const REPLAYS_HOST = 'replays-adsi-formations.vercel.app'

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase()

  // Hôte normal → comportement inchangé
  if (host !== REPLAYS_HOST) return NextResponse.next()

  const { pathname } = req.nextUrl

  // Laisser passer les assets et la page replays elle-même
  if (
    pathname === '/replays' ||
    pathname === '/favicon.ico' ||
    pathname === '/idsi-alumni-logo.jpeg' ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  const url = req.nextUrl.clone()
  url.pathname = '/replays'

  // Racine : on affiche replays sans changer l'URL (rewrite)
  if (pathname === '/') return NextResponse.rewrite(url)

  // Toute autre route (admin, evaluation, etc.) : redirection vers replays
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
