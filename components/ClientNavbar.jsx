// components/ClientNavbar.jsx
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from "next-auth/react";

export default function ClientNavbar({ dataNavbar }) {
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
    }, []);

    useEffect(() => {
        const handleNavLinkClick = (event) => {
            const href = event.target.href
            if (href && href !== '/' && href !== window.location.origin + '/') {
                const navLinks = document.querySelectorAll('.navbar-nav a')
                navLinks.forEach((link) => {
                    link.closest('li').classList.remove('active')
                })
                event.target.closest('li').classList.add('active')
            }
        }

        const navLinks = document.querySelectorAll('.navbar-nav a')
        navLinks.forEach((link) => {
            link.addEventListener('click', handleNavLinkClick)
        })

        return () => {
            navLinks.forEach((link) => {
                link.removeEventListener('click', handleNavLinkClick)
            })
        }
    }, [dataNavbar])

    useEffect(() => {
        let navLinks = document.querySelectorAll('.navbar-nav a')
        navLinks.forEach(function (link) {
            if (link.href === currentUrl) {
                link.closest('li').classList.add('active')
            } else {
                link.closest('li').classList.remove('active')
            }
        })
    }, [dataNavbar, currentUrl])

    return (
        <div className="collapse navbar-collapse" id="sidebar-menu">
            <ul className="navbar-nav pt-lg-3">
                {dataNavbar && dataNavbar.payload.map((menuItem, index) => (
                    <MenuItem key={index} menuItem={menuItem} />
                ))}
            </ul>
        </div>
    );
}

function MenuItem({ menuItem }) {
    if (menuItem.section === null) {
        return (
            <>
                {menuItem.menu.map((element, index) => (
                    <li key={index} className="nav-item">
                        <Link key={index} href={element.route} className="nav-link">
                            {element.menu_name}
                        </Link>
                    </li>
                ))}
                <li key='logout' className='nav-item'>
                    <button onClick={signOut} className="dropdown-item nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout me-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                            <path d="M9 12h12l-3 -3"></path>
                            <path d="M18 15l3 -3"></path>
                        </svg>
                        LOGOUT
                    </button>
                </li>
            </>
        );
    } else {
        if (menuItem.menu && menuItem.menu.length > 0) {
            return (
                <li className="nav-item dropdown">
                    <Link href="/" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                        <div dangerouslySetInnerHTML={{ __html: menuItem.icon }} />
                        <span className="nav-link-title ms-2">
                            {menuItem.section}
                        </span>
                    </Link>
                    <div className="dropdown-menu">
                        <div className="dropdown-menu-columns">
                            <div className="dropdown-menu-column">
                                {menuItem.menu.map((subItem, index) => (
                                    <NestedMenuItem key={index} menuItem={subItem} />
                                ))}
                            </div>
                        </div>
                    </div>
                </li>
            );
        } else {
            return (
                <li className="nav-item">
                    <Link href={menuItem.route ? menuItem.route : ''} className="nav-link">
                        {menuItem.menu_name}
                    </Link>
                </li>
            );
        }
    }
}

function NestedMenuItem({ menuItem }) {
    if (menuItem.submenu && menuItem.submenu.length > 0) {
        return (
            <div className="dropdown">
                <Link href="/" className="dropdown-item dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                    {menuItem.menu_name}
                </Link>
                <div className="dropdown-menu">
                    {menuItem.submenu.map((subMenuItem, index) => (
                        <Link key={index} href={subMenuItem.submenu_route} className="dropdown-item">
                            {subMenuItem.submenu}
                        </Link>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <Link href={menuItem.route ? menuItem.route : ''} className="dropdown-item">
                {menuItem.menu_name}
            </Link>
        );
    }
}