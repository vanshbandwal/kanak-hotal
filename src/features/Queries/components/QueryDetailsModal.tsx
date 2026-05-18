import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { queryApi } from '../../../api/queryApi';
import { useToast } from '../../../context/ToastContext';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import LuxurySelect from '../../../components/Common/LuxurySelect';
import { queryReplySchema, QueryReplyFormData } from '../Queries.validation';
import './QueryDetailsModal.css';

interface QueryDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    queryId: string | null;
    onSuccess: () => void;
}

const QueryDetailsModal: React.FC<QueryDetailsModalProps> = ({ isOpen, onClose, queryId, onSuccess }) => {
    const { addToast } = useToast();
    const [query, setQuery] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<QueryReplyFormData>({
        resolver: zodResolver(queryReplySchema),
        defaultValues: {
            message: ''
        }
    });

    useEffect(() => {
        if (isOpen && queryId) {
            loadQueryDetails();
        }
    }, [isOpen, queryId]);

    useEffect(() => {
        scrollToBottom();
    }, [query?.replies]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadQueryDetails = async () => {
        if (!queryId) return;
        setIsLoading(true);
        try {
            const { data } = await queryApi.getQueryById(queryId);
            setQuery(data?.query);
        } catch (error) {
            addToast('error', 'Failed to load query details');
        } finally {
            setIsLoading(false);
        }
    };

    const onReplySubmit = async (data: QueryReplyFormData) => {
        if (!queryId) return;
        setIsSubmitting(true);
        try {
            const response = await queryApi.adminReply(queryId, data);
            if (response.data.success) {
                addToast('success', 'Reply sent successfully');
                reset();
                loadQueryDetails(); // Refresh to show new reply
                onSuccess(); // Update the list
            }
        } catch (error) {
            addToast('error', 'Failed to send reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!queryId) return;
        try {
            await queryApi.updateStatus(queryId, newStatus);
            addToast('success', `Status updated to ${newStatus}`);
            loadQueryDetails();
            onSuccess();
        } catch (error) {
            addToast('error', 'Failed to update status');
        }
    };

    if (!isOpen) return null;

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={onClose}
            title={query ? `Ticket: ${query.ticketId}` : 'Query Details'}
            size="lg"
            isLoading={isLoading}
            hideFooter
        >
            {query && (
                <div className="query-details-modal-content">
                    {/* Header Info */}
                    <div className="query-meta-grid">
                        <div className="meta-item">
                            <label>Customer</label>
                            <span>{query.customerId?.name || 'Unknown'}</span>
                        </div>
                        <div className="meta-item">
                            <label>Email / Phone</label>
                            <span>{query.customerId?.email} | {query.customerId?.phone}</span>
                        </div>
                        <div className="meta-item">
                            <label>Category</label>
                            <LuxuryStatusBadge label={query.category} variant="info" />
                        </div>
                        <div className="meta-item">
                            <LuxurySelect 
                                label="Status"
                                options={[
                                    { value: 'Open', label: 'Open' },
                                    { value: 'Pending', label: 'Pending' },
                                    { value: 'Resolved', label: 'Resolved' },
                                    { value: 'Closed', label: 'Closed' }
                                ]}
                                value={query.status}
                                onChange={handleStatusUpdate}
                            />
                        </div>
                    </div>

                    <div className="query-subject-box">
                        <label>Subject</label>
                        <h3>{query.subject}</h3>
                    </div>

                    {/* Chat Section */}
                    <div className="query-conversation-container">
                        <div className="message-bubble customer initial">
                            <div className="message-header">
                                <span>{query.customerId?.name}</span>
                                <span className="message-time">{new Date(query.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="message-body">{query.message}</div>
                        </div>

                        {query.replies?.map((reply: any, index: number) => (
                            <div key={index} className={`message-bubble ${reply.senderModel.toLowerCase()}`}>
                                <div className="message-header">
                                    <span>{reply.senderModel === 'User' ? 'Admin Support' : query.customerId?.name}</span>
                                    <span className="message-time">{new Date(reply.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="message-body">{reply.message}</div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Reply Form */}
                    {query.status !== 'Closed' && (
                        <form onSubmit={handleSubmit(onReplySubmit)} className="query-reply-form">
                            <LuxuryInput 
                                label="Reply to Customer"
                                placeholder="Type your response here..."
                                multiline
                                rows={3}
                                {...register('message')}
                                error={errors.message?.message}
                            />
                            <div className="reply-actions">
                                <LuxuryButton 
                                    type="submit" 
                                    variant="primary" 
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    Send Reply
                                </LuxuryButton>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </LuxuryModal>
    );
};

export default QueryDetailsModal;
