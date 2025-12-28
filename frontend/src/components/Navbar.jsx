
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="brand">
                    Wrize.
                </Link>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <Link to="/" style={{ fontWeight: "500", color: "#4a5568" }}>Home</Link>
                    <Link to="/" style={{ fontWeight: "500", color: "#4a5568" }}>Topics</Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" style={{ fontWeight: "500", color: "#4a5568" }}>Dashboard</Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: "500",
                                    color: "#e53e3e",
                                    fontSize: '1rem',
                                    padding: 0
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" style={{ fontWeight: "500", color: "#2b6cb0" }}>Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
