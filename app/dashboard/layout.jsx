import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import AuthProvider from "@/app/AuthProvider";
import Link from "next/link";
import Image from "next/image";
import ClientNavbar from "components/ClientNavbar";
import { fetcher } from "components/FetchUtils";

export default async function Layout({ children }) {
    // Mendapatkan session di server-side
    const session = await getServerSession(authOption);

    // Cek apakah session tersedia
    if (!session) {
        return <p>Loading session...</p>;
    }

    // Fetch data navbar menggunakan id_role dari session user
    const dataNavbar = await fetcher(`/api/navbar/${session.user.id_role}`, {
        method: 'GET',
        token: session?.user?.token
    });

    return (
        <AuthProvider>
            <div className="page">
                <aside className="navbar navbar-vertical navbar-expand-lg navbar-transparent">
                    <div className="container-fluid">
                        <h1 className="navbar-brand navbar-brand-autodark">
                            <Link href="/" className="text-decoration-none">
                                <img src={process.env.NEXT_PUBLIC_APP_LOGO} width="100" height="100" alt={process.env.NEXT_PUBLIC_APP_NAME} className="navbar-brand-image" />
                            </Link>
                        </h1>
                        <ClientNavbar dataNavbar={dataNavbar} />
                    </div>
                </aside>
                <div className="page-wrapper">
                    <div className="page-body">
                        <div className="container-xl">
                            {children}
                        </div>
                    </div>
                    <footer className="footer footer-transparent d-print-none">
                        <div className="container-xl">
                            <div className="row text-center align-items-center flex-row-reverse">
                                <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                                    <ul className="list-inline list-inline-dots mb-0">
                                        <li className="list-inline-item">
                                            Copyright © {new Date().getFullYear()} |
                                            Made With ❤ by <b>{process.env.NEXT_PUBLIC_APP_NAME}</b>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </AuthProvider>
    );
};
