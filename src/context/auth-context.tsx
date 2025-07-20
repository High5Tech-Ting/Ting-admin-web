import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

type AuthContextType = {
    currentUser: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    loading: true,
});

/* eslint-disable-next-line react-refresh/only-export-components */
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}