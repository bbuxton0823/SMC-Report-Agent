/**
 * Environment variables utility
 * 
 * This file provides type-safe access to environment variables
 * and default values for when they're not defined.
 */

// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

// AI Model API Keys (server-side only)
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// Feature Flags
export const ENABLE_ANALYTICS = process.env.ENABLE_ANALYTICS === 'true';
export const ENABLE_VERSION_CONTROL = process.env.ENABLE_VERSION_CONTROL === 'true';

// Application Settings
export const MAX_UPLOAD_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE || '10485760', 10);
export const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'gpt-4';

// Validation
if (!OPENAI_API_KEY && process.env.NODE_ENV === 'production') {
  console.warn('Warning: OPENAI_API_KEY is not set. OpenAI features will not work.');
}

if (!ANTHROPIC_API_KEY && process.env.NODE_ENV === 'production') {
  console.warn('Warning: ANTHROPIC_API_KEY is not set. Anthropic features will not work.');
} 