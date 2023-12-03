import { createContext, useContext } from 'react';
import useToken from "./hooks/useToken";
import useUser from "./hooks/useUser";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { token, setToken } = useToken();
    const { user, setUser } = useUser();

    const login = (data) => {
        setToken(data.token)
        setUser(data.user)
    };
    const logout = () => {
        setToken(null)
        setUser(null)
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);