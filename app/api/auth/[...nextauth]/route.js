import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { fetcher } from "../../../components/FetchUtils"

export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname
        const userRole = req.nextauth.token.user.id_role

        function isUrlInMenu(url, sections) {
            if (
                url.endsWith('/sekolah/jampel/generate') ||
                url.endsWith('/siswa/keuangan/transaksi/checkout') ||
                url.endsWith('/akun') ||
                url.endsWith('/biodata') ||
                url.includes('/web/access/') ||
                url.includes('/siswa/keuangan/transaksi/') ||
                url.includes('/app/quran') ||
                url.startsWith('/dashboard/app') ||
                url.includes('/blog/create') ||
                url.includes('/web/blog/edit/') ||
                url.includes('/alumni/transaksi/')
            ) return true

            for (const section of sections) {
                for (const menu of section.menu) {
                    if (!menu.route) {
                        for (const submenu of menu.submenu) {
                            if (submenu.submenu_route === url) {
                                return true;
                            }
                        }
                    } else {
                        if (menu.route === url) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        const menu = await fetcher(`/navbar/${userRole}`)
        
        const isUrlFoundInMenu = isUrlInMenu(pathname, menu.payload)

        if (!isUrlFoundInMenu) {
            return NextResponse.rewrite(
                new URL('/auth/notauthorized', req.url)
            )
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
)

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/kesiswaan/:path*',
        '/kurikulum/:path*',
        '/bendahara/:path*',
        '/guru/:path*',
        '/piket/:path*',
        '/walas/:path*',
        '/siswa/:path*',
        '/akun/:path*',
        '/biodata/:path*'
    ]
}