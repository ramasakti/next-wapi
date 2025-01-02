"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AuthProvider from "@/app/AuthProvider";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import SuccessAlert from "../../../components/SuccessAlert";
import InvalidAlert from "../../../components/InvalidAlert";
import { fetcher } from "../../../components/FetchUtils";

export default function SignIn() {
    const router = useRouter();
    const { data: session } = useSession();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showInvalidAlert, setShowInvalidAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [authenticating, setAuthenticating] = useState(false);

    const handlePasswordVisibility = () => setShowPassword(prev => !prev);

    const authenticate = async (e) => {
        setAuthenticating(true);
        e.preventDefault();

        try {
            const res = await signIn('credentials', {
                username,
                password,
                redirect: false
            });

            if (!res.error) {
                router.push('/dashboard');
            } else {
                setAlertMessage(res.error);
                setShowInvalidAlert(true);
                setAuthenticating(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (session) router.push('/dashboard')
    }, [session]);

    useEffect(() => {
        // Handle autofill by checking the input values after the component mounts
        const filledUsername = document.getElementById('username').value;
        const filledPassword = document.getElementById('password').value;

        if (filledUsername) setUsername(filledUsername);
        if (filledPassword) setPassword(filledPassword);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInvalidAlert(false);
            setShowSuccessAlert(false);
        }, 2000);

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

    return (
        <AuthProvider>
            <div className="page page-center">
                <div className="container container-normal py-4">
                    <div className="row align-items-center g-4">
                        <div className="col-lg">
                            <div className="container-tight">
                                <div className="text-center mb-4">
                                    <Link href="/" className="navbar-brand navbar-brand-autodark">
                                        <img src={process.env.APP_LOGO} height="50" alt="" />
                                    </Link>
                                </div>
                                <div className="card card-md">
                                    <div className="card-body">
                                        {showSuccessAlert && (
                                            <SuccessAlert show={showSuccessAlert} message={alertMessage} onClose={() => setShowSuccessAlert(false)} />
                                        )}
                                        {showInvalidAlert && (
                                            <InvalidAlert show={showInvalidAlert} message={alertMessage} onClose={() => setShowInvalidAlert(false)} />
                                        )}
                                        <h2 className="h2 text-center mb-4">Login to your account</h2>
                                        <form onSubmit={authenticate} autoComplete="off" noValidate>
                                            <div className="mb-3">
                                                <label className="form-label">Username</label>
                                                <input
                                                    id="username"
                                                    name="username"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Masukkan username"
                                                    autoComplete="off"
                                                    onChange={e => setUsername(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">
                                                    Password
                                                    <span className="form-label-description">
                                                        <Link href="/auth/forgot/process">I forgot password</Link>
                                                    </span>
                                                </label>
                                                <div className="input-group input-group-flat">
                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="form-control"
                                                        placeholder="Masukkan password"
                                                        autoComplete="off"
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                    />
                                                    <span className="input-group-text">
                                                        <a href="#" className="link-secondary" onClick={handlePasswordVisibility} data-bs-toggle="tooltip">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                                                            </svg>
                                                        </a>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="form-footer">
                                                {authenticating ? (
                                                    <button type="submit" className="btn btn-primary w-100">
                                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                                    </button>
                                                ) : (
                                                    <button type="submit" className="btn btn-primary w-100">Sign in</button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                    <div className="hr-text">or</div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <button className="btn w-100" onClick={() => signIn('google')}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler text-google icon-tabler-brand-google" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                        <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8"></path>
                                                    </svg>
                                                    Login with Google
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg d-none d-lg-block">
                            <img src="/tabler/illustrations/undraw_secure_login_pdn4.svg" height="300" className="d-block mx-auto" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthProvider>
    );
}
