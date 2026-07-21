import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname
  const publicPath = pathname === '/login' || pathname.startsWith('/auth/')

  if (!user && !publicPath) {
    const login = request.nextUrl.clone()
    login.pathname = '/login'
    login.searchParams.set('next', pathname)
    return NextResponse.redirect(login)
  }
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return response
}

export const config = {
  matcher: [
    /*
     * Filtra todos os caminhos de requisição, exceto os que começam com:
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (ícone do site)
     * - imagens/vetores locais (.svg, .png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
