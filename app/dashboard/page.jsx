"use client"
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import QRCodeReact from 'react-qr-code';
import { fetcher } from "components/FetchUtils";
import PageHeader from '@/components/PageHeader';

export default function Dashboard({ params }) {
    const { data: session } = useSession();
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataWhatsapp, setDataWhatsapp] = useState(null);
    const [qrCode, setQRCode] = useState(null);

    const checkConnection = async () => {
        try {
            const response = await fetcher(`/api/register/${session?.user?.id}`, {
                token: session?.user?.token
            });
            
            switch (response.payload.status) {
                case 'registering':
                    
                    break;
                case 'connected':
                    setIsConnected(true);
                    setDataWhatsapp(response.payload.client.me.user)
                    break;
                case 'disconnected':
                    
                    break;
            }
        }
        catch (error) {
            console.error("Error checking connection:", error);
            setIsConnected(false);
        }
    };

    const getQR = async () => {
        setIsLoading(true);
        try {
            const response = await fetcher(`/api/whatsapp/qr/${session?.user?.id}`, {
                token: session?.user?.token
            });
            
            if (response) setQRCode(response.payload.qr)
        }
        catch (error) {
            console.error("Error getting QR code:", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            checkConnection();
        }
    }, [session]);

    return (
        <>
            <PageHeader />
            <h1>Selamat Datang, {session?.user?.name}!</h1>

            {isConnected ? (
                <div className="connected-info">
                    <p><strong>Nomor WhatsApp:</strong> {dataWhatsapp}</p>
                    <p><strong>Status:</strong> Connected</p>
                </div>
            ) : (
                <div className="connect-section">
                    <button
                        className={`btn btn-dark ${isLoading ? 'btn-loading' : ''}`}
                        onClick={getQR}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Get QR Code'}
                    </button>

                    {qrCode && (
                        <div className="qr-code-container">
                            <QRCodeReact value={qrCode} className="mt-1" />
                            <p>Scan QR Code di aplikasi WhatsApp untuk terhubung.</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
