// Configuration utilities for environment variables
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Data Alchemist: Forge Your Own AI Resource‑Allocation Configurator',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  },
  
  fileUpload: {
    maxSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'),
    allowedTypes: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES?.split(',') || ['.csv', '.xlsx', '.xls'],
  },
  
  validation: {
    realTimeEnabled: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME_VALIDATION === 'true',
    maxErrors: parseInt(process.env.NEXT_PUBLIC_MAX_VALIDATION_ERRORS || '100'),
  },
  
  export: {
    formats: process.env.NEXT_PUBLIC_EXPORT_FORMAT?.split(',') || ['csv', 'json'],
    bulkExportEnabled: process.env.NEXT_PUBLIC_ENABLE_BULK_EXPORT === 'true',
  },
  
  ai: {
    openaiKey: process.env.OPENAI_API_KEY,
    anthropicKey: process.env.ANTHROPIC_API_KEY,
  },
  
  database: {
    url: process.env.DATABASE_URL,
  },
};

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';