import React, { useEffect, useState, useCallback } from 'react';
import { getAllFeedbacks, getFeedbacksBySubject, getSubjects } from '../api/feedbackApi';

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };

function StarsCell({ rating }) {
    return (
        <span className="stars-cell">
            {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= rating ? 'filled-star' : ''}>
                    {s <= rating ? '★' : '☆'}
                </span>
            ))}
            <span className="count">({rating})</span>
        </span>
    );
}

const LIMIT = 8;

export default function FeedbackList({ refreshTrigger, showTitle }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selected, setSelected] = useState('');
    const [avgRating, setAvgRating] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSubjects = useCallback(async () => {
        try { const r = await getSubjects(); setSubjects(r.data.data); } catch (_) { }
    }, []);

    const fetchFeedbacks = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            if (selected) {
                const r = await getFeedbacksBySubject(selected);
                setFeedbacks(r.data.data);
                setAvgRating(r.data.averageRating);
                setTotal(r.data.data.length);
                setTotalPages(1);
            } else {
                const r = await getAllFeedbacks(page, LIMIT);
                setFeedbacks(r.data.data);
                setAvgRating(null);
                setTotal(r.data.pagination.total);
                setTotalPages(r.data.pagination.pages);
            }
        } catch (_) {
            setError('Failed to load feedbacks. Is the server running?');
        } finally { setLoading(false); }
    }, [selected, page]);

    useEffect(() => { fetchSubjects(); }, [fetchSubjects]);
    useEffect(() => { fetchFeedbacks(); }, [fetchFeedbacks, refreshTrigger]);

    // pagination info
    const startItem = total === 0 ? 0 : (page - 1) * LIMIT + 1;
    const endItem = Math.min(page * LIMIT, total);

    return (
        <div>
            {showTitle && <h2 className="section-title">Feedback List</h2>}
            {!showTitle && <h2 className="section-title">Feedback List</h2>}

            <div className="list-card">
                {/* Filter */}
                <div className="filter-row">
                    <label htmlFor="subjectFilter">Filter by Subject:</label>
                    <select
                        id="subjectFilter"
                        className="filter-select"
                        value={selected}
                        onChange={(e) => { setSelected(e.target.value); setPage(1); }}
                    >
                        <option value="">All Subjects</option>
                        {subjects.map((s) => (
                            <option key={s._id} value={s._id}>{s._id} ({s.count})</option>
                        ))}
                    </select>
                </div>

                {/* Avg rating banner */}
                {selected && avgRating !== null && (
                    <div className="avg-banner">
                        <span className="avg-score">{avgRating}</span>
                        <span>
                            Average rating for <strong>{selected}</strong> out of 5
                            &nbsp;— {RATING_LABELS[Math.round(avgRating)] ?? ''}
                        </span>
                    </div>
                )}

                {/* Table */}
                {loading ? (
                    <div className="state-box">Loading…</div>
                ) : error ? (
                    <div className="state-box" style={{ color: '#c0392b' }}>{error}</div>
                ) : feedbacks.length === 0 ? (
                    <div className="state-box">
                        <span className="emoji">📭</span>
                        No feedback found{selected ? ` for "${selected}"` : ''}.
                    </div>
                ) : (
                    <div className="feedback-table-wrap">
                        <table className="feedback-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Subject</th>
                                    <th>Rating</th>
                                    <th>Comments</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacks.map((fb) => (
                                    <tr key={fb._id}>
                                        <td>{fb.studentName}</td>
                                        <td>{fb.subject}</td>
                                        <td><StarsCell rating={fb.rating} /></td>
                                        <td style={{ color: fb.comments ? '#222' : '#aaa', fontStyle: fb.comments ? 'normal' : 'italic' }}>
                                            {fb.comments || '—'}
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap', color: '#666' }}>
                                            {new Date(fb.createdAt).toLocaleString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && (
                    <div className="pagination-row">
                        <span>
                            {total === 0
                                ? 'No feedbacks found'
                                : `Showing ${startItem} to ${selected ? total : endItem} of ${total} feedback${total !== 1 ? 's' : ''}`}
                        </span>
                        {!selected && totalPages > 1 && (
                            <div className="page-btns">
                                <button
                                    className="page-btn"
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    ‹ Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        className={`page-btn ${page === p ? 'active' : ''}`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    className="page-btn"
                                    disabled={page === totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next ›
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
