// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  console.log('Middleware triggered for path:', path)

  // 1. Extract userId from URL
  const userId = path.split('/')[1]
  if (!userId) return NextResponse.next()

  let redirectUrl: URL | null = null
  const cookies = request.cookies

  try {
    // 2. Dashboard routes protection
    if (path.startsWith(`/${userId}/dashboard`)) {
      console.log('Checking dashboard access for user:', userId)
      const authToken = cookies.get('authToken')?.value
      
      if (!authToken) {
        console.log('No authToken found')
        redirectUrl = new URL('/login', request.url)
      } else {
        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!))
        console.log('Decoded token ID:', payload.id, 'URL ID:', userId)
        
        if (payload.id !== userId) {
          console.log('ID mismatch - redirecting to unauthorized')
          redirectUrl = new URL('/unauthorized', request.url)
        }
      }
    }

    // 3. Staff page protection
    if (path.startsWith(`/${userId}/staffpage`)) {
      console.log('Checking staff access for user:', userId)
      const staffToken = cookies.get('staffToken')?.value
      
      if (!staffToken) {
        console.log('No staffToken found')
        redirectUrl = new URL('/staff-login', request.url)
      } else {
        const { payload } = await jwtVerify(staffToken, new TextEncoder().encode(process.env.JWT_SECRET!))
        if (payload.id !== userId) {
          redirectUrl = new URL('/unauthorized', request.url)
        }
      }
    }

    // 4. Admin dashboard protection
    if (path.startsWith(`/${userId}/adashboard`)) {
      console.log('Checking admin access for user:', userId)
      const authToken = cookies.get('authToken')?.value
      
      if (!authToken) {
        redirectUrl = new URL('/login', request.url)
      } else {
        const { payload } = await jwtVerify(authToken, new TextEncoder().encode(process.env.JWT_SECRET!))
        
        // Verify admin email through API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${payload.id}`
        )
        
        if (!response.ok) throw new Error('User not found')
        
        const userData = await response.json()
        if (userData.user.email !== 'Veddikasiingh@gmail.com') {
          console.log('Admin email mismatch')
          redirectUrl = new URL('/unauthorized', request.url)
        }
      }
    }
  } catch (error) {
    console.error('Middleware error:', error)
    redirectUrl = new URL('/login', request.url)
  }

  return redirectUrl ? NextResponse.redirect(redirectUrl) : NextResponse.next()
}

export const config = {
  matcher: [
    '/:userId/dashboard/:path*',
    '/:userId/staffpage/:path*',
    '/:userId/adashboard/:path*'
  ]
}