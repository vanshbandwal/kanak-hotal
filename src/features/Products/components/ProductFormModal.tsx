import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productApi } from '../../../api/productApi';
import { categoryApi } from '../../../api/categoryApi';
import { brandApi } from '../../../api/brandApi';
import { unitApi } from '../../../api/unitApi';
import { taxApi } from '../../../api/taxApi';
import { BASE_URL } from '../../../api/endpoint';
import { useToast } from '../../../context/ToastContext';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxurySelect from '../../../components/Common/LuxurySelect';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryTabs from '../../../components/Common/LuxuryTabs';
import LuxuryImageUpload from '../../../components/Common/LuxuryImageUpload';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import { productSchema, ProductFormData } from '../screens/Products.validation';
import './ProductFormModal.css';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
    mode?: 'create' | 'edit' | 'view';
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSuccess, initialData, mode = 'create' }) => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('identity');
    const isViewOnly = mode === 'view';

    // --- FORM SETUP ---
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
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
    const subcategoryId = watch('subcategory');

    const [mainImage, setMainImage] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [subSubcategories, setSubSubcategories] = useState<any[]>([]);
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
        else setSubcategories([]);
    }, [categoryId]);

    useEffect(() => {
        if (subcategoryId) fetchSubSubcategories(subcategoryId);
        else setSubSubcategories([]);
    }, [subcategoryId]);

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

    const fetchSubSubcategories = async (subCatId: string) => {
        try {
            const { data } = await categoryApi.getAllSubSubcategories({ subcategoryId: subCatId });
            setSubSubcategories(data?.data || data || []);
        } catch (err) {
            console.error("Error fetching sub-subcategories", err);
        }
    };

    const fillFormData = (data: any) => {
        const item = data.data && Array.isArray(data.data) ? data.data[0] : data;

        reset({
            name: item.name || '',
            description: item.description || '',
            brand: item.brand?._id || item.brand || '',
            unit: item.unit?._id || item.unit || '',
            productType: item.productType || 'single',
            category: item.category?._id || item.category || item.categoryId?._id || item.categoryId || '',
            subcategory: item.subcategory?._id || item.subcategory || item.subcategoryId?._id || item.subcategoryId || '',
            subSubcategory: item.subSubcategory?._id || item.subSubcategory || '',
            isVeg: item.isVeg ?? true,
            spicyLevel: item.spicyLevel || 0,
            prepTime: item.prepTime || 15,
            calories: item.calories || 0,
            price: item.price || 0,
            salePrice: item.salePrice || 0,
            stock: item.stock || 0,
            sku: item.sku || '',
            isActive: item.isActive ?? true,
            isFeatured: item.isFeatured ?? false,
            taxStatus: item.taxStatus || 'taxable',
            priceIncludesTax: item.priceIncludesTax ?? false,
            taxRule: item.taxRule?._id || item.taxRule || '',
            variants: item.variants || [],
            comboItems: item.comboItems?.map((v: any) => ({
                product: v.product?._id || v.product,
                quantity: v.quantity
            })) || []
        });

        const coverImage = item.mainImage || item.image;
        if (coverImage) setMainImagePreview(sanitizePath(coverImage));
        if (item.images) setGalleryPreviews(item.images.map(sanitizePath));
    };

    const sanitizePath = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        
        // Ensure path starts with a single slash and BASE_URL doesn't end with one
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
        
        return `${cleanBase}${cleanPath.replace(/\\/g, '/')}`;
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
        setActiveTab('identity');
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

    const tabs = [
        { id: 'identity', label: 'Identity', icon: '🍳' },
        { id: 'pricing', label: 'Pricing', icon: '💰' },
        { id: 'category', label: 'Menu', icon: '📂' },
        { id: 'media', label: 'Media', icon: '📸' }
    ];

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
                <LuxuryTabs 
                    tabs={tabs} 
                    activeTab={activeTab} 
                    onChange={setActiveTab} 
                />

                {activeTab === 'identity' && (
                    <div className="product-form-section">
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
                        <div className="product-form-row" style={{ alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label className="product-form-field-label">Dietary Type</label>
                                <Controller
                                    name="isVeg"
                                    control={control}
                                    render={({ field }) => (
                                        <LuxuryStatusBadge 
                                            label={field.value ? 'VEG' : 'NON-VEG'}
                                            variant={field.value ? 'success' : 'danger'}
                                            icon={field.value ? '🟢' : '🔴'}
                                            onClick={() => !isViewOnly && field.onChange(!field.value)}
                                        />
                                    )}
                                />
                            </div>
                            <LuxuryInput label="Prep Time (Min)" type="number" {...register('prepTime')} error={errors.prepTime?.message} disabled={isViewOnly} />
                        </div>
                        <div className="product-form-row">
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
                            <LuxuryInput 
                                label="Description" 
                                {...register('description')} 
                                disabled={isViewOnly} 
                                multiline 
                                rows={2} 
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'pricing' && (
                    <div className="product-form-section">
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

                        <div className="product-form-section-title" style={{ marginTop: '30px' }}>Tax Configuration</div>
                        <div className="product-form-row">
                            <Controller
                                name="taxStatus"
                                control={control}
                                render={({ field }) => (
                                    <LuxurySelect
                                        label="Tax Status"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={[
                                            { value: 'taxable', label: 'Taxable' },
                                            { value: 'none', label: 'Non-Taxable' }
                                        ]}
                                        disabled={isViewOnly}
                                    />
                                )}
                            />
                            <Controller
                                name="taxRule"
                                control={control}
                                render={({ field }) => (
                                    <LuxurySelect
                                        label="Tax Rule"
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        options={taxes.map(t => ({ value: t._id, label: `${t.name} (${t.rate}%)` }))}
                                        placeholder="Select Tax Rule"
                                        disabled={isViewOnly || watch('taxStatus') === 'none'}
                                    />
                                )}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'category' && (
                    <div className="product-form-section">
                        <div className="product-form-row">
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <LuxurySelect
                                        label="Category *"
                                        value={field.value}
                                        onChange={(val) => {
                                            field.onChange(val);
                                            setValue('subcategory', '');
                                            setValue('subSubcategory', '');
                                        }}
                                        options={categories.map(c => ({ value: c._id, label: c.name }))}
                                        placeholder="Select Category"
                                        disabled={isViewOnly}
                                        error={errors.category?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="subcategory"
                                control={control}
                                render={({ field }) => (
                                    <LuxurySelect
                                        label="Subcategory"
                                        value={field.value || ''}
                                        onChange={(val) => {
                                            field.onChange(val);
                                            setValue('subSubcategory', '');
                                        }}
                                        options={subcategories.map(s => ({ value: s._id, label: s.name }))}
                                        placeholder="Select Subcategory"
                                        disabled={isViewOnly || !categoryId}
                                    />
                                )}
                            />
                        </div>
                        <div className="product-form-row" style={{ marginTop: '15px' }}>
                            <Controller
                                name="subSubcategory"
                                control={control}
                                render={({ field }) => (
                                    <LuxurySelect
                                        label="Sub-Subcategory"
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        options={subSubcategories.map(ss => ({ value: ss._id, label: ss.name }))}
                                        placeholder="Select Sub-Subcategory"
                                        disabled={isViewOnly || !subcategoryId}
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
                )}

                {activeTab === 'media' && (
                    <div className="product-form-section">
                        <div className="product-form-row">
                            <LuxuryImageUpload 
                                label="Cover Dish Photo"
                                value={mainImagePreview || ''}
                                onChange={(file) => {
                                    setMainImage(file as File);
                                    setMainImagePreview(URL.createObjectURL(file as File));
                                }}
                                disabled={isViewOnly}
                            />
                        </div>
                        <div className="product-form-row" style={{ marginTop: '20px' }}>
                            <LuxuryImageUpload 
                                label="Gallery Photos"
                                multiple
                                value={galleryPreviews}
                                onChange={(files) => {
                                    setGalleryImages(files as File[]);
                                    setGalleryPreviews((files as File[]).map(f => URL.createObjectURL(f)));
                                }}
                                disabled={isViewOnly}
                            />
                        </div>
                    </div>
                )}
            </div>
        </LuxuryModal>
    );
};

export default ProductFormModal;
