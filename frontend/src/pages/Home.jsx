
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    const categoryId = searchParams.get("category");
    const authorId = searchParams.get("author");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        let url = `${API_BASE_URL}/api/v1/`;
        const params = {};

        if (categoryId) params.categories = categoryId;
        if (authorId) params.author = authorId;

        setLoading(true);
        axios
            .get(url, { params })
            .then((response) => {
                setPosts(response.data.results || response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setLoading(false);
            });
    }, [categoryId, authorId]);

    if (loading) return <div className="container" style={{ paddingTop: '60px' }}>Loading...</div>;

    return (
        <>
            <div className="container home-layout">
                {/* Main Feed */}
                <div className="main-feed">

                    {/* Filter Header */}
                    {(categoryId || authorId) && (
                        <div style={{ marginBottom: "30px" }}>
                            <h3 style={{ fontSize: "1.5rem" }}>
                                {categoryId ? "Viewing Category" : "Viewing Author"}
                                <Link to="/" style={{ fontSize: "0.9rem", color: "#5d7fb9", marginLeft: "15px" }}>(Clear Filter)</Link>
                            </h3>
                        </div>
                    )}

                    <div style={{ display: "grid", gap: "40px" }}>
                        {posts.length === 0 ? (
                            <div>No posts found.</div>
                        ) : (
                            posts.map((post) => (
                                <article key={post.id} className="post-card">
                                    {post.image && (
                                        <Link to={`/posts/${post.slug || post.id}`}>
                                            <img src={post.image} alt={post.title} className="card-image" />
                                        </Link>
                                    )}
                                    <div className="card-content">
                                        <div className="card-meta">
                                            {post.categories && post.categories.length > 0 ? post.categories[0].name : "General"} · {post.read_time} min read
                                        </div>
                                        <Link to={`/posts/${post.slug || post.id}`}>
                                            <h2 dir="auto" className="card-title" style={{ fontFamily: "var(--font-farsi), var(--font-heading)" }}>{post.title}</h2>
                                        </Link>
                                        <p dir="auto" style={{ color: "#4a5568", marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", fontFamily: "var(--font-farsi), var(--font-main)" }}>
                                            {post.body}
                                        </p>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#ddd",
                                                    backgroundImage: post.author?.avatar ? `url(${post.author.avatar})` : 'none',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }} />
                                                <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{post.author?.name || post.author?.username}</span>
                                            </div>
                                            <Link to={`/posts/${post.slug || post.id}`} className="btn-read">
                                                Read Article &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <Sidebar />
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Wrize. All rights reserved.</p>
                    <a href={`${API_BASE_URL || "http://127.0.0.1:8000"}/admin/`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "#cbd5e0", textDecoration: "none" }}>Admin Login</a>
                </div>
            </footer>
        </>
    );
};

export default Home;
