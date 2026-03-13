import { createContext, useContext, useState, useEffect } from "react";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'

import { auth } from "../../firebaseconfig"
import { LogOut, User } from "lucide-react";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    {/** Sign in function*/}
    async function signUp(email, password) {
        setError("");
        try {
            return await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err.message);
            throw err;
        }       
    }
    {/** login in function*/}
    async function login(email, password) {
      setError("");
      try {
        return await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    }

    {/** logout in function*/}
    
    async function logout() {
      setError("");
      try {
        return await LogOut(auth);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    }

    {/**usbscribe user function */ }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        })
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        logout,
        signUp,
        login,
        loading
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}