import React from "react";
import Script from "next/script"
import AuthProvider from "@/app/AuthProvider"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={inter.className}>
            <head>
                <meta charSet="UTF-8" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
                <meta name="title" content={process.env.NEXT_PUBLIC_APP_NAME} />
                <meta name="description" content={process.env.NEXT_PUBLIC_APP_DESCRIPTION} />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="http://localhost" />
                <meta property="og:title" content={process.env.NEXT_PUBLIC_APP_NAME} />
                <meta property="og:description" content={process.env.NEXT_PUBLIC_APP_DESCRIPTION} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_APP_LOGO} />

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="http://localhost" />
                <meta property="twitter:title" content={process.env.NEXT_PUBLIC_APP_NAME} />
                <meta property="twitter:description" content={process.env.NEXT_PUBLIC_APP_DESCRIPTION} />
                <meta property="twitter:image" content={process.env.NEXT_PUBLIC_APP_LOGO} />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"></link>
            </head>
            <body className={inter.className}>
                <AuthProvider>
                    {children}
                </AuthProvider>
                <Script src="/tabler/libs/apexcharts/dist/apexcharts.min.js?1684106062" async></Script>
                <Script src="/tabler/libs/jsvectormap/dist/js/jsvectormap.min.js?1684106062" async></Script>
                <Script src="/tabler/libs/jsvectormap/dist/maps/world.js?1684106062" async></Script>
                <Script src="/tabler/libs/jsvectormap/dist/maps/world-merc.js?1684106062" async></Script>
                <Script src="/tabler/js/tabler.min.js?1684106062" async></Script>
                <Script src="/tabler/js/demo.min.js?1684106062" async></Script>
                <Script src="https://cdn.jsdelivr.net/npm/flatpickr" async></Script>
            </body>
        </html>
    )
}