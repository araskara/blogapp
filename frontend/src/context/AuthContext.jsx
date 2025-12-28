import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // Check expiration? Standard JWT has 'exp'
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp < currentTime) {
                        logout();
                    } else {
                        // We can decode user info from token if available, or just set true/some basics
                        // For simplicity, let's assume we are logged in. 
                        // If we need user details (name, avatar), we might need an endpoint /api/v1/me/
                        // For now, let's just store the username from the token or a placeholder
                        setUser({
                            id: decoded.user_id,
                            username: decoded.username || 'User'
                        });
                        // Set default axios header from valid token
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }
                } catch (error) {
                    console.error("Invalid token", error);
                    logout();
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (username, password) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
            const response = await axios.post(`${API_BASE_URL}/api/token/`, {
                username,
                password
            });
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Decode to get user info immediately
            const decoded = jwtDecode(access);
            setUser({
                id: decoded.user_id,
                username: username
            }); // or decoded info

            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
