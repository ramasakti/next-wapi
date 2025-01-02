"use client"
import React from "react";
import Breadcrumb from "./Breadcrumb";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function PageHeader() {
    const session = useSession();
    const avatarSrc = session.data?.user.avatar;

    return (
        <div className="page-header d-print-none">
            <div className="container-xl">
                <div className="row g-2 align-items-center">
                    <div className="col">
                        <div className="page-pretitle">
                            <div className="d-flex align-items-center justify-content-between">
                                <Breadcrumb />
                                <div className="d-flex align-items-center">
                                    <div className="nav-item dropdown">
                                        <a href="#" className="nav-link d-flex lh-1 text-reset p-0 show" data-bs-toggle="dropdown" aria-label="Open user menu" aria-expanded="true">
                                            {(avatarSrc) ? (
                                                <img className="avatar avatar-sm mb-2" src={process.env.NEXT_PUBLIC_FTP + '/' + avatarSrc} />
                                            ) : (
                                                <span className="avatar">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                                    </svg>
                                                </span>
                                            )}
                                            <div className="d-none d-xl-block ps-2">
                                                <div>{useSession().data?.user.name}</div>
                                                <div className="mt-1 small text-muted">{useSession().data?.user.role}</div>
                                            </div>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow" data-bs-popper="static">
                                            <button onClick={signOut} className="dropdown-item">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout me-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                                                    <path d="M9 12h12l-3 -3"></path>
                                                    <path d="M18 15l3 -3"></path>
                                                </svg>
                                                LOGOUT
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
