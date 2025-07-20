import type { ReactElement } from "react";
import OnboardingHeader from "./onboarding_header";

interface AuthLayoutProps {
    children: ReactElement;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="h-screen flex items-center justify-center bg-blue-50 p-4">
            <div className="flex items-center overflow-hidden shadow-md rounded-2xl bg-white">
                <div className="h-[620px] flex-shrink-0 hidden md:block">
                    <img src="./src/assets/onboarding_image.png" alt="Onboarding image" className="max-w-sm object-cover h-full" />
                </div>
                <div className="p-8 max-w-sm grid gap-8">
                    <OnboardingHeader />
                    {children}
                </div>
            </div>
        </div>

    );
}