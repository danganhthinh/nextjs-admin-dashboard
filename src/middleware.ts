import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { refreshAccessToken } from "@/services/auth";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

// Must match NestJS secret
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret'

// Routes to ignore
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/_next',       // Next.js assets
  '/api/public',  // Example public API
  '/favicon.ico',
  '/images',      // Static images
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip middleware for public routes (login, register, homepage)
  if (
    pathname.startsWith('/auth/sign-in') ||
    pathname.startsWith('/register') ||
    pathname === '/'
  ) {
    return NextResponse.next()
  }

  // Get token from cookie
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  let newAccessToken = accessToken;

  if (!accessToken && refreshToken) {
    const data = await refreshAccessToken();
    console.log('data?.accessToken: ', data?.accessToken);
    newAccessToken = data?.accessToken;

    const decodedAccessToken = jwt.decode(newAccessToken) as {
      exp?: number;
      iat?: number;
    };

    let maxAgeAccessToken = 0;
    if (decodedAccessToken?.exp && decodedAccessToken?.iat) {
      maxAgeAccessToken =
        (decodedAccessToken.exp - decodedAccessToken.iat) / (60 * 60 * 24); // in seconds
    }

    Cookies.set("accessToken", accessToken, {
      path: "/",
      secure: true,
      sameSite: "strict",
      expires: maxAgeAccessToken,
    });
  }

  const requestHeaders = new Headers(req.headers);

  if (!newAccessToken) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  }

  try {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (err) {
    console.error('Invalid JWT:', err)
    return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  }
}

// Protect only these paths
export const config = {
  matcher: [
    // Protect all pages, exclude Next.js internals and static files
    '/((?!_next|favicon\\.ico|assets|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|txt|xml|json|map|woff|woff2)).*)',

    // Also protect API routes
    '/api/:path*',
  ],
}
