import Link from "next/link";

export default function NotAuthorized() {
    return (
        <div className="page page-center">
            <div className="container-tight py-4">
                <div className="empty">
                    <div className="empty-header">403</div>
                    <p className="empty-title">Forbidden</p>
                    <p className="empty-subtitle text-muted">
                        Mohon maaf anda tidak diizinkan untuk mengakses halaman ini
                    </p>
                    <div className="empty-action">
                        <Link href="/" className="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
                            Kembali ke beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}