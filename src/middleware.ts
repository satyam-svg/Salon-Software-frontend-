// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  email?: string;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const urlParts = pathname.split('/').filter(Boolean);
  const userIdFromPath = urlParts[0]; // e.g., domain.com/[userId]/dashboard

  const authToken = request.cookies.get('authToken')?.value || null;
  const staffToken = request.cookies.get('staffToken')?.value || null;

  const isDashboardRoute = pathname.includes('/dashboard');
  const isAdminDashboardRoute = pathname.includes('/adashboard');
  const isStaffRoute = pathname.includes('/staffpage');

  // 1️⃣ Handle protected user routes (dashboard, adashboard)
  if (isDashboardRoute || isAdminDashboardRoute) {
    if (!authToken) {
      return redirectToUnauthorized(request);
    }

    try {
      const decoded = jwtDecode<DecodedToken>(authToken);
      const userIdFromToken = decoded.id;

      // Compare path userId with token userId
      if (userIdFromToken !== userIdFromPath) {
        return redirectToUnauthorized(request);
      }

      // Extra check: Only allow specific user email for /adashboard
      if (isAdminDashboardRoute) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userIdFromToken}`);
        const data = await res.json();

        const email = data?.user?.email;
        if (email !== 'Veddikasiingh@gmail.com') {
          return redirectToUnauthorized(request);
        }
      }
    } catch (error) {
      console.error('Error decoding authToken:', error);
      return redirectToUnauthorized(request);
    }
  }

  // 2️⃣ Handle protected staff routes
  if (isStaffRoute) {
    if (!staffToken) {
      return redirectToUnauthorized(request);
    }

    try {
      const decoded = jwtDecode<DecodedToken>(staffToken);
      const staffIdFromToken = decoded.id;

      if (staffIdFromToken !== userIdFromPath) {
        return redirectToUnauthorized(request);
      }
    } catch (error) {
      console.error('Error decoding staffToken:', error);
      return redirectToUnauthorized(request);
    }
  }

  return NextResponse.next();
}

// ⛔ Helper to redirect unauthorized access
function redirectToUnauthorized(request: NextRequest) {
  return NextResponse.redirect(new URL('/unauthorized', request.url));
}

// 🔁 Routes to protect
export const config = {
  matcher: [
    '/:userId/dashboard/:path*',
    '/:userId/adashboard',
    '/:userId/staffpage/:path*',
  ],
};
