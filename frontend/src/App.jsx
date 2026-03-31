import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children, role }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
};

const DefaultRoute = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'PATIENT') return <Navigate to="/patient" />;
    if (user.role === 'DOCTOR') return <Navigate to="/doctor" />;
    return <div>Welcome!</div>;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <div className="flex-1 bg-slate-50">
                        <Routes>
                            <Route path="/" element={<DefaultRoute />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            
                            <Route path="/patient" element={
                                <PrivateRoute role="PATIENT">
                                    <PatientDashboard />
                                </PrivateRoute>
                            } />
                            
                            <Route path="/doctor" element={
                                <PrivateRoute role="DOCTOR">
                                    <DoctorDashboard />
                                </PrivateRoute>
                            } />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
