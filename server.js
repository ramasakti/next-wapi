const express = require('express');
const next = require('next');
const jwt = require('jsonwebtoken');
const { Client, LocalAuth, RemoteAuth, LegacySessionAuth, MessageMedia } = require('whatsapp-web.js');
const db = require('./Config')
const response = require('./Response');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const clients = {};
const qrCodes = {};

// Helper function to create a WhatsApp client
const createClient = (session) => {
    return new Client({
        authStrategy: new LocalAuth({
            clientId: session,
            backupSyncIntervalMs: 60000, // Sinkronisasi setiap 2 menit
        }),
        puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
    });
};

// Middleware for JWT authentication
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return response(401, null, 'Unauthorized: No token provided', res);

    const tokenWithoutBearer = token.replace('Bearer ', '');

    jwt.verify(tokenWithoutBearer, 'parlaungan1980', (err, decoded) => {
        if (err) return response(403, null, 'Unauthorized: Invalid token', res);
        req.user = decoded;
        next();
    });
};

// Initialize and restore clients from database
const initializeClients = async () => {
    try {
        const savedSessions = await db('wsp_sessions')

        for (const { session_name: sessionName, data } of savedSessions) {
            console.log(`Restoring session: ${sessionName}`);

            const client = createClient(sessionName);

            clients[sessionName] = client;

            client.on('qr', (qr) => {
                console.log(`Generated QR Code for session ${sessionName}:`, qr);
                qrCodes[sessionName] = qr;
            });

            client.on('ready', () => {
                console.log(`Client for session ${sessionName} is ready`);
            });

            client.on('authenticated', async () => {
                console.log(`Authenticated for session ${sessionName}`);
            });

            client.on('auth_failure', async (msg) => {
                console.error(`Auth failure for session ${sessionName}:`, msg);
                delete clients[sessionName];
            });

            client.on('disconnected', async (reason) => {
                console.log(`Client for session ${sessionName} disconnected:`, reason);
                delete clients[sessionName];
                await db('wsp_sessions').where('session_name', sessionName).del()
            });

            try {
                client.initialize();
            } catch (error) {
                console.error(`Error initializing client for session ${sessionName}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error('Error initializing clients:', error.message);
    }
};

app.prepare().then(async () => {
    const server = express();
    server.use(express.json());

    await initializeClients();

    server.get('/api/register/:session', async (req, res) => {
        const session = req.params.session;

        if (clients[session]) {
            const isConnected = !!clients[session].info;
            return response(200, { status: isConnected ? 'connected' : 'unauthenticated', client: clients[session].info }, `Session ${session} already registered`, res);
        }

        console.log(`Registering session ${session}`);
        const client = createClient(session);
        clients[session] = client;

        client.on('qr', (qr) => {
            console.log(`Generated QR Code for session ${session}:`, qr);
            qrCodes[session] = qr;
        });

        client.on('ready', () => {
            console.log(`Client for session ${session} is ready`);
        });

        client.on('authenticated', async () => {
            console.log(`Authenticated for session ${session}`);
            await db('wsp_sessions').insert({
                session_name: clients[session], data: client
            })
        });

        client.on('auth_failure', async (msg) => {
            console.error(`Auth failure for session ${session}:`, msg);
            delete clients[session];
        });

        client.on('disconnected', async (reason) => {
            console.log(`Client for session ${session} disconnected:`, reason);
            delete clients[session];
        });

        client.initialize();

        return response(200, { status: 'registering', qr: qrCodes[session] ?? null }, `Session ${session} is being registered`, res);
    });

    server.get('/api/whatsapp/qr/:session', (req, res) => {
        const session = req.params.session;
        const qr = qrCodes[session];

        if (!qr) return response(404, null, `QR Code for session ${session} not found`, res);

        return response(200, { qr }, `QR Code retrieved for session ${session}`, res);
    });

    server.get('/api/whatsapp/:session', authenticate, async (req, res) => {
        const session = req.params.session;
        const client = clients[session];

        if (!client) return response(404, null, `Session ${session} not found`, res);

        if (!client.info) return response(400, null, `Client not ready`, res);

        const number = client.info.wid.user;
        return response(200, { status: 'connected', number }, `Session status retrieved`, res);
    });

    server.get('/api/whatsapp/group/:session', authenticate, async (req, res) => {
        const session = req.params.session;
        try {
            const chats = await clients[session].getChats();

            const groups = chats.filter(chat => chat.id.server === 'g.us').map(group => ({
                id: group.id._serialized,
                name: group.name,
            }));

            return response(200, groups, `Daftar grup`, res);
        } catch (error) {
            console.error(error);
            return response(500, null, `Internal server error!`, res);
        }
    });

    server.post('/api/whatsapp/send/:session', authenticate, async (req, res) => {
        const session = req.params.session;
        try {
            const { number, message } = req.body;

            if (!number || !message) return response(400, null, 'Number and message are required', res);

            const formattedNumber = number.startsWith('62') ? number : `62${number}`;

            const client = clients[session];
            if (!client) return response(404, null, `Session ${session} not found`, res);

            await client.sendMessage(`${formattedNumber}@c.us`, message);
            return response(200, null, `Message sent to ${formattedNumber}`, res);
        } catch (error) {
            console.error(`Failed to send message for session ${session}:`, error);
            return response(500, null, 'Failed to send message', res);
        }
    });

    server.post('/api/whatsapp/sendMedia/:session', authenticate, async (req, res) => {
        const session = req.params.session;
        const { number, caption, mediaUrl } = req.body;

        if (!number || !mediaUrl) return response(400, null, 'Number and mediaUrl are required', res);

        const formattedNumber = number.startsWith('62') ? number : `62${number}`;

        const client = clients[session];
        if (!client) return response(404, null, `Session ${session} not found`, res);

        try {
            const media = await MessageMedia.fromUrl(mediaUrl);
            await client.sendMessage(`${formattedNumber}@c.us`, media, { caption });
            return response(200, null, `Media sent to ${formattedNumber}`, res);
        } catch (error) {
            console.error(`Failed to send media for session ${session}:`, error);
            return response(500, null, 'Failed to send media', res);
        }
    });

    server.post('/auth', async (req, res) => {
        try {
            const { username, password } = req.body
            let token, user = ''

            if (username === 'ramasakti' && password === 'Ramasakti123*') {
                user = {
                    username: username,
                    name: 'Rama Sakti Admin',
                    id_role: 1,
                    role: 'Admin'
                }
            }

            token = jwt.sign({ userId: username }, 'parlaungan1980', { expiresIn: '1h' })

            return response(200, { token, user }, 'Authenticated', res)
        } catch (error) {
            console.error(error)
            return response(500, {}, 'Internal Server Error', res)
        }
    })

    server.get('/navbar/:id_role', async (req, res) => {
        try {
            let users = ''

            const token = req.headers['authorization'].replace('Bearer ', '')
            jwt.verify(token, 'parlaungan1980', (err, user) => {
                users = user
            })

            const formattedNavbarData = [
                {
                    "section": null,
                    "icon": null,
                    "menu": [
                        {
                            "menu_name": "Dashboard",
                            "route": "/dashboard",
                            "submenu": []
                        }
                    ]
                },
            ]

            return response(200, formattedNavbarData, `Navbars`, res);
        } catch (error) {
            console.error(error)
            return response(500, {}, 'Internal Server Error', res)
        }
    })

    server.all('*', (req, res) => handle(req, res));

    server.listen(3000, () => {
        console.log('> Ready on http://localhost:3000');
    });
}).catch((err) => {
    console.error('Error starting server:', err);
});
