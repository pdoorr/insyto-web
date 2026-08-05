import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';
import { legacyDestination } from './lib/wp-legacy-urls';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use a locale prefix for the pathname
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  // Redirect 301 dal vecchio sito WordPress, che serviva ogni pagina da "/"
  // con un parametro in query string (/?page_id=333). Vanno gestiti qui e non
  // in next.config.js: i redirect della config ricopierebbero la query string
  // sulla destinazione, creando un doppione indicizzabile di ogni pagina.
  if (request.nextUrl.pathname === '/') {
    const destination = legacyDestination(request.nextUrl.searchParams);
    if (destination) {
      return NextResponse.redirect(new URL(destination, request.url), 301);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|studio|.*\\..*).*)',
  ],
};
