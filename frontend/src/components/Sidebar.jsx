
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Sidebar = ({ showAuthors = true }) => {
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
        // Fetch Categories
        axios.get(`${API_BASE_URL}/api/v1/categories/`)
            .then(res => setCategories(res.data.results || res.data))
            .catch(err => console.error(err));

        // Fetch Users
        axios.get(`${API_BASE_URL}/api/v1/users/`)
            .then(res => setUsers(res.data.results || res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <aside className="sidebar">
            <div style={{ position: "sticky", top: "100px" }}>
                <div style={{ marginBottom: "40px" }}>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "20px", display: "inline-block" }}>Categories</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {categories.map(cat => (
                            <Link to={`/?category=${cat.id}`} key={cat.id} style={{
                                backgroundColor: "white",
                                padding: "8px 16px",
                                borderRadius: "30px",
                                fontSize: "0.85rem",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                border: "1px solid #edf2f7",
                                color: "#4a5568",
                                fontWeight: "500"
                            }}>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {showAuthors && (
                    <div>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "20px", display: "inline-block" }}>Authors</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {users.map(user => (
                                <Link to={`/?author=${user.id}`} key={user.id} style={{ display: "flex", alignItems: "center", gap: "12px", transition: "transform 0.2s" }}>
                                    <div style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        backgroundColor: "#cbd5e0",
                                        backgroundImage: user.avatar ? `url(${user.avatar})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}></div>
                                    <div>
                                        <span style={{ display: "block", color: "#2d3748", fontWeight: "600", fontSize: "0.95rem" }}>{user.name || user.username || "Unknown Author"}</span>
                                        <span style={{ display: "block", color: "#718096", fontSize: "0.8rem" }}>{user.bio ? user.bio.substring(0, 30) + '...' : 'Reader & Writer'}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
