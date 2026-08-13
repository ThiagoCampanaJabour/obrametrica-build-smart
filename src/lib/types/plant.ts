import { z } from 'zod';

export const PlantLicenseSchema = z.object({
  type: z.string(), // e.g., 'CC0', 'Public Domain', 'CC BY 4.0'
  url: z.string(),
  details: z.string().optional(),
});

export const PlantItemSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(100),
  description: z.string().max(1000), // Increased for richer descriptions
  categories: z.array(z.string()),
  format: z.array(z.string()),
  fileUrl: z.string().nullable(),
  thumbnailUrl: z.string().optional(),
  hosted: z.boolean(),
  sourceUrl: z.string().nullable(),
  status: z.enum(['available', 'unavailable', 'archived']).default('available').optional(),
  unavailableReason: z.string().optional(),
  lastCheckedAt: z.string().optional(),
  author: z.string(),
  license: PlantLicenseSchema,
  attributionText: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  verifiedBy: z.string(),
  verificationDate: z.string(),
  disclaimerShort: z.string().optional(),
  disclaimerLong: z.string().optional(),
  slug: z.string().optional(), // New for individual pages
  area: z.number().optional(), // In m2
  terreno: z.string().optional(), // e.g. "8m x 20m"
  quartos: z.number().optional(),
  banheiros: z.number().optional(),
  vagas: z.number().optional(),
  ambientes: z.array(z.object({
    nome: z.string(),
    area: z.number(),
  })).optional(),
  isAutoral: z.boolean().optional(),
});

export type PlantLicense = z.infer<typeof PlantLicenseSchema>;
export type PlantItem = z.infer<typeof PlantItemSchema>;

export type PlantCategory = string;
export type PlantFormat = string;
