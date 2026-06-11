import React, { useEffect, useState } from 'react';
import { reviewApi, Review } from '../../../api/reviewApi';
import LuxuryPageHeader from '../../../components/Common/LuxuryPageHeader';
import LuxuryTable, { ColumnDef } from '../../../components/Common/LuxuryTable';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import LuxuryActionButton from '../../../components/Common/LuxuryActionButton';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryConfirmModal from '../../../components/Common/LuxuryConfirmModal';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import FashionLoader from '../../../components/Common/FashionLoader';
import { useToast } from '../../../context/ToastContext';
import './ReviewsScreen.css';
import { BASE_URL } from '../../../api/endpoint';

// Simple SVGs for Placeholders
const UserIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const ImageIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

const StarIcon = ({ fill = "none", className = "" }: { fill?: string, className?: string }) => (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill={fill} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const ReviewsScreen = () => {
    const { addToast } = useToast();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [totalCount, setTotalCount] = useState(0);

    // Modal States
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await reviewApi.getAllReviews(currentPage, rowsPerPage);
            if (res.success) {
                setReviews(res.data);
                setTotalCount(res.total);
            }
        } catch (error: any) {
            addToast('error', error.response?.data?.message || 'Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [currentPage, rowsPerPage]);

    // Derived filtered data (simple frontend filtering for now)
    const filteredReviews = reviews.filter(r => 
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleReplyClick = (review: Review) => {
        setSelectedReview(review);
        setReplyText(review.reply || '');
        setReplyModalOpen(true);
    };

    const handleDeleteClick = (review: Review) => {
        setSelectedReview(review);
        setDeleteModalOpen(true);
    };

    const submitReply = async () => {
        if (!selectedReview) return;
        if (!replyText.trim()) {
            addToast('error', "Reply text is required");
            return;
        }

        try {
            setSubmittingReply(true);
            const res = await reviewApi.replyToReview(selectedReview._id, replyText);
            if (res.success) {
                addToast('success', 'Reply submitted successfully');
                setReplyModalOpen(false);
                fetchReviews(); // Refresh table
            }
        } catch (error: any) {
            addToast('error', error.response?.data?.message || 'Failed to submit reply');
        } finally {
            setSubmittingReply(false);
        }
    };

    const confirmDelete = async () => {
        if (!selectedReview) return;
        try {
            setDeleting(true);
            const res = await reviewApi.deleteReview(selectedReview._id);
            if (res.success) {
                addToast('success', 'Review deleted successfully');
                setDeleteModalOpen(false);
                fetchReviews(); // Refresh table
            }
        } catch (error: any) {
            addToast('error', error.response?.data?.message || 'Failed to delete review');
        } finally {
            setDeleting(false);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="reviews-stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon 
                        key={star} 
                        className={`reviews-star ${star <= rating ? 'active' : ''}`} 
                        fill={star <= rating ? 'currentColor' : 'none'}
                    />
                ))}
            </div>
        );
    };

    const columns: ColumnDef<Review>[] = [
        {
            header: "Customer",
            key: "customer",
            width: "20%",
            render: (review: Review) => (
                <div className="reviews-profile-cell">
                    {review.customer?.avatar ? (
                        <img src={review.customer.avatar.startsWith('http') ? review.customer.avatar : `${BASE_URL}${review.customer.avatar}`} alt="Avatar" className="reviews-avatar" />
                    ) : (
                        <div className="reviews-avatar-placeholder"><UserIcon /></div>
                    )}
                    <div className="reviews-profile-info">
                        <span className="reviews-profile-name">{review.customer?.name || 'Unknown User'}</span>
                        <span className="reviews-profile-email">{review.customer?.email || 'No email'}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Product",
            key: "product",
            width: "20%",
            render: (review: Review) => (
                <div className="reviews-product-cell">
                    {review.product?.mainImage ? (
                        <img src={review.product.mainImage.startsWith('http') ? review.product.mainImage : `${BASE_URL}${review.product.mainImage}`} alt="Product" className="reviews-product-img" />
                    ) : (
                        <div className="reviews-product-img-placeholder"><ImageIcon /></div>
                    )}
                    <span className="reviews-product-name">{review.product?.name || 'Unknown Product'}</span>
                </div>
            )
        },
        {
            header: "Rating",
            key: "rating",
            width: "10%",
            render: (review: Review) => renderStars(review.rating)
        },
        {
            header: "Review",
            key: "comment",
            width: "25%",
            render: (review: Review) => (
                <div className="reviews-comment-cell">
                    <p className="reviews-comment-text">{review.comment}</p>
                    <span className="reviews-date">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            )
        },
        {
            header: "Status",
            key: "reply",
            width: "10%",
            render: (review: Review) => (
                <LuxuryStatusBadge 
                    label={review.reply ? 'Replied' : 'Pending'} 
                    variant={review.reply ? 'success' : 'warning'} 
                />
            )
        },
        {
            header: "Actions",
            key: "actions",
            width: "15%",
            render: (review: Review) => (
                <div className="reviews-actions-cell">
                    <LuxuryActionButton 
                        type="edit" 
                        title={review.reply ? "Edit Reply" : "Reply"}
                        onClick={() => handleReplyClick(review)} 
                    />
                    <LuxuryActionButton 
                        type="delete" 
                        title="Delete Review"
                        onClick={() => handleDeleteClick(review)} 
                    />
                </div>
            )
        }
    ];

    if (loading && reviews.length === 0) {
        return (
            <div className="reviews-loader-container">
                <FashionLoader message="Loading Reviews Archive..." />
            </div>
        );
    }

    return (
        <div className="reviews-container">
            <LuxuryPageHeader 
                title="Reviews & Ratings"
                subtitle="Moderate customer feedback and respond to reviews."
            />

            <div className="reviews-table-section">
                <LuxuryTable
                    columns={columns}
                    data={filteredReviews}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={setRowsPerPage}
                    emptyIcon="⭐"
                    emptyTitle="No Reviews Yet"
                    emptyDescription="When customers leave reviews for products, they will appear here."
                />
            </div>

            {/* Reply Modal */}
            <LuxuryModal
                isOpen={replyModalOpen}
                onClose={() => !submittingReply && setReplyModalOpen(false)}
                title={selectedReview?.reply ? "Edit Reply" : "Reply to Review"}
            >
                <div className="reviews-modal-content">
                    <div className="reviews-modal-quote">
                        <strong>{selectedReview?.customer?.name}</strong> wrote:
                        <p>"{selectedReview?.comment}"</p>
                    </div>
                    <div className="reviews-modal-input-group">
                        <label className="reviews-modal-label">Your Official Reply</label>
                        <textarea 
                            className="reviews-textarea"
                            placeholder="Type your professional response to the customer here..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                            disabled={submittingReply}
                        />
                    </div>
                    <div className="reviews-modal-actions">
                        <LuxuryButton 
                            onClick={() => setReplyModalOpen(false)} 
                            variant="secondary"
                            disabled={submittingReply}
                        >
                            Cancel
                        </LuxuryButton>
                        <LuxuryButton 
                            onClick={submitReply} 
                            variant="primary"
                            disabled={submittingReply || !replyText.trim()}
                        >
                            {submittingReply ? "Submitting..." : "Submit Reply"}
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryModal>

            {/* Delete Confirmation Modal */}
            <LuxuryConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => !deleting && setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Review"
                message="Are you sure you want to permanently delete this review? This action cannot be undone and will recalculate the product's overall rating."
                confirmLabel={deleting ? "Deleting..." : "Delete Permanently"}
                cancelLabel="Keep Review"
                variant="danger"
                isLoading={deleting}
            />
        </div>
    );
};

export default ReviewsScreen;
