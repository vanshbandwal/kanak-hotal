import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryApi } from '../../../api/categoryApi';
import { BASE_URL } from '../../../api/endpoint';
import { useToast } from '../../../context/ToastContext';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxurySelect from '../../../components/Common/LuxurySelect';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import { 
    categorySchema, 
    subcategorySchema, 
    subSubcategorySchema
} from '../screens/Products.validation';
import './CategoryFormModal.css';

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: 'category' | 'subcategory' | 'subsubcategory';
    initialData?: any;
    mode?: 'create' | 'edit' | 'view';
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, onSuccess, type, initialData, mode = 'create' }) => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const isViewOnly = mode === 'view';

    // Media
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    // Hierarchy selections data
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);

    const schemaMap = {
        category: categorySchema,
        subcategory: subcategorySchema,
        subsubcategory: subSubcategorySchema
    };

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors }
    } = useForm<any>({
        resolver: zodResolver(schemaMap[type]),
        defaultValues: {
            name: '',
            description: '',
            order: 0,
            isActive: true,
            category: '',
            subcategory: '',
        }
    });

    const selectedCategory = watch('category');

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (initialData) {
                const catId = typeof initialData.categoryId === 'object' ? initialData.categoryId._id : initialData.categoryId;
                const subId = typeof initialData.subcategoryId === 'object' ? initialData.subcategoryId._id : initialData.subcategoryId;
                
                reset({
                    name: initialData.name || '',
                    description: initialData.description || '',
                    order: initialData.order || 0,
                    isActive: initialData.isActive ?? true,
                    category: catId || '',
                    subcategory: subId || '',
                });

                setImagePreview(initialData.image ? (initialData.image.startsWith('http') ? initialData.image : `${BASE_URL}${initialData.image}`) : null);
                
                if (type === 'subsubcategory' && catId) {
                    fetchSubcategories(catId);
                }
            } else {
                handleReset();
            }
        }
    }, [isOpen, initialData, type, reset]);

    const handleReset = () => {
        reset({
            name: '',
            description: '',
            order: 0,
            isActive: true,
            category: '',
            subcategory: '',
        });
        setImage(null);
        setImagePreview(null);
    };

    const fetchCategories = async () => {
        const { data, error } = await categoryApi.getAllCategories();
        if (error) {
            console.error('Error fetching categories:', error);
        } else if (data && data.data) {
            setCategories(data.data);
        }
    };

    const fetchSubcategories = async (catId: string) => {
        const { data, error } = await categoryApi.getAllSubcategories({ categoryId: catId });
        if (error) {
            console.error('Error fetching subcategories:', error);
        } else if (data && data.data) {
            setSubcategories(data.data);
        }
    };

    const handleCategoryChange = (catId: string) => {
        setValue('category', catId);
        setValue('subcategory', '');
        if (type === 'subsubcategory') {
            fetchSubcategories(catId);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onFormSubmit = async (data: any) => {
        if (isViewOnly) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        formData.append('order', String(data.order));
        formData.append('isActive', String(data.isActive));
        
        if (image) {
            formData.append('image', image);
        }

        let response;
        if (type === 'category') {
            response = initialData ? await categoryApi.updateCategory(initialData._id, formData) : await categoryApi.createCategory(formData);
        } else if (type === 'subcategory') {
            formData.append('categoryId', data.category);
            response = initialData ? await categoryApi.updateSubcategory(initialData._id, formData) : await categoryApi.createSubcategory(formData);
        } else if (type === 'subsubcategory') {
            formData.append('categoryId', data.category);
            formData.append('subcategoryId', data.subcategory);
            response = initialData ? await categoryApi.updateSubSubcategory(initialData._id, formData) : await categoryApi.createSubSubcategory(formData);
        }

        setIsLoading(false);

        if (response?.error) {
            addToast('error', response.error || `Failed to ${initialData ? 'update' : 'create'} category`);
        } else {
            addToast('success', `${type.replace('sub', 'Sub ')} ${initialData ? 'updated' : 'created'} successfully`);
            onSuccess();
            handleClose();
        }
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="category-form-overlay">
            <div className="category-form-modal-card">
                <div className="category-form-header">
                    <h2 className="category-form-title">{initialData ? (isViewOnly ? 'View' : 'Edit') : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1).replace('sub', 'Sub ')}</h2>
                    <button onClick={handleClose} className="category-form-close-button">&times;</button>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="category-form-body">
                    <div className="category-form-scroll-area">
                        {/* Parent Selections */}
                        {(type === 'subcategory' || type === 'subsubcategory') && (
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <LuxurySelect
                                        label="Parent Category *"
                                        value={field.value}
                                        onChange={handleCategoryChange}
                                        options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
                                        placeholder="Select Category"
                                        disabled={isViewOnly}
                                        error={errors.category?.message as string}
                                    />
                                )}
                            />
                        )}

                        {type === 'subsubcategory' && (
                            <Controller
                                name="subcategory"
                                control={control}
                                render={({ field }) => (
                                    <LuxurySelect
                                        label="Parent Subcategory *"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={subcategories.map(sub => ({ value: sub._id, label: sub.name }))}
                                        placeholder="Select Subcategory"
                                        disabled={isViewOnly || !selectedCategory}
                                        error={errors.subcategory?.message as string}
                                    />
                                )}
                            />
                        )}

                        <LuxuryInput 
                            label="Name *" 
                            {...register('name')}
                            error={errors.name?.message as string}
                            placeholder="e.g. Luxury Handbags"
                            disabled={isViewOnly}
                        />

                        <LuxuryInput 
                            label="Description" 
                            {...register('description')}
                            error={errors.description?.message as string}
                            placeholder="Details about this collection..."
                            disabled={isViewOnly}
                            multiline
                            rows={3}
                        />

                        <div className="category-form-row">
                            <div className="category-form-group-half">
                                <LuxuryInput 
                                    label="Order"
                                    type="number" 
                                    {...register('order')}
                                    error={errors.order?.message as string}
                                    disabled={isViewOnly}
                                />
                            </div>
                            <div className="category-form-group-half">
                                <label className="category-form-label">Status</label>
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <LuxuryToggle 
                                            label={field.value ? 'Active' : 'Inactive'}
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={isViewOnly}
                                            activeColor="var(--success)"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="category-form-group">
                            <label className="category-form-label">Image Upload</label>
                            <div className="category-form-upload-area">
                                {imagePreview ? (
                                    <div className="category-form-preview-container">
                                        <img src={imagePreview} alt="Preview" className="category-form-preview" />
                                        {!isViewOnly && (
                                            <button type="button" onClick={() => {setImage(null); setImagePreview(null);}} className="category-form-remove-image">Remove</button>
                                        )}
                                    </div>
                                ) : (
                                    !isViewOnly && (
                                        <label className="category-form-dropzone">
                                            <input type="file" onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                                            <span className="category-form-upload-icon">🖼️</span>
                                            <span className="category-form-upload-text">Click to upload luxury image</span>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="category-form-footer">
                        <LuxuryButton type="button" onClick={handleClose} variant="ghost">
                            {isViewOnly ? 'Close' : 'Cancel'}
                        </LuxuryButton>
                        {!isViewOnly && (
                            <LuxuryButton type="submit" disabled={isLoading}>
                                {isLoading ? 'PROCESSING...' : `${initialData ? 'UPDATE' : 'ADD'} ${type.toUpperCase().replace('SUB', 'SUB ')}`}
                            </LuxuryButton>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormModal;

