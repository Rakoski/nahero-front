'use server'
import {
  NextAuthMiddlewareOptions,
  NextRequestWithAuth,
  withAuth,
} from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { UserPermissions } from './constants/user-permissions'

const hasRole = (roles: any[], roleDescription: UserPermissions) =>
  roles.some((role) => role.description === roleDescription)

const middleware = (request: NextRequestWithAuth) => {
  const userObject = request.nextauth.token
    ? JSON.parse(JSON.stringify(request.nextauth.token))
    : null

  const currentPath = new URL(request.url).pathname
  const isAuthenticated = Boolean(userObject)

  // Protegendo rotas autenticadas
  if (currentPath.startsWith('/admin') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protegendo rotas de acordo com o papel do usuário
  if (userObject) {
    const userRoles = userObject.role || []

    if (
      currentPath.startsWith('/admin') &&
      !hasRole(userRoles, UserPermissions.IS_ADMIN)
    ) {
      return NextResponse.redirect(new URL('/404', request.url))
    }

    if (
      currentPath.startsWith('/student') &&
      !hasRole(userRoles, UserPermissions.IS_STUDENT)
    ) {
      return NextResponse.redirect(new URL('/404', request.url))
    }

    if (
      currentPath.startsWith('/instructor') &&
      !hasRole(userRoles, UserPermissions.IS_INSTRUCTOR)
    ) {
      return NextResponse.redirect(new URL('/404', request.url))
    }

    if (
      currentPath.startsWith('/tutor') &&
      !hasRole(userRoles, UserPermissions.IS_TUTOR)
    ) {
      return NextResponse.redirect(new URL('/404', request.url))
    }
  }

  // Para as páginas não autenticadas
  if (currentPath.startsWith('/public') && !isAuthenticated) {
    return NextResponse.next()
  }

  if (isAuthenticated) {
    const protectedRoutes = [
      '/career-area',
      '/cart',
      '/category',
      '/course-detail',
      '/payment',
      '/type-courses',
      '/validade-certificate',
    ]

    if (protectedRoutes.some((route) => currentPath.startsWith(route))) {
      if (!hasRole(userObject.role || [], UserPermissions.IS_STUDENT)) {
        return NextResponse.redirect(new URL('/404', request.url))
      }
    }
  }

  return NextResponse.next()
}

const callbackOptions: NextAuthMiddlewareOptions = {}

export default withAuth(middleware, callbackOptions)

export const config = {
  matcher: [
    '/admin/:path((?!login).*)',
    '/student/:path*',
    '/instructor/:path*',
    '/tutor/:path*',
    '/public/:path*',
    '/career-area',
    '/cart',
    '/category',
    '/course-detail',
    '/payment',
    '/type-courses',
    '/validade-certificate',
  ],
}
