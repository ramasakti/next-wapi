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
                <div className="page page-center">
                    <div className="container container-tight py-4">
                        <div className="text-center mb-4">
                            <Link href="/" className="navbar-brand navbar-brand-autodark"><img src="/logo.svg" height="36" alt=""/></Link>
                        </div>
                        <div className="text-center">
                            <div className="my-5">
                                <h2 className="h1">Periksa kotak masuk email anda</h2>
                                <p className="fs-h3 text-muted">
                                    Kami telah mengirim email berisi kredensial untuk login pada aplikasi Ispagram ke <strong>{email}</strong>.<br />
                                    Mohon ikuti petunjuk yang ada pada email tersebut.
                                </p>
                            </div>
                            <div className="text-center text-muted mt-3">
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