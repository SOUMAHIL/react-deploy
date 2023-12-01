import { createContext, useContext } from 'react';
import useToken from "./useToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { token, setToken } = useToken();

    const login = (newToken) => setToken(newToken);
    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);