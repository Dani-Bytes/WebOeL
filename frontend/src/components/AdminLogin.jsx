import React, { useState } from 'react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

export default function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            onLogin();
        } else {
            setError('Invalid credentials. Try: admin / admin123');
        }
    };

    return (
        <div className="admin-center">
            <div className="admin-card">
                <h2>Admin Login</h2>
                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 16 }}>
                        <span>{error}</span>
                        <button className="alert-close" onClick={() => setError('')}>✕</button>
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <div className="admin-field">
                        <label htmlFor="admin-user">Username</label>
                        <input
                            id="admin-user"
                            className="form-control"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                        />
                    </div>
                    <div className="admin-field">
                        <label htmlFor="admin-pass">Password</label>
                        <div className="pw-wrap">
                            <input
                                id="admin-pass"
                                type={showPass ? 'text' : 'password'}
                                className="form-control"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="pw-toggle"
                                onClick={() => setShowPass((s) => !s)}
                                aria-label="Toggle password visibility"
                            >
                                {showPass ? '🙈' : '👁'}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="submit-btn" style={{ width: '100%', marginTop: 8 }}>
                        Login
                    </button>
                </form>
                <p className="admin-hint">
                    Hint: username <span>admin</span> · password <span>admin123</span>
                </p>
            </div>
        </div>
    );
}
