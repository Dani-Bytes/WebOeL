import React, { useState } from 'react';
import { submitFeedback } from '../api/feedbackApi';

const SUBJECTS = [
    'Web Engineering',
    'Cloud Computing',
    'Linear Algebra',
    'Artificial Intelligence',
    'Human Computer Interaction',
    'Software Quality',
];

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };

function StarPicker({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;
    return (
        <div className="rating-row">
            <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        key={s}
                        type="button"
                        className={`star-btn ${s <= display ? 'filled' : ''}`}
                        onMouseEnter={() => setHovered(s)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => onChange(s)}
                        aria-label={`Rate ${s}`}
                    >
                        ★
                    </button>
                ))}
            </div>
            {value > 0 && (
                <span className="rating-label">{value} / 5 — {RATING_LABELS[value]}</span>
            )}
        </div>
    );
}

export default function FeedbackForm({ onSubmitSuccess }) {
    const [form, setForm] = useState({ studentName: '', subject: '', rating: 0, comments: '' });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.studentName.trim()) e.studentName = 'Name is required';
        else if (form.studentName.trim().length < 2) e.studentName = 'At least 2 characters';
        if (!form.subject) e.subject = 'Please select a subject';
        if (!form.rating) e.rating = 'Please select a rating';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const e2 = validate();
        setErrors(e2);
        if (Object.keys(e2).length) return;
        setLoading(true);
        setAlert(null);
        try {
            await submitFeedback(form);
            setAlert({ type: 'success', message: 'Feedback submitted successfully! Thank you.' });
            setForm({ studentName: '', subject: '', rating: 0, comments: '' });
            setErrors({});
            onSubmitSuccess?.();
        } catch (err) {
            const msgs = err.response?.data?.errors;
            const fallback = err.response?.data?.message || 'Failed to submit. Please try again.';
            setAlert({ type: 'error', message: msgs ? msgs.join(' | ') : fallback });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="section-title">Submit Feedback</h2>
            <div className="form-card">
                {alert && (
                    <div className={`alert alert-${alert.type}`}>
                        <span>{alert.message}</span>
                        <button className="alert-close" onClick={() => setAlert(null)}>✕</button>
                    </div>
                )}
                <form onSubmit={handleSubmit} noValidate>
                    {/* Student Name */}
                    <div className="form-row">
                        <label className="form-label">Student Name <span className="req">*</span></label>
                        <input
                            className={`form-control ${errors.studentName ? 'error' : ''}`}
                            placeholder="Enter your name"
                            value={form.studentName}
                            onChange={set('studentName')}
                        />
                    </div>
                    {errors.studentName && <p className="err-msg">{errors.studentName}</p>}

                    {/* Subject */}
                    <div className="form-row">
                        <label className="form-label">Subject <span className="req">*</span></label>
                        <select
                            className={`form-control ${errors.subject ? 'error' : ''}`}
                            value={form.subject}
                            onChange={set('subject')}
                        >
                            <option value="">Select a subject</option>
                            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    {errors.subject && <p className="err-msg">{errors.subject}</p>}

                    {/* Rating */}
                    <div className="form-row">
                        <label className="form-label">Rating <span className="req">*</span></label>
                        <StarPicker
                            value={form.rating}
                            onChange={(v) => { setForm((f) => ({ ...f, rating: v })); setErrors((e) => ({ ...e, rating: '' })); }}
                        />
                    </div>
                    {errors.rating && <p className="err-msg">{errors.rating}</p>}

                    {/* Comments */}
                    <div className="form-row">
                        <label className="form-label">Comments <span className="req" style={{ color: '#888', fontWeight: 400 }}>(Optional)</span></label>
                        <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Any additional comments..."
                            value={form.comments}
                            onChange={set('comments')}
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Submitting…' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
}
