
import { NextRequest, NextResponse } from 'next/server';
import { NextMiddleware } from 'next/server';
export async function middleware(req: NextRequest) {
  console.log('Cookies:', req.cookies.getAll());
  console.log('Auth token:', req.cookies.get('auth_token'));
  const path = req.nextUrl.pathname;
  
  if (path.startsWith('/api') || path === '/user/login') {
    return NextResponse.next();
  }

  try {
    const authCheck = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`, {
      credentials: 'include',
      headers: {
        Cookie: req.cookies.toString()
      }
    });
    
    if (!authCheck.ok) {
      throw new Error('Not authenticated');
    }
    
    return NextResponse.next();
  } catch (err) {
    const loginUrl = new URL('/user/login', req.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/seller/dashboard/:path*', '/products/:path*']
};