import logo from './logo.svg';
import './css/App.css';
import Login from './pages/auth/Login';
import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import Signup from './pages/auth/Signup';
import Home from './pages/Home';
import CreatePatient from './pages/patients/CreatePatient';
import ShowPatient from './pages/patients/ShowPatient';
import Update from './pages/patients/EditPatient';
import {AuthProvider, useAuth} from "./AuthContext";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function ProtectedRoute() {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace/>;
    }

    return <Outlet/>;
}

function App() {
    return (
        <AuthProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div>
                    <BrowserRouter>
                        <Routes>
                            <Route path='/login' element={<Login/>}></Route>
                            <Route path='/signup' element={<Signup/>}></Route>
                            <Route element={<ProtectedRoute/>}>
                                <Route path='/' element={<Home/>}></Route>
                                <Route path='/patients/create' element={<CreatePatient/>}></Route>
                                <Route path='/patients/:id' element={<ShowPatient/>}></Route>
                                <Route path='/patients/:id/edit' element={<Update/>}></Route>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </div>
            </LocalizationProvider>
        </AuthProvider>
    )
}

export default App;
