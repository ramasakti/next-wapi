"use client"
import React from "react"
import Link from "next/link";
import AuthProvider from "../../../AuthProvider"
import { useSearchParams } from 'next/navigation'

export default function SuccessForgot() {
    const email = useSearchParams().get('email')
    return (
        <>
            <AuthProvider>
                <div class="page page-center">
                    <div class="container container-tight py-4">
                        <div class="text-center mb-4">
                            <Link href="/" class="navbar-brand navbar-brand-autodark"><img src="/logo.svg" height="36" alt=""/></Link>
                        </div>
                        <div class="text-center">
                            <div class="my-5">
                                <h2 class="h1">Periksa kotak masuk email anda</h2>
                                <p class="fs-h3 text-muted">
                                    Kami telah mengirim email berisi kredensial untuk login pada aplikasi Ispagram ke <strong>{email}</strong>.<br />
                                    Mohon ikuti petunjuk yang ada pada email tersebut.
                                </p>
                            </div>
                            <div class="text-center text-muted mt-3">
                                Tidak mendapati pesan email? Periksa pada folder spam.<br />
                                Salah email? Mohon <Link href="/auth/forgot/process">entri ulang email anda</Link>.
                            </div>
                        </div>
                    </div>
                </div>
            </AuthProvider>
        </>
    );
}