import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    emailValidator,
    passwordValidator,
} from "../components/auth/Validator";
import useAxios from "../../api/axios";
import useToken from "../../hooks/useToken";
import {useAuth} from "../../AuthContext";
import Validation from "../components/auth/LoginValidation";

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const {login} = useAuth();
    const axios = useAxios();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length === 0 && submitting) {
            finishSubmit();
        }
    }, [errors]);

    const handleInput = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    }

    const finishSubmit = async () => {
        console.log("login")
        const response = await axios.post('login', formData).then((response) => {
            console.log(response);
            login(response.data);
            navigate('/');
        }).catch((error) => {
            console.log(error);
            alert("Erreur lors de la connexion: " + error.response.data)
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors(Validation(formData));
        setSubmitting(true);
    }

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign-In</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input
                            type='email'
                            placeholder='Enter Email'
                            name='email'
                            value={formData.email}
                            onChange={handleInput}
                            className={'form-control rounded-0 ' + (errors.email ? 'is-invalid' : '')}
                        />
                        <div className='text-danger'>{errors.email}</div>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong> </label>
                        <input
                            type='password'
                            placeholder='Enter password '
                            name='password'
                            value={formData.password}
                            onChange={handleInput}
                            className={'form-control rounded-0 ' + (errors.password ? 'is-invalid' : '')}
                        />
                        <div className='text-danger'>{errors.password}</div>
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'><strong>Log in</strong></button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create
                        Account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login;
