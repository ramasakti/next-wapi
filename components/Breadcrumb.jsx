"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Breadcrumb = () => {
    const role = ['admin', 'kurikulum', 'kesiswaan', 'bendahara', 'piket', 'guru', 'siswa']
    const router = useRouter();
    const [pathname, setPathname] = useState('');
    const { query } = router;

    // Inisialisasi breadcrumbItems sebagai array kosong
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);

    useEffect(() => {
        setPathname(window.location.pathname);
    }, []);

    useEffect(() => {
        // Panggil fungsi getBreadcrumbItems ketika pathname atau query berubah
        setBreadcrumbItems(getBreadcrumbItems(pathname, query));
    }, [pathname, query]);

    function getBreadcrumbItems(pathname, query) {
        if (!pathname) return [];
        const pathSegments = pathname.split('/').filter((segment) => segment !== '');
    
        // Jika halaman saat ini adalah halaman root, tambahkan link ke halaman root
        const rootItem = { label: 'Home', link: '/' };
        const items = [rootItem];
    
        // Cari index segment yang terakhir dalam array role
        let lastRoleIndex = -1;
        for (let i = 0; i < pathSegments.length; i++) {
            if (role.includes(pathSegments[i])) {
                lastRoleIndex = i;
            }
        }
    
        // Hanya ubah label untuk segmen jalur pertama (setelah domain utama) jika ada dalam array role
        if (lastRoleIndex >= 0) {
            const label = 'Dashboard';
            const link = `/${pathSegments[0]}`;
            const item = { label, link };
            items.push(item);
        } else {
            // Jika segmen pertama tidak ada dalam array role, gunakan segmen itu sebagai label
            const label = pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1);
            const link = `/${pathSegments[0]}`;
            const item = { label, link };
            items.push(item);
        }
    
        // Iterasi melalui setiap segmen jalur (mulai dari segmen kedua) untuk membangun breadcrumb
        let currentPath = `/${pathSegments[0]}`;
        for (let i = 1; i < pathSegments.length; i++) {
            currentPath += `/${pathSegments[i]}`;
    
            // Gunakan segmen sebagai label
            const label = pathSegments[i].charAt(0).toUpperCase() + pathSegments[i].slice(1);
            const link = currentPath;
    
            const item = { label, link };
            items.push(item);
        }
    
        // Jika ada parameter routing dalam query, tambahkan item breadcrumb untuk parameter tersebut
        if (query && Object.keys(query).length > 0) {
            const label = `Detail: ${query.id}`; // Gantikan dengan label yang sesuai dengan parameter Anda
            const link = pathname;
    
            const item = { label, link };
            items.push(item);
        }
    
        return items;
    }

    return (
        <>
            <ol className="breadcrumb" aria-label="breadcrumbs">
                {breadcrumbItems.map((item, index) => (
                    <li key={index} className="breadcrumb-item">
                        <Link key={index} href={item.link}>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ol>
        </>
    );
};

export default Breadcrumb;
