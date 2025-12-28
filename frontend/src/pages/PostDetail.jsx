
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const PostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
        axios
            .get(`${API_BASE_URL}/api/v1/${slug}/`)
            .then((response) => {
                setPost(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching post:", error);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <div className="container" style={{ marginTop: "40px" }}>Loading...</div>;
    if (!post) return <div className="container">Post not found</div>;

    return (
        <article className="container" style={{ marginTop: "60px", marginBottom: "100px", maxWidth: "800px" }}>
            {/* Back Link */}
            <Link to="/" style={{ display: "inline-block", marginBottom: "30px", fontSize: "0.9rem", color: "#718096", fontWeight: "500" }}>
                &larr; Back to Home
            </Link>

            {/* Header */}
            <h1 dir="auto" style={{ fontSize: "3rem", lineHeight: "1.2", marginBottom: "20px", fontFamily: "var(--font-farsi), var(--font-heading)" }}>
                {post.title}
            </h1>

            {/* Meta/Author */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "40px", borderBottom: "1px solid #eee", paddingBottom: "30px" }}>
                <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#e2e8f0",
                    backgroundImage: post.author?.avatar ? `url(${post.author.avatar})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }} />
                <div>
                    <div style={{ fontWeight: "600", color: "#2d3748" }}>{post.author?.name || post.author?.username}</div>
                    <div style={{ fontSize: "0.85rem", color: "#718096" }}>
                        {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} · {post.read_time} min read
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            {post.image && (
                <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: "100%", borderRadius: "12px", marginBottom: "50px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                />
            )}

            {/* Body Content */}
            <div dir="auto" style={{ fontSize: "1.25rem", lineHeight: "1.8", color: "#4a5568", fontFamily: "var(--font-farsi), var(--font-heading)" }}>
                {post.body.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index} style={{ marginBottom: "1.5em" }}>{paragraph}</p>
                ))}
            </div>
        </article>
    );
};

export default PostDetail;
