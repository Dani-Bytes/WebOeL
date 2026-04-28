import React, { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import AdminLogin from './components/AdminLogin';
import './index.css';

export default function App() {
  const [tab, setTab] = useState(0); // 0 = student, 1 = admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <>
      {/* ── Header ── */}
      <header className="site-header">
        <div className="header-inner">
          <span className="site-brand">📋 FeedbackHub</span>
          <nav className="tab-bar">
            <button
              className={`tab-btn ${tab === 0 ? 'active' : ''}`}
              onClick={() => setTab(0)}
            >
              Submit Feedback
            </button>
            <button
              className={`tab-btn ${tab === 1 ? 'active' : ''}`}
              onClick={() => setTab(1)}
            >
              Admin Panel
            </button>
          </nav>
          {tab === 1 && isAdminLoggedIn && (
            <button className="logout-btn" onClick={() => setIsAdminLoggedIn(false)}>
              Logout
            </button>
          )}
        </div>
      </header>

      {/* ── Page ── */}
      <div className="page-wrapper">
        {tab === 0 && (
          <>
            <h1 className="page-title">Student Feedback Management System</h1>
            <div className="two-col">
              <FeedbackForm onSubmitSuccess={() => setRefreshTrigger((p) => p + 1)} />
              <FeedbackList refreshTrigger={refreshTrigger} />
            </div>
          </>
        )}

        {tab === 1 && (
          <>
            <h1 className="page-title">Admin Panel</h1>
            {!isAdminLoggedIn ? (
              <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
            ) : (
              <FeedbackList refreshTrigger={refreshTrigger} showTitle />
            )}
          </>
        )}
      </div>
    </>
  );
}
