import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'settings'

    // Password Change State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
        if (user && user.id) {
            axios.get(`${API_BASE_URL}/api/v1/?author=${user.id}`)
                .then(res => {
                    setPosts(res.data.results || res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch user posts", err);
                    setLoading(false);
                });
        }
    }, [user]);

    const handleDelete = async (slug) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
                await axios.delete(`${API_BASE_URL}/api/v1/${slug}/`);
                setPosts(posts.filter(p => p.slug !== slug));
            } catch (err) {
                console.error("Failed to delete post", err);
                alert("Failed to delete post.");
            }
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage('');

        if (newPassword !== confirmPassword) {
            setPasswordMessage('Error: Passwords do not match');
            return;
        }

        try {
            // Correct Endpoint: /api/v1/change-password/
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
            await axios.put(`${API_BASE_URL}/api/v1/change-password/`, {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_new_password: confirmPassword
            });
            setPasswordMessage('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Change password failed", error);
            const errorData = error.response?.data || {};
            // Extract first error message from any field
            const msg = Object.values(errorData).flat()[0] || 'Failed to change password.';
            setPasswordMessage(`Error: ${msg}`);
        }
    };

    if (!user) return <div className="container" style={{ marginTop: '40px' }}>Please login to view dashboard.</div>;
    if (loading) return <div className="container" style={{ marginTop: '40px' }}>Loading your posts...</div>;

    return (
        <div className="container" style={{ marginTop: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>My Dashboard</h1>
                {activeTab === 'posts' && (
                    <Link
                        to="/write"
                        style={{
                            backgroundColor: '#5d7fb9',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            fontWeight: '500'
                        }}
                    >
                        Create New Post
                    </Link>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '30px' }}>
                <button
                    onClick={() => setActiveTab('posts')}
                    style={{
                        padding: '10px 20px',
                        borderBottom: activeTab === 'posts' ? '2px solid #5d7fb9' : 'none',
                        color: activeTab === 'posts' ? '#2b6cb0' : '#4a5568',
                        fontWeight: '600',
                        background: 'none',
                        border: 'none',
                        borderBottomWidth: activeTab === 'posts' ? '2px' : '0',
                        cursor: 'pointer',
                        marginRight: '20px'
                    }}
                >
                    My Posts
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                        padding: '10px 20px',
                        borderBottom: activeTab === 'settings' ? '2px solid #5d7fb9' : 'none',
                        color: activeTab === 'settings' ? '#2b6cb0' : '#4a5568',
                        fontWeight: '600',
                        background: 'none',
                        border: 'none',
                        borderBottomWidth: activeTab === 'settings' ? '2px' : '0',
                        cursor: 'pointer'
                    }}
                >
                    Settings
                </button>
            </div>

            {/* Content */}
            {activeTab === 'posts' ? (
                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Title</th>
                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Date</th>
                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Status</th>
                                <th style={{ padding: '15px', textAlign: 'right', fontWeight: '600', color: '#4a5568' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
                                        You haven't written any posts yet.
                                    </td>
                                </tr>
                            ) : (
                                posts.map(post => (
                                    <tr key={post.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                        <td style={{ padding: '15px' }}>
                                            <Link to={`/posts/${post.slug}`} style={{ fontWeight: '500', color: '#2d3748' }}>
                                                {post.title}
                                            </Link>
                                        </td>
                                        <td style={{ padding: '15px', color: '#718096' }}>
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                background: '#c6f6d5',
                                                color: '#22543d',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                textTransform: 'capitalize'
                                            }}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'right' }}>
                                            <Link
                                                to={`/write?edit=${post.slug}`}
                                                style={{ marginRight: '15px', color: '#3182ce', fontWeight: '500' }}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.slug)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#e53e3e',
                                                    fontWeight: '500',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '30px', maxWidth: '500px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Change Password</h2>
                    {passwordMessage && (
                        <div style={{
                            padding: '10px',
                            marginBottom: '20px',
                            borderRadius: '5px',
                            backgroundColor: passwordMessage.startsWith('Error') ? '#fed7d7' : '#c6f6d5',
                            color: passwordMessage.startsWith('Error') ? '#c53030' : '#22543d'
                        }}>
                            {passwordMessage}
                        </div>
                    )}
                    <form onSubmit={handleChangePassword}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568' }}>Old Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #e2e8f0' }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568' }}>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #e2e8f0' }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568' }}>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #e2e8f0' }}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#5d7fb9',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                border: 'none',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
