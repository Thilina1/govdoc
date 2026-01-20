
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { createClient } from "@/lib/supabase/middleware";

const secretKey = process.env.SESSION_SECRET || 'generated_secret_key_change_me';
const key = new TextEncoder().encode(secretKey);

async function verifySession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return null;
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    // 1. Refresh Supabase session (keep this for other potential uses, 
    // though we are using custom cookie for our main auth now)
    const supabaseResponse = await createClient(request);

    // 2. Custom Auth with Jose
    const session = await verifySession(request);
    const path = request.nextUrl.pathname;

    // Define public paths that don't need auth
    const isPublicPath = path === '/login' || path === '/register' || path === '/' || path.startsWith('/test-supabase');

    // Define protected paths
    const isProtectedPath = path === '/dashboard' || path.startsWith('/dashboard');

    // Logic
    if (isProtectedPath && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isPublicPath && session && path !== '/' && !path.startsWith('/test-supabase')) {
        // Don't redirect home page or test page necessarily, but definitely login/register
        if (path === '/login' || path === '/register') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
