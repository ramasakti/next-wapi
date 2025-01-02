import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { fetcher } from "@/components/FetchUtils"

export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname
        const userRole = req.nextauth.token.user.id_role

        function isUrlInMenu(url, sections) {
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
        '/dashboard/:path*'
    ]
}