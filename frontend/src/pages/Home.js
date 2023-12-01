import React, {useEffect, useState} from "react";
import '../css/App.css';
import {FaBars, FaTimes} from "react-icons/fa";
import {useRef} from "react";
import {Form, Link, useNavigate} from "react-router-dom";
import useAxios from "../api/axios";
import useToken from "../hooks/useToken";
import {useAuth} from "../AuthContext";

function Home() {
    const [patient, setPatient] = useState([]);
    const [search, setSearch] = useState('');
    const axios = useAxios();
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllPatient = async () => {
            try {
                const res = await axios.get("patients")
                setPatient(res.data);
            } catch (err) {
                console.log(err)
            }
        };
        fetchAllPatient();
    }, []);

    const navRef = useRef();

    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete("patients/" + id)
            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    };

    const signOut = async () => {
        logout();
        navigate("/login")
    }


    return (
        <div>
            <div className="header">
                <header>
                    <h3>CMSDS</h3>
                    <nav ref={navRef}>
                        <a href="#">HOME</a>
                        <a href="#">Dashboard</a>
                        <a href="#">Profil</a>
                        <a href="#" onClick={signOut}>Sign out</a>
                        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                            <FaTimes/>
                        </button>
                    </nav>
                    <button className="nav-btn" onClick={showNavbar}>
                        <FaBars/>
                    </button>
                </header>
            </div>
            <div className="container">
                <h2 className="W-100 d-flex justify-content-center p-3">SAISIR DES PRELEVEMENTS DE CV</h2>
                <div className="row">
                    <div className="col-md-12">
                        <p><Link to="" className="btn btn-secondary mb-2">To Print</Link></p>
                        <p><Link to="" className="btn btn-success mb-2">Send to excel</Link></p>
                        <p><Link to="/patients/create" className="btn btn-warning mb-2">add new Patient</Link></p>
                        <input type="text" placeholder="Numero National..." className="Search"
                               onChange={(e) => setSearch(e.target.value)}></input>
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>N_Natiional</th>
                                <th>Ts</th>
                                <th>Sexe</th>
                                <th>Age</th>
                                <th>Date_Pre</th>
                                <th>Date_Ret_Result</th>
                                <th>Val Cv</th>
                                <th>Actions</th>

                            </tr>
                            </thead>
                            <tbody>
                            {
                                patient.filter((patient) => {
                                            return search.toLocaleLowerCase() === ''
                                                ? patient
                                                : patient.n_national.toLocaleLowerCase().includes(search);

                                        }
                                    )
                                    .map((patient, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{patient.n_national}</td>
                                                <td>{patient.ts}</td>
                                                <td>{patient.sexe}</td>
                                                <td>{patient.age}</td>
                                                <td>{patient.date_pre}</td>
                                                <td>{patient.date_ret_result}</td>
                                                <td>{patient.val_cv}</td>
                                                <td>

                                                    <Link to={"/patients/" + patient.id}
                                                          className="btn btn-success mx-2">Read</Link>
                                                    <Link to={"/patients/" + patient.id + "/edit"}
                                                          className="btn btn-info mx-2">Update</Link>
                                                    <button onClick={e => handleDelete(patient.id)}
                                                            className="btn btn-danger">Delete
                                                    </button>

                                                </td>

                                            </tr>
                                        )

                                    })
                            }
                            </tbody>

                        </table>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;