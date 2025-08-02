// Additional model types that are not directly tied to API requests/responses

export interface ChartDataPoint {
  x: number;
  y: number;
  label?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  isRequired: boolean;
  isComplete?: boolean; 
  order: number;
  path: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface SectionNavigationState {
  current: string;
  previous?: string;
  next?: string;
}

// No default export needed - TypeScript modules can have multiple named exports
// When importing, use: import { ChartDataPoint, FormSection, etc. } from './models';