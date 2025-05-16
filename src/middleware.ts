// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  email?: string;
  exp?: number;
  role?: string;
}

// Helper function to validate token structure and expiration
const validateToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check token expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      throw new Error('Token expired');
    }
    
    // Validate required claims
    if (!decoded.id) {
      throw new Error('Missing user ID in token');
    }
    
    return decoded;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};

// Extract user ID from path with regex validation
const getUserIdFromPath = (pathname: string): string | null => {
  const match = pathname.match(/^\/([a-zA-Z0-9_-]+)\/(dashboard|adashboard|staffpage)/);
  return match ? match[1] : null;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userIdFromPath = getUserIdFromPath(pathname);

  // Common error response with token cleanup
  const unauthorizedResponse = (clearCookies: string[] = []) => {
    const response = NextResponse.redirect(new URL('/unauthorized', request.url));
    clearCookies.forEach(cookie => response.cookies.delete(cookie));
    return response;
  };

  // Handle user dashboard routes
  if (pathname.includes('/dashboard') ) {
    const authToken = request.cookies.get('authToken')?.value;

    // Immediate check for token presence
    if (!authToken) {
      return unauthorizedResponse(['authToken']);
    }

    // Validate token structure and expiration
    const decoded = validateToken(authToken);
    console.log(decoded.id)
    if (!decoded) {
      return unauthorizedResponse(['authToken']);
    }

    // Validate path user ID match
    if (!userIdFromPath || decoded.id !== userIdFromPath) {
      console.error(`User ID mismatch: Token=${decoded.id}, Path=${userIdFromPath}`);
      return unauthorizedResponse(['authToken']);
    }

    // Additional checks for admin dashboard
    if (pathname.includes('/adashboard')) {
      try {
        // Verify admin privileges
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${decoded.id}`
        );
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        const userEmail = data?.user?.email;
        
        if (userEmail !== 'praveen96257@gmail.com') {
          console.error('Admin email mismatch:', userEmail);
          return unauthorizedResponse(['authToken']);
        }
      } catch (error) {
        console.error('Admin verification failed:', error);
        return unauthorizedResponse(['authToken']);
      }
    }

    // Add role-based access control
    if (decoded.role && pathname.includes('/adashboard') && decoded.role !== 'admin') {
      console.error('Insufficient role for admin dashboard:', decoded.role);
      return unauthorizedResponse(['authToken']);
    }
  }

  // Handle staff routes
  if (pathname.includes('/staffpage')) {
    const staffToken = request.cookies.get('staffToken')?.value;

    if (!staffToken) {
      return unauthorizedResponse(['staffToken']);
    }

    const decoded = validateToken(staffToken);
    if (!decoded) {
      return unauthorizedResponse(['staffToken']);
    }

    if (!userIdFromPath || decoded.id !== userIdFromPath) {
      console.error(`Staff ID mismatch: Token=${decoded.id}, Path=${userIdFromPath}`);
      return unauthorizedResponse(['staffToken']);
    }

    // Additional staff-specific validations
    if (decoded.role && decoded.role !== 'staff') {
      console.error('Invalid role for staff access:', decoded.role);
      return unauthorizedResponse(['staffToken']);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:userId/dashboard/:path*',
    '/:userId/adashboard/:path*',
    '/:userId/staffpage/:path*',
  ],
};