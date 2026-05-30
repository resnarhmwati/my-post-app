import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    async function getUser() {
        try {
            const res = await fetch('/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
            } else if (res.status === 401) {
                // Jika token mati, bersihkan
                setToken(null);
                localStorage.removeItem('token');
            }
        } catch (err) { console.error(err); }
    }

    useEffect(() => {
        if (token) getUser();
    }, [token]);

    return (
        <AppContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AppContext.Provider>
    );
}
