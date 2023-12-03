import React, { useState } from "react";
import { useEffect } from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import useAxios from "../../api/axios";


function ShowPatient(){
    const {id}= useParams();
    const [patient, setPatient] = useState([]);
    const axios = useAxios();

        useEffect(() =>{
            axios.get("patients/"+id)
            .then(res => {
                setPatient(res.data[0]);
            })
            .catch(err => console.log(err));
        }, []);

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <Link to={'/'} className="btn btn-primary" >Menu</Link>
                        <h1 align="center">Patient Detail</h1>
                        <Link to={`/patients/${patient.id}/edit`} className="btn btn-warning" >Edit</Link>
                    </div>

                    <div className="row row-cols-md-2 container my-5 mx-auto p-5 rounded-5 border g-3">
                        <div>
                            <div className="fw-bold">N_National</div>
                            <div>{patient.n_national}</div>
                        </div>
                        <div>
                            <div className="fw-bold">TS</div>
                            <div>{patient.ts}</div>
                        </div>
                        <div>
                            <div className="fw-bold">Sexe</div>
                            <div>{patient.sexe}</div>
                        </div>
                        <div>
                            <div className="fw-bold">Age</div>
                            <div>{patient.age}</div>
                        </div>
                        <div>
                            <div className="fw-bold">Date_Pre</div>
                            <div>{patient.date_pre}</div>
                        </div>
                        <div>
                            <div className="fw-bold">Date_Ret_Result</div>
                            <div>{patient.date_ret_result}</div>
                        </div>
                        <div>
                            <div className="fw-bold">Val_Cv</div>
                            <div>{patient.val_cv}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowPatient;