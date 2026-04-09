import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2),
  description: z.string(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export const ProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  componentsList: z.array(z.string()).min(1, 'At least one component is required'),
  learningOutcome: z.string().min(5),
  difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  ageRecommendation: z.string(),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  videoTutorialId: z.string().optional(),
  pdfManualUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof CategorySchema>;
export type ProductInput = z.infer<typeof ProductSchema>;
