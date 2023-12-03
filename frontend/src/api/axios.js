import axios from 'axios'
import useToken from "../hooks/useToken";
import {useNavigate} from "react-router-dom";
import useUser from "../hooks/useUser";
import {useAuth} from "../AuthContext";

export default function useAxios() {
    const { token, setToken } = useToken();
    const navigate = useNavigate();
    const { user } = useUser();
    const { logout } = useAuth();

    const instance = axios.create({
        baseURL: 'http://localhost:8081',
        withCredentials: true,
    });

    instance.interceptors.request.use(
        config => {
            if(token){
                config.headers['Authorization'] = token;
                config.headers['user'] = user;
            }
            return config;
        },
        error => {
            Promise.reject(error);
        }
    );

    instance.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (error.response.status === 401){
            logout();
            navigate("/login")
        }
        return Promise.reject(error);
    });

    return instance;
}


