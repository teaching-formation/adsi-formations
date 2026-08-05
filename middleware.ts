import { NextRequest, NextResponse } from 'next/server'

// Sous-domaines publics cloisonnés : chacun n'expose QUE sa page,
// servie à la racine. Tout le reste (dashboard, /admin…) est renvoyé
// vers la page autorisée → impossible de remonter au site principal.
const ISOLATED_HOSTS: Record<
  string,
  { root: string; allow: (pathname: string) => boolean }
> = {
  'replays-adsi-formations.vercel.app': {
    root: '/replays',
    allow: (p) => p === '/replays',
  },
  'evaluation-adsi-formations.vercel.app': {
    root: '/evaluation',
    // La page + sa page de remerciement (après soumission du formulaire)
    allow: (p) => p === '/evaluation' || p === '/evaluation/merci',
  },
}

function isAsset(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/idsi-alumni-logo.jpeg'
  )
}

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase()
  const cfg = ISOLATED_HOSTS[host]

  // Hôte normal (site principal) → comportement inchangé
  if (!cfg) return NextResponse.next()

  const { pathname } = req.nextUrl

  // Assets et pages autorisées passent
  if (isAsset(pathname) || cfg.allow(pathname)) {
    return NextResponse.next()
  }

  const url = req.nextUrl.clone()
  url.pathname = cfg.root

  // Racine : affiche la page dédiée sans changer l'URL (rewrite)
  if (pathname === '/') return NextResponse.rewrite(url)

  // Toute autre route : redirection vers la page dédiée
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
