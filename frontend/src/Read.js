import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";


function Read(){
    
    const {id}= useParams();
    const [patient, setPatient] = useState([]);

        useEffect(() =>{
            axios.get("http://localhost:8081/patientdetails/"+id)
            .then(res => {
                console.log(res.data)
                setPatient(res.data[0]);
            })
            .catch(err => console.log(err));
         
        }, []);
    

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1 align="center">Patient Detail</h1>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>N_Natiional</th>
                                <th>TS</th>
                                <th>Sexe</th>
                                <th>Age</th>
                                <th>Date_Pre</th>
                                <th>Date_Ret_Result</th>
                                <th>Val_Cv</th>

                            </tr>
                        </thead>
                        <tbody>
                        
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}

export default Read;