import React, {useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import useAxios from "../../api/axios";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";

function EditPatient() {
    const [patient, setPatient] = useState({
        n_national: "",
        ts: "",
        sexe: "",
        age: "",
        date_pre: "",
        date_ret_result: "",
        val_cv: ""
    });

    const navigate = useNavigate();
    const axios = useAxios();
    const params = useParams()


    useEffect(() => {
        const getPatient = async () => {
            const res = await axios.get(`patients/${params.id}`);
            res.data[0].date_pre = dayjs(res.data[0].date_pre).format("YYYY-MM-DD");
            res.data[0].date_ret_result = dayjs(res.data[0].date_ret_result).format("YYYY-MM-DD");
            setPatient(res.data[0])
        };
        getPatient();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target
        setPatient({...patient, [name]: value});
    };
    const handleClick = async (e) => {
        e.preventDefault();
        await axios.put("patients/" + params.id, patient).then((res) => {
            navigate("/");
        }).catch((err) => {
            console.log(err);
        });
    };

    return (
        <div className="container">
            <h2 className="W-100 d-flex justify-content-center p-3">Edit Patient</h2>
            <div className="row">
                <div className="col-md-12">
                    <h3>Edit Details</h3>
                    <form>
                        <div className="mb-3 mt-3">
                            <label className="form-label">N_National</label>
                            <input type="text" placeholder="Enter Num National" id="n_national" name="n_national"
                                   className="form-control" onChange={handleChange} required
                                   value={patient.n_national}/>
                        </div>
                        <div className="mb-3 mt-3">
                            <label className="form-label">Ts</label>
                            <input type="text" placeholder="Enter  TS" id="ts" name="ts" className="form-control"
                                   onChange={handleChange} required value={patient.ts}/>
                        </div>
                        <div className="mb-3 mt-3">
                            <label className="form-label">Sexe</label>
                            <input type="text" placeholder="Enter Sexe" id="sexe" name="sexe" className="form-control"
                                   onChange={handleChange} required value={patient.sexe}/>
                        </div>
                        <div className="mb-3 mt-3">
                            <label className="form-label">Age</label>
                            <input type="text" placeholder="Enter Age" id="age" name="age" className="form-control"
                                   onChange={handleChange} required value={patient.age}/>
                        </div>
                        <div className="mb-3 mt-3">
                            <label className="form-label">Date De Prelevement</label>
                            <DatePicker className="w-100" id="date_pre" name="date_pre"
                                        onChange={(newValue) => setPatient({...patient, date_pre: dayjs(newValue).format("YYYY-MM-DD")})}
                                        value={dayjs(patient.date_pre)}/>
                        </div>
                        <div className="mb-3 mt-3">
                            <label className="form-label">Date Retour Resultat</label>
                            <div>
                                <DatePicker className="w-100" id="date_ret_result" name="date_ret_result"
                                            onChange={(newValue) => setPatient({
                                                ...patient,
                                                date_ret_result: dayjs(newValue).format("YYYY-MM-DD")
                                            })}
                                            value={dayjs(patient.date_ret_result)}/>
                            </div>
                        </div>
                        <div className="mb-3 mt-3">
                            <label className="form-label">Val_Cv</label>
                            <input type="text" placeholder="Enter Val_Cv" id="val_cv" name="val_cv"
                                   className="form-control" onChange={handleChange} value={patient.val_cv}/>
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={handleClick}> Edit Patient</button>
                        <Link to="/Home">see all Home</Link>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default EditPatient;




