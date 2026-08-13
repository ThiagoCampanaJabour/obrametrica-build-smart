import { z } from 'zod';

export const PlantLicenseSchema = z.object({
  type: z.string(), // e.g., 'CC0', 'Public Domain', 'CC BY 4.0'
  url: z.string().url(),
  details: z.string().optional(),
});

export const PlantItemSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(100),
  description: z.string().max(500),
  categories: z.array(z.enum([
    'Residencial',
    'Galpões',
    'Edifícios',
    'Comercial',
    'Lazer',
    'Paisagismo',
    'Infraestrutura',
    'Acessibilidade',
    'Estruturas Auxiliares'
  ])),
  format: z.enum(['PDF', 'DWG', 'DXF', 'SVG', 'JPG', 'PNG', 'ZIP']),
  fileUrl: z.string().url().nullable(),
  thumbnailUrl: z.string().url().optional(),
  hosted: z.boolean(),
  sourceUrl: z.string().url().nullable(),
  status: z.enum(['available', 'unavailable', 'archived']).default('available').optional(),
  unavailableReason: z.string().optional(),
  lastCheckedAt: z.string().optional(),
  author: z.string(),
  license: PlantLicenseSchema,
  attributionText: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
  verifiedBy: z.string(),
  verificationDate: z.string().datetime(),
});

export type PlantLicense = z.infer<typeof PlantLicenseSchema>;
export type PlantItem = z.infer<typeof PlantItemSchema>;

export type PlantCategory = PlantItem['categories'][number];
export type PlantFormat = PlantItem['format'];
