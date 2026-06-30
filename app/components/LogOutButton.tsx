"use client"
import { useAuth } from "@/app/components/AuthProvider";

export default function LogOutButton() {
    const { signOut } = useAuth();
    return (
        <div className="dashboard-nav-link" onClick={async () => {
            await signOut();
        }}>
            Log Out
        </div>
    )
}