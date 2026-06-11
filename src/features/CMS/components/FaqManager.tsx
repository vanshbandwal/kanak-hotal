import React, { useState, useEffect, useCallback } from 'react';
import cmsApi from '../../../api/cmsApi';
import LuxuryTable, { ColumnDef } from '../../../components/Common/LuxuryTable';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import './CmsEditor.css'; // Reusing some base styles

interface FaqData {
    _id: string;
    question: string;
    answer: string;
    order: number;
    isActive: boolean;
}

const FaqManager = () => {
    const [faqs, setFaqs] = useState<FaqData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FaqData | null>(null);
    const [formData, setFormData] = useState({ question: '', answer: '', order: 0, isActive: true });
    const [isSaving, setIsSaving] = useState(false);

    const fetchFaqs = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await cmsApi.getAllFaqs();
        if (!error && data?.data) {
            setFaqs(data.data);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchFaqs();
    }, [fetchFaqs]);

    const handleAdd = () => {
        setEditingFaq(null);
        setFormData({ question: '', answer: '', order: faqs.length + 1, isActive: true });
        setIsModalOpen(true);
    };

    const handleEdit = (faq: FaqData) => {
        setEditingFaq(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            order: faq.order,
            isActive: faq.isActive
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            const { error } = await cmsApi.deleteFaq(id);
            if (!error) {
                fetchFaqs();
            } else {
                alert('Failed to delete FAQ');
            }
        }
    };

    const handleSave = async () => {
        if (!formData.question || !formData.answer) {
            alert('Please fill out both question and answer.');
            return;
        }

        setIsSaving(true);
        let error;
        if (editingFaq) {
            const res = await cmsApi.updateFaq(editingFaq._id, formData);
            error = res.error;
        } else {
            const res = await cmsApi.createFaq(formData);
            error = res.error;
        }
        setIsSaving(false);

        if (!error) {
            setIsModalOpen(false);
            fetchFaqs();
        } else {
            alert('Error saving FAQ');
        }
    };

    const columns: ColumnDef<FaqData>[] = [
        {
            header: "Order",
            key: "order",
            width: "100px",
            render: (item) => <span className="faq-order-text">{item.order}</span>
        },
        {
            header: "Question",
            key: "question",
            render: (item) => (
                <div>
                    <div className="faq-question-text">{item.question}</div>
                    <div className="faq-answer-snippet">
                        {item.answer.substring(0, 100)}{item.answer.length > 100 ? '...' : ''}
                    </div>
                </div>
            )
        },
        {
            header: "Status",
            key: "isActive",
            width: "150px",
            render: (item) => (
                <LuxuryStatusBadge
                    label={item.isActive ? "Active" : "Inactive"}
                    variant={item.isActive ? "success" : "danger"}
                />
            )
        },
        {
            header: "Actions",
            key: "actions",
            width: "120px",
            render: (item) => (
                <div className="faq-actions-container">
                    <button
                        onClick={() => handleEdit(item)}
                        className="faq-action-btn faq-action-btn-edit"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => handleDelete(item._id)}
                        className="faq-action-btn faq-action-btn-delete"
                    >
                        🗑️
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="cms-editor-container faq-manager-container">
            <LuxuryTable<FaqData>
                title="Manage FAQs"
                columns={columns}
                data={faqs}
                isLoading={isLoading}
                onAdd={handleAdd}
                addButtonLabel="Add FAQ"
                searchTerm=""
                onSearchChange={() => { }}
                emptyIcon="❓"
                emptyTitle="No FAQs Found"
                emptyDescription="Add some frequently asked questions to help your customers."
            />

            <LuxuryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingFaq ? "Edit FAQ" : "Add New FAQ"}
            >
                <div className="cms-editor-form-group">
                    <label className="cms-editor-label">Question</label>
                    <LuxuryInput
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="e.g., How can I earn money?"
                    />
                </div>
                <div className="cms-editor-form-group">
                    <label className="cms-editor-label">Answer</label>
                    <textarea
                        className="luxury-input-field faq-textarea"
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        placeholder="Provide the answer..."
                    />
                </div>
                <div className="cms-editor-form-group faq-form-row">
                    <div className="faq-form-col">
                        <label className="cms-editor-label">Display Order</label>
                        <LuxuryInput
                            type="number"
                            value={formData.order.toString()}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="faq-form-col">
                        <label className="cms-editor-label">Status</label>
                        <div className="faq-toggle-wrapper">
                            <LuxuryToggle
                                value={formData.isActive}
                                onChange={(val) => setFormData({ ...formData, isActive: val })}
                                label={formData.isActive ? 'Active' : 'Inactive'}
                            />
                        </div>
                    </div>
                </div>

                <div className="faq-modal-footer">
                    <LuxuryButton onClick={handleSave} isLoading={isSaving}>
                        {editingFaq ? 'Update FAQ' : 'Save FAQ'}
                    </LuxuryButton>
                </div>
            </LuxuryModal>
        </div>
    );
};

export default FaqManager;
