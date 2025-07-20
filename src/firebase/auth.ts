import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import app from "./config";

const auth = getAuth(app);
const db = getFirestore(app);

export const signUpWithEmailAndPassword = async (
    email: string,
    password: string,
    displayName: string
): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, {
            displayName
        });

        await setDoc(doc(db, "users", userCredential.user.uid), {
            displayName,
            email,
            createdAt: new Date(),
            uid: userCredential.user.uid
        });
    }
    return userCredential.user;
};

export const loginWithEmailAndPassword = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const logoutUser = async (): Promise<void> => {
    await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
};

export { auth };