import logo from './logo.svg';
import './css/App.css';
import Login from './pages/auth/Login';
import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import Signup from './pages/auth/Signup';
import Home from './pages/Home';
import Add from './pages/patients/Add';
import Read from './pages/patients/Read';
import Update from './pages/patients/Update';
import {AuthProvider, useAuth} from "./AuthContext";

function ProtectedRoute() {
    const { token } = useAuth();

    console.log(token)
    if (!token) {
        return <Navigate to="/login" replace/>;
    }

    return <Outlet/>;
}

function App() {
    return (
        <AuthProvider>
            <div>
                <BrowserRouter>
                    <Routes>
                        <Route path='/login' element={<Login/>}></Route>
                        <Route path='/signup' element={<Signup/>}></Route>
                        <Route element={<ProtectedRoute/>}>
                            <Route path='/' element={<Home/>}></Route>
                            <Route path='/add' element={<Add/>}></Route>
                            <Route path='/read/:id' element={<Read/>}></Route>
                            <Route path='/update/:id' element={<Update/>}></Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </AuthProvider>
    )
}

export default App;
