import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetcher } from '@/components/FetchUtils';
import jwt from 'jsonwebtoken';

const authOption = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "Enter Your Email"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter Your Password"
                }
            },
            async authorize(credentials) {
                try {
                    const data = await fetcher(`/auth`, {
                        method: 'POST',
                        body: JSON.stringify(credentials)
                    });

                    if (!data || !data.payload.user || data.payload.user.role !== 'Admin') {
                        throw new Error("Unauthorized");
                    }

                    return {
                        ...data.payload.user,
                        token: data.payload.token,
                    };
                } catch (error) {
                    console.error("Authorize error:", error.message);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/login'
    },
    session: {
        maxAge: 3600, // Session expiry (1 hour)
    },
    callbacks: {
        async session({ session, token }) {
            session.user = token.user || null; // Assign user data from token to session
            return session;
        },
        async jwt({ token, user, account }) {
            if (account?.provider === "google") {
                // For Google login, directly assign the user data                
                if (user) {
                    token.user = {
                        ...user,
                        role: "User", // Assign role 'user' for Google accounts
                        token: jwt.sign({ userId: user }, 'parlaungan1980', { expiresIn: '1h' })
                    };
                }
            } else if (user) {
                // For Credentials login, use the user data returned by authorize
                token.user = user;
            }
            return token;
        },
    },
};

const handler = NextAuth(authOption)

export { authOption, handler as GET, handler as POST } 