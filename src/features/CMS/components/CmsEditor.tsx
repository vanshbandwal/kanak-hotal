import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Quill stylesheet
import cmsApi from '../../../api/cmsApi';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import FashionLoader from '../../../components/Common/FashionLoader';
import './CmsEditor.css';

interface CmsEditorProps {
    pageKey: string;
    label: string;
}

const CmsEditor: React.FC<CmsEditorProps> = ({ pageKey, label }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchPage = async () => {
            setIsLoading(true);
            const { data, error } = await cmsApi.getCmsPage(pageKey);
            if (!error && data?.data) {
                setTitle(data.data.title);
                setContent(data.data.content);
            }
            setIsLoading(false);
        };
        fetchPage();
    }, [pageKey]);

    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await cmsApi.updateCmsPage(pageKey, { title, content });
        setIsSaving(false);
        if (!error) {
            alert('Saved successfully!');
        } else {
            alert('Error saving page.');
        }
    };

    if (isLoading) {
        return <div className="cms-editor-loading"><FashionLoader /></div>;
    }

    return (
        <div className="cms-editor-container">
            <div className="cms-editor-header-row">
                <h2 className="cms-editor-title">Manage {label}</h2>
                <LuxuryButton onClick={handleSave} isLoading={isSaving}>Save Changes</LuxuryButton>
            </div>

            <div className="cms-editor-form-group">
                <label className="cms-editor-label">Page Title</label>
                <LuxuryInput 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter page title..."
                />
            </div>

            <div className="cms-editor-form-group">
                <label className="cms-editor-label">Content</label>
                <div className="rich-text-wrapper">
                    <ReactQuill 
                        theme="snow" 
                        value={content} 
                        onChange={setContent}
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{'list': 'ordered'}, {'list': 'bullet'}],
                                ['link', 'clean']
                            ]
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CmsEditor;
