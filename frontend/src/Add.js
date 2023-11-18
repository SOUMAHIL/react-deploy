import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Add(){
    const [patient, setPatient ] = useState({
      n_national: "",
      ts: "",
      sexe: "",
      age: "",
      date_pre: "",
      date_ret_result: "",
      val_cv: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value  } = e.target
        setPatient({...patient, [name] :value});
    };
    const handleClick = async (e) => {
        e.preventDefault();
        try {
           await axios.post("http://localhost:8081/patient", patient);
           navigate("/home");

        }catch (err) {
            console.log(err);

        }
    };

    return(
        <div className="container">
        <h2 className="W-100 d-flex justify-content-center p-3">ADD NEW Patient</h2>
           <div className="row">
            <div className="col-md-12">
                <h3>Add Your Detail</h3>
                <form>
                    <div className="mb-3 mt-3">
                        <label className="form-label">N_National</label>
                        <input type="text" placeholder="Enter Num National" id="n_national" name="n_national" className="form-control"onChange={handleChange} required ></input>
                    </div>
                    <div className="mb-3 mt-3">
                        <label className="form-label">Ts</label>
                        <input type="text" placeholder="Enter  TS" id="ts" name="ts" className="form-control" onChange={handleChange} required></input>
                    </div>
                    <div className="mb-3 mt-3">
                        <label className="form-label">Sexe</label>
                        <input type="text" placeholder="Enter Sexe" id="sexe" name="sexe" className="form-control" onChange={handleChange} required></input>
                    </div>
                    <div className="mb-3 mt-3">
                        <label className="form-label">Age</label>
                        <input type="text" placeholder="Enter Age" id="age" name="age" className="form-control" onChange={handleChange} required ></input>
                    </div>
                    <div className="mb-3 mt-3">
                        <label className="form-label">Date De Prelevement</label>
                        <input type="date" placeholder="Enter Date of prelevement" id="date_pre" name="date_pre" className="form-control" onChange={handleChange} required></input>
                    </div>
                    <div className="mb-3 mt-3">
                        <label className="form-label">Date  Retour Resultat</label>
                        <input type="date" placeholder="Enter " id="date_ret_result" name="date_ret_result" className="form-control"onChange={handleChange}  ></input>
                    </div>
                    <div className="mb-3 mt-3">
                        <label className="form-label">Val_Cv</label>
                        <input type="text" placeholder="Enter Val_Cv" id="val_cv" name="val_cv" className="form-control" onChange={handleChange} ></input>
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={handleClick}> Add Patient</button>
                    <Link to="/Home">see all Home</Link>
                </form>

            </div>
           </div>
        </div>
    )
}

export default Add;




