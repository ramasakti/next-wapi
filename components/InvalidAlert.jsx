"use client"
import React, { useEffect } from 'react';

export default function InvalidAlert({ show, onClose, message }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="alert alert-important alert-danger alert-dismissible" role="alert">
            <div className="d-flex">
                <div className="me-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-alert-octagon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M9.103 2h5.794a3 3 0 0 1 2.122 .879l4.101 4.1a3 3 0 0 1 .88 2.125v5.794a3 3 0 0 1 -.879 2.122l-4.1 4.101a3 3 0 0 1 -2.123 .88h-5.795a3 3 0 0 1 -2.122 -.88l-4.101 -4.1a3 3 0 0 1 -.88 -2.124v-5.794a3 3 0 0 1 .879 -2.122l4.1 -4.101a3 3 0 0 1 2.125 -.88z"></path>
                        <path d="M12 8v4"></path>
                        <path d="M12 16h.01"></path>
                    </svg>
                </div>
                <div>
                    {message}
                </div>
            </div>
        </div>
    )
}