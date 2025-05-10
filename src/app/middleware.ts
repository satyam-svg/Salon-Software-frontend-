// middleware.ts (or middleware.js)
import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { parse } from 'cookie'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET!)



export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const cookies = parse(request.headers.get('cookie') || '')

  // Check for user ID routes
  const userIdMatch = path.match(/^\/([^\/]+)\//)
  if (!userIdMatch) return NextResponse.next()
  
  const userId = userIdMatch[1]
  let redirectUrl: URL | null = null

  // Dashboard routes protection
  if (path.startsWith(`/${userId}/dashboard`)) {
    const authToken = cookies.authToken
    
    if (!authToken) {
      redirectUrl = new URL('/login', request.url)
    } else {
      try {
        const { payload } = await jwtVerify(authToken, SECRET_KEY)
        if (payload.id !== userId) {
          redirectUrl = new URL('/unauthorized', request.url)
        }
      } catch (error) {
        redirectUrl = new URL('/login', request.url)
        console.log(error)
      }
    }
  }

  // Staff page protection
  if (path.startsWith(`/${userId}/staffpage`)) {
    const staffToken = cookies.staffToken
    
    if (!staffToken) {
      redirectUrl = new URL('/staff-login', request.url)
    } else {
      try {
        const { payload } = await jwtVerify(staffToken, SECRET_KEY)
        if (payload.id !== userId) {
          redirectUrl = new URL('/unauthorized', request.url)
        }
      } catch (error) {
        redirectUrl = new URL('/staff-login', request.url)
        console.log(error)
      }
    }
  }

  // Admin dashboard protection
  if (path.startsWith(`/${userId}/adashboard`)) {
    const authToken = cookies.authToken
    
    if (!authToken) {
      redirectUrl = new URL('/login', request.url)
    } else {
      try {
        const { payload } = await jwtVerify(authToken, SECRET_KEY)
        
        // Verify admin email through API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${payload.id}`
        )
        
        if (!response.ok) throw new Error('User not found')
        
        const userData = await response.json()
        if (userData.user.email !== 'Veddikasiingh@gmail.com') {
          redirectUrl = new URL('/unauthorized', request.url)
        }
      } catch (error) {
        console.error(error)
        redirectUrl = new URL('/login', request.url)
      }
    }
  }

  return redirectUrl ? NextResponse.redirect(redirectUrl) : NextResponse.next()
}

// Add your route matcher here
export const config = {
  matcher: [
    '/([^/]+)/dashboard/:path*',
    '/([^/]+)/staffpage/:path*',
    '/([^/]+)/adashboard/:path*'
  ]
}