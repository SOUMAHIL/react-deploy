import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Validation from "../components/auth/SignupValidation";
import useAxios from "../../api/axios";

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const axios = useAxios();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length === 0 && submitting) {
            finishSubmit();
        }
    }, [errors]);

    const finishSubmit = async () => {
        const response = await axios.post('signup', formData).then((response) => {
            console.log(response);
            navigate('/');
        }).catch((error) => {
            console.log(error);
            alert("Erreur lors de la création de compte: " + error.response.data)
        });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(formData));
        setSubmitting(true);
    }

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign-Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='name'><strong>Name</strong></label>
                        <input
                            type='text'
                            placeholder='Enter Name'
                            name='name'
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className={'form-control rounded-0 ' + (errors.name ? 'is-invalid' : '')}
                        />
                        <div className='text-danger'>{errors.name}</div>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input
                            type='text'
                            placeholder='Enter Email'
                            name='email'
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className={'form-control rounded-0 ' + (errors.email ? 'is-invalid' : '')}
                        />
                        <div className='text-danger'>{errors.email}</div>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            name='password'
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className={'form-control rounded-0 ' + (errors.password ? 'is-invalid' : '')}
                        />
                        <div className='text-danger'>{errors.password}</div>
                    </div>
                    <button type="submit" className='btn btn-success w-100 rounded-0'><strong>Sign up</strong></button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/"
                          className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Login</Link>
                </form>
            </div>
        </div>
    )
}

export default Signup;