"use client"
import React, { useEffect } from 'react';

export default function SuccessAlert({ show, onClose, message }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose()
            }, 2500);
            return () => clearTimeout(timer)
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="alert alert-important alert-success alert-dismissible" role="alert">
            <div className="d-flex">
                <div className="me-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                </div>
                <div>
                    {message}
                </div>
            </div>
        </div>
    )
}