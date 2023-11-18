import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import Validation from './LoginValidation';


function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInput = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({}); // Effacez les erreurs précédentes

        try {
            const response = await axios.post('http://localhost:8081/login',formData);
            console.log(response.data); // Affichez la réponse du serveur (par exemple, "Succès" ou "Échec")

            if (response.data === "Succès") {
                // Redirigez l'utilisateur vers la page d'accueil ou une autre page de succès
                navigate('/home');
            } else {
                // Gérez le cas d'échec de connexion ici
                // Vous pouvez également définir un état d'erreur si nécessaire
                
            }
        } catch (error) {
            console.error(error);
            // Gérez les erreurs de requête ici
            // Vous pouvez également définir un état d'erreur si nécessaire
        }
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
                            className='form-control rounded-0'
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong> </label>
                        <input
                            type='password'
                            placeholder='Enter password '
                            name='password'
                            value={formData.password}
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'><strong>Log in</strong></button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create Account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login;
