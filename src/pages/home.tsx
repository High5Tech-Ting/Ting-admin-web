import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { logoutUser } from "@/firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/signin");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Welcome to Ting</h1>
                <Button
                    onClick={handleLogout}
                    variant="outline"
                >
                    Sign out
                </Button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {currentUser?.displayName}</p>
                    <p><span className="font-medium">Email:</span> {currentUser?.email}</p>
                </div>
            </div>
        </div>
    );
}