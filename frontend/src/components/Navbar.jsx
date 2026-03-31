import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Activity } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-emerald-600 text-white shadow-md w-full z-10 p-4 shrink-0 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-wide">
                <Activity size={24} />
                SmartHealth
            </Link>

            {user ? (
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-500 px-3 py-1 rounded-full text-sm font-medium">
                        {user.username} ({user.role})
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-1 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex gap-4 text-sm font-medium">
                    <Link to="/login" className="hover:text-emerald-200 transition-colors">Login</Link>
                    <Link to="/register" className="bg-white text-emerald-600 px-4 py-1.5 rounded-full hover:bg-emerald-50 transition-colors">Register</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
