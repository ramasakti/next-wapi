"use client"
import { useState } from "react";
import Link from "next/link";
import AuthProvider from "../../../AuthProvider"
import { useRouter } from 'next/navigation'
import InvalidAlert from "../../../../components/InvalidAlert";

export default function ProcessForgot() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [showInvalidAlert, setShowInvalidAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [forgotting, setForgotting] = useState(false)

    const sendEmail = async () => {
        setForgotting(true)

        try {
            const data = await fetcher(`/reset`, {
                method: 'POST',
                body: JSON.stringify({ email: email })
            })

            if (response) {
                router.push(`/auth/forgot/success?email=${email}`)
            } else {
                setAlertMessage(data.message)
                setShowInvalidAlert(true)
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setForgotting(false)
        }
    }
    return (
        <>
            <AuthProvider>
                <div className="page page-center">
                    <div className="container container-tight py-4">
                        <div className="text-center mb-4">
                            <Link href="/" className="navbar-brand navbar-brand-autodark"><img src="/logo.svg" height="50" alt="" /></Link>
                        </div>
                        <div className="text-center">
                            {showInvalidAlert && (
                                <InvalidAlert show={showInvalidAlert} message={alertMessage} onClose={() => setShowInvalidAlert(false)}></InvalidAlert>
                            )}
                            <div className="my-5">
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input name="email" type="email" className="form-control" placeholder="Masukkan email" autoComplete="off" onChange={e => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-footer">
                                {forgotting ? (
                                    <button type="submit" className="btn btn-primary w-100">
                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                    </button>
                                ) : (
                                    <button className="btn btn-primary w-100" onClick={sendEmail}>Reset</button>
                                )}
                            </div>
                            <div className="text-center text-muted mt-4">
                                Masukkan alamat email yang terdaftar pada akun Ispagram anda untuk kami mengirim password baru akun anda.<br />
                                Lupa alamat email? Hubungi admin.
                            </div>
                        </div>
                    </div>
                </div>
            </AuthProvider>
        </>
    );
}