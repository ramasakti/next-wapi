import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/route";

export default async function Index() {
    const session = await getServerSession(authOptions);
    
    session?.user ? redirect('dashboard') : redirect('/auth/login')

    return (
        <>
        <p>s</p>
        </>
    )
};