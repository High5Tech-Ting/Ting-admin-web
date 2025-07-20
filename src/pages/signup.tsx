import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { signUpWithEmailAndPassword } from "@/firebase/auth";
import { getAuth, validatePassword } from "firebase/auth";
import { toast } from "sonner";

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const validPassword = await validatePassword(getAuth(), password);

        if (!validPassword.isValid) {
            toast.error("Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and symbols.");
            return;
        }

        try {
            setLoading(true);
            await signUpWithEmailAndPassword(email, password, name);
            toast.success("Account created successfully!");
            navigate("/home");
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to create an account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-xl font-semibold">Sign up for Ting</p>

            <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            className="w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </div>

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
                                autoComplete="new-password"
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

                    <div>
                        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className="w-full pr-10"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
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
                    {loading ? "Creating account..." : "Sign up"}
                </Button>
                <p className="text-center">Already have an account? <Link to="/signin" className="text-blue-500 hover:underline">Sign in</Link></p>
            </form>
        </div>
    );
}