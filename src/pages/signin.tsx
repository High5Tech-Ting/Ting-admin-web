import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { loginWithEmailAndPassword } from "@/firebase/auth";
import { toast } from "sonner";

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter email and password");
            return;
        }

        try {
            setLoading(true);
            await loginWithEmailAndPassword(email, password);
            toast.success("Signed in successfully!");
            navigate("/home");
        } catch (err) {
            console.error(err);
            toast.error("Failed to sign in. Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-xl font-semibold">Sign in to Ting</p>

            <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your institution email address"
                            className="w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
                <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full shadow-md cursor-pointer"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </Button>
                <p className="text-center">Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link></p>
            </form>
        </div>
    );
}