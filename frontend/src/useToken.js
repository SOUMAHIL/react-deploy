import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        return JSON.parse(tokenString);
    };

    const [token, setToken] = useState(getToken);

    const saveToken = userToken => {
        return new Promise(resolve => {
            localStorage.setItem('token', JSON.stringify(userToken));
            setToken(userToken);
            resolve();
        });
    };

    return {
        setToken: saveToken,
        token,
    };
}