import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productApi } from '../../../api/productApi';
import { categoryApi } from '../../../api/categoryApi';
import { brandApi } from '../../../api/brandApi';
import { unitApi } from '../../../api/unitApi';
import { taxApi } from '../../../api/taxApi';
import { BASE_URL } from '../../../api/endpoint';
import { useToast } from '../../../context/ToastContext';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxurySelect from '../../../components/Common/LuxurySelect';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import { productSchema, ProductFormData } from '../screens/Products.validation';
import './ProductFormModal.css';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
    mode?: 'create' | 'edit' | 'view';
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSuccess, initialData, mode = 'create' }) => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const isViewOnly = mode === 'view';

    // --- FORM SETUP ---
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors }
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: '',
            description: '',
            brand: '',
            unit: '',
            productType: 'single',
            category: '',
            subcategory: '',
            subSubcategory: '',
            isVeg: true,
            spicyLevel: 0,
            prepTime: 15,
            calories: 0,
            price: 0,
            salePrice: 0,
            stock: 0,
            sku: '',
            isActive: true,
            isFeatured: false,
            taxStatus: 'taxable',
            priceIncludesTax: false,
            taxRule: '',
            variants: [],
            comboItems: []
        }
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: "variants"
    });

    const { fields: comboFields, append: appendCombo, remove: removeCombo } = useFieldArray({
        control,
        name: "comboItems"
    });

    const productType = watch('productType');
    const categoryId = watch('category');

    const [mainImage, setMainImage] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [taxes, setTaxes] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadDropdownData();
            if (initialData) fillFormData(initialData);
            else handleReset();
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        if (categoryId) fetchSubcategories(categoryId);
    }, [categoryId]);

    const loadDropdownData = async () => {
        try {
            const [cats, brnds, unts, txs, prods] = await Promise.all([
                categoryApi.getAllCategories(),
                brandApi.getAllBrands(),
                unitApi.getAllUnits(),
                taxApi.getAllTaxes(),
                productApi.getAllProducts({ limit: 100 })
            ]);
            
            setCategories(cats.data?.data || cats.data || []);
            setBrands(brnds.data?.data || brnds.data || []);
            setUnits(unts.data?.data || unts.data || []);
            setTaxes(txs.data?.data || txs.data || []);
            setAllProducts(prods.data?.data || prods.data || []);
        } catch (err) {
            console.error("Error loading dropdown data", err);
        }
    };

    const fetchSubcategories = async (catId: string) => {
        try {
            const { data } = await categoryApi.getAllSubcategories({ categoryId: catId });
            setSubcategories(data?.data || data || []);
        } catch (err) {
            console.error("Error fetching subcategories", err);
        }
    };

    const fillFormData = (data: any) => {
        reset({
            name: data.name || '',
            description: data.description || '',
            brand: data.brand?._id || data.brand || '',
            unit: data.unit?._id || data.unit || '',
            productType: data.productType || 'single',
            category: data.category?._id || data.category || '',
            subcategory: data.subcategory?._id || data.subcategory || '',
            subSubcategory: data.subSubcategory?._id || data.subSubcategory || '',
            isVeg: data.isVeg ?? true,
            spicyLevel: data.spicyLevel || 0,
            prepTime: data.prepTime || 15,
            calories: data.calories || 0,
            price: data.price || 0,
            salePrice: data.salePrice || 0,
            stock: data.stock || 0,
            sku: data.sku || '',
            isActive: data.isActive ?? true,
            isFeatured: data.isFeatured ?? false,
            taxStatus: data.taxStatus || 'taxable',
            priceIncludesTax: data.priceIncludesTax ?? false,
            taxRule: data.taxRule?._id || data.taxRule || '',
            variants: data.variants || [],
            comboItems: data.comboItems?.map((item: any) => ({
                product: item.product?._id || item.product,
                quantity: item.quantity
            })) || []
        });

        if (data.mainImage) setMainImagePreview(sanitizePath(data.mainImage));
        if (data.images) setGalleryPreviews(data.images.map(sanitizePath));
    };

    const sanitizePath = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
    };

    const handleReset = () => {
        reset({
            name: '',
            description: '',
            brand: '',
            unit: '',
            productType: 'single',
            category: '',
            subcategory: '',
            subSubcategory: '',
            isVeg: true,
            spicyLevel: 0,
            prepTime: 15,
            calories: 0,
            price: 0,
            salePrice: 0,
            stock: 0,
            sku: '',
            isActive: true,
            isFeatured: false,
            taxStatus: 'taxable',
            priceIncludesTax: false,
            taxRule: '',
            variants: [],
            comboItems: []
        });
        setMainImage(null);
        setMainImagePreview(null);
        setGalleryImages([]);
        setGalleryPreviews([]);
    };

    const onFormSubmit: SubmitHandler<ProductFormData> = async (data) => {
        if (isViewOnly) return;
        setIsLoading(true);
        const formData = new FormData();
        
        Object.keys(data).forEach(key => {
            const val = (data as any)[key];
            if (['variants', 'comboItems', 'images', 'mainImage'].includes(key)) return;
            if (val !== undefined && val !== null) formData.append(key, String(val));
        });

        if (data.productType === 'variant' && data.variants) {
            formData.append('variants', JSON.stringify(data.variants));
        } else if (data.productType === 'combo' && data.comboItems) {
            formData.append('comboItems', JSON.stringify(data.comboItems));
        }

        if (mainImage) formData.append('mainImage', mainImage);
        galleryImages.forEach(file => formData.append('images', file));

        try {
            const { error } = initialData 
                ? await productApi.updateProduct(initialData._id, formData)
                : await productApi.createProduct(formData);

            if (error) {
                addToast('error', error);
            } else {
                addToast('success', `Dish ${initialData ? 'updated' : 'created'} successfully`);
                onSuccess();
                onClose();
            }
        } catch (err: any) {
            addToast('error', err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const modalTitle = initialData ? 'Refine Dish' : 'Create New Dish';

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            size="lg"
            isLoading={isLoading}
            onSubmit={handleSubmit(onFormSubmit)}
            submitLabel="Save Dish"
            isViewOnly={isViewOnly}
        >
            <div className="product-form-container">
                <div className="product-form-section">
                    <h3 className="product-form-section-title">Culinary Identity</h3>
                    <div className="product-form-row">
                        <LuxuryInput label="Dish Name *" {...register('name')} error={errors.name?.message} disabled={isViewOnly} />
                        <Controller
                            name="productType"
                            control={control}
                            render={({ field }) => (
                                <LuxurySelect
                                    label="Service Style *"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { value: 'single', label: 'Single Dish' },
                                        { value: 'variant', label: 'Portions (Half/Full)' },
                                        { value: 'combo', label: 'Meal Combo' }
                                    ]}
                                    disabled={isViewOnly}
                                    error={errors.productType?.message}
                                />
                            )}
                        />
                    </div>
                    <div className="product-form-row" style={{ alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <Controller
                                name="isVeg"
                                control={control}
                                render={({ field }) => (
                                    <div onClick={() => !isViewOnly && field.onChange(!field.value)} className={`food-type-badge ${field.value ? 'veg' : 'non-veg'}`}>
                                        {field.value ? '🟢 VEG' : '🔴 NON-VEG'}
                                    </div>
                                )}
                            />
                        </div>
                        <LuxuryInput label="Prep Time (Min)" type="number" {...register('prepTime')} error={errors.prepTime?.message} disabled={isViewOnly} />
                        <Controller
                            name="spicyLevel"
                            control={control}
                            render={({ field }) => (
                                <LuxurySelect
                                    label="Spiciness"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { value: 0, label: 'Not Spicy' },
                                        { value: 1, label: 'Mild' },
                                        { value: 2, label: 'Spicy' },
                                        { value: 3, label: 'Extra Spicy' }
                                    ]}
                                    disabled={isViewOnly}
                                    error={errors.spicyLevel?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="product-form-section">
                    <h3 className="product-form-section-title">Pricing & Portions</h3>
                    {productType === 'single' && (
                        <div className="product-form-row">
                            <LuxuryInput label="Price *" type="number" {...register('price')} error={errors.price?.message} disabled={isViewOnly} />
                            <LuxuryInput label="Sale Price" type="number" {...register('salePrice')} error={errors.salePrice?.message} disabled={isViewOnly} />
                        </div>
                    )}

                    {productType === 'variant' && (
                        <div className="portion-management">
                            {variantFields.map((field, index) => (
                                <div key={field.id} className="portion-row">
                                    <LuxuryInput label="Portion" {...register(`variants.${index}.attributes.portion` as any)} disabled={isViewOnly} />
                                    <LuxuryInput label="Price" type="number" {...register(`variants.${index}.price` as any)} disabled={isViewOnly} />
                                    <LuxuryInput label="SKU/ID" {...register(`variants.${index}.sku` as any)} disabled={isViewOnly} />
                                    {!isViewOnly && <button type="button" onClick={() => removeVariant(index)} className="remove-row-btn">🗑️</button>}
                                </div>
                            ))}
                            {!isViewOnly && (
                                <LuxuryButton type="button" onClick={() => appendVariant({ attributes: { portion: '' }, price: 0, sku: `P-${Date.now()}` })} variant="ghost" size="small">
                                    + Add Portion
                                </LuxuryButton>
                            )}
                        </div>
                    )}

                    {productType === 'combo' && (
                        <div className="combo-management">
                            {comboFields.map((field, index) => (
                                <div key={field.id} className="portion-row">
                                    <Controller
                                        name={`comboItems.${index}.product` as any}
                                        control={control}
                                        render={({ field: selectField }) => (
                                            <LuxurySelect
                                                label="Select Dish"
                                                value={selectField.value}
                                                onChange={selectField.onChange}
                                                options={allProducts.map(p => ({ value: p._id, label: p.name }))}
                                                disabled={isViewOnly}
                                            />
                                        )}
                                    />
                                    <LuxuryInput label="Qty" type="number" {...register(`comboItems.${index}.quantity` as any)} disabled={isViewOnly} />
                                    {!isViewOnly && <button type="button" onClick={() => removeCombo(index)} className="remove-row-btn">🗑️</button>}
                                </div>
                            ))}
                            {!isViewOnly && (
                                <LuxuryButton type="button" onClick={() => appendCombo({ product: '', quantity: 1 })} variant="ghost" size="small">
                                    + Add Item to Meal
                                </LuxuryButton>
                            )}
                            <div className="product-form-row" style={{ marginTop: '15px' }}>
                                <LuxuryInput label="Combo Price *" type="number" {...register('price')} error={errors.price?.message} disabled={isViewOnly} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="product-form-section">
                    <h3 className="product-form-section-title">Menu Category</h3>
                    <div className="product-form-row">
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <LuxurySelect
                                    label="Category *"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={categories.map(c => ({ value: c._id, label: c.name }))}
                                    placeholder="Select Category"
                                    disabled={isViewOnly}
                                    error={errors.category?.message}
                                />
                            )}
                        />
                        <Controller
                            name="brand"
                            control={control}
                            render={({ field }) => (
                                <LuxurySelect
                                    label="Branded Ingredient"
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    options={brands.map(b => ({ value: b._id, label: b.name }))}
                                    placeholder="Select Brand"
                                    disabled={isViewOnly}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="product-form-section">
                    <h3 className="product-form-section-title">Dish Photos</h3>
                    <div className="product-form-media-grid">
                        <label className="product-form-upload-label">
                            {mainImagePreview ? <img src={mainImagePreview} className="product-form-preview-img" alt="Dish preview" /> : <span className="upload-icon">📸 Upload Cover</span>}
                            <input type="file" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setMainImage(file);
                                    const reader = new FileReader();
                                    reader.onloadend = () => setMainImagePreview(reader.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }} style={{ display: 'none' }} accept="image/*" disabled={isViewOnly} />
                        </label>
                    </div>
                </div>
            </div>
        </LuxuryModal>
    );
};

export default ProductFormModal;

