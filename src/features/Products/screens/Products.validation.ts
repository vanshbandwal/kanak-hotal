import { z } from 'zod';

// --- CATEGORY SCHEMA ---
export const categorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  isActive: z.boolean(),
  order: z.coerce.number().int().min(0, 'Order must be a positive number'),
});

// --- SUBCATEGORY SCHEMA ---
export const subcategorySchema = categorySchema.extend({
  category: z.string().min(1, 'Please select a parent category'),
});

// --- SUBSUBCATEGORY SCHEMA ---
export const subSubcategorySchema = subcategorySchema.extend({
  subcategory: z.string().min(1, 'Please select a subcategory'),
});

// --- PRODUCT SCHEMA (RESTAURANT EDITION) ---
export const productSchema = z.object({
  name: z.string()
    .min(1, 'Dish name is required')
    .min(2, 'Dish name must be at least 2 characters'),
  description: z.string().optional(),
  brand: z.string().optional(), // Branded items (Coke, Amul)
  unit: z.string().optional(),
  
  // 🥗 Food Specific Fields
  isVeg: z.boolean().default(true),
  spicyLevel: z.coerce.number().min(0).max(3).default(0),
  prepTime: z.coerce.number().min(1, 'Prep time must be at least 1 min').default(15),
  calories: z.coerce.number().min(0).optional(),

  productType: z.enum(['single', 'variant', 'combo']),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(), 
  subSubcategory: z.string().optional(),
  
  // Pricing & Stock
  price: z.coerce.number().min(0, 'Price must be 0 or greater').default(0),
  salePrice: z.coerce.number().min(0).optional().default(0),
  stock: z.coerce.number().int().min(0, 'Stock must be 0 or greater').default(0),
  sku: z.string().optional(),

  // Visibility & Tax
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  taxStatus: z.enum(['taxable', 'none']).default('taxable'),
  priceIncludesTax: z.boolean().default(false),
  taxRule: z.string().optional(),

  // 🎭 Complex Dynamic Sections
  variants: z.array(z.object({
    attributes: z.record(z.string(), z.string()),
    price: z.coerce.number().min(0),
    salePrice: z.coerce.number().min(0).optional(),
    sku: z.string().optional(),
  })).optional(),
  
  comboItems: z.array(z.object({
    product: z.string().min(1, 'Dish is required'),
    quantity: z.coerce.number().min(1, 'Min 1 qty'),
  })).optional(),
});

// --- UNIT SCHEMA ---
export const unitSchema = z.object({
  name: z.string().min(1, 'Unit name is required').max(50),
  shortName: z.string().min(1, 'Short name is required').max(10),
  description: z.string().max(250, 'Description cannot exceed 250 characters').optional(),
  isActive: z.boolean(),
});

// --- TAX SCHEMA ---
export const taxSchema = z.object({
  name: z.string().min(1, 'Tax name is required').max(50),
  rate: z.coerce.number().min(0, 'Tax rate must be at least 0'),
  type: z.enum(['percentage', 'fixed']).default('percentage'),
  taxType: z.enum(['inclusive', 'exclusive']).default('exclusive'),
  description: z.string().max(250, 'Description cannot exceed 250 characters').optional(),
  isActive: z.boolean().default(true),
});

// --- BRAND SCHEMA ---
export const brandSchema = z.object({
  name: z.string()
    .min(1, 'Brand name is required')
    .min(2, 'Brand name must be at least 2 characters')
    .max(100, 'Brand name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  isActive: z.boolean(),
  order: z.coerce.number().int().min(0, 'Order must be a positive number'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
export type SubcategoryFormData = z.infer<typeof subcategorySchema>;
export type SubSubcategoryFormData = z.infer<typeof subSubcategorySchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type UnitFormData = z.infer<typeof unitSchema>;
export type TaxFormData = z.infer<typeof taxSchema>;
export type BrandFormData = z.infer<typeof brandSchema>;
