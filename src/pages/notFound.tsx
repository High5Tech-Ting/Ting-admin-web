import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/dashboard");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <Card className="max-w-lg w-full p-8 text-center space-y-6 shadow-lg">
                <div className="space-y-4">
                    <div className="text-8xl font-bold text-gray-300 select-none">
                        404
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Page Not Found
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                        Sorry, we couldn't find the page you're looking for.
                        The page might have been moved, deleted, or you might have entered the wrong URL.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                    <Button
                        onClick={handleGoHome}
                        className="w-full sm:w-auto min-w-[120px]"
                    >
                        Go to Dashboard
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleGoBack}
                        className="w-full sm:w-auto min-w-[120px]"
                    >
                        Go Back
                    </Button>
                </div>
            </Card>
        </div>
    );
}