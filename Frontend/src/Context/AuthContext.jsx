import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        const storedToken = sessionStorage.getItem("accessToken");
        const storedRole = sessionStorage.getItem("role");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setRole(storedRole);
        }
        setLoading(false);
    }, []);

    const login = (userData, accessToken, userRole) => {
        setUser(userData);
        setToken(accessToken);
        setRole(userRole);
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("role", userRole);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setRole(null);
        sessionStorage.clear();
    };

    return (
        <AuthContext.Provider
            value={{ user, role, token, loading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
