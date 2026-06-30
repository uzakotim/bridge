
"use client"
import { useAuth } from "@/app/components/AuthProvider";

export default function SignInButton() {
    const { signInWithGoogle } = useAuth();
    return (
        <div className="dashboard-nav-link" onClick={async () => {
            await signInWithGoogle();
        }}>
            Sign In
        </div>
    )
}