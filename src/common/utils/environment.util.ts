export const isLocal = process.env.NODE_ENV === 'local';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isStaging = process.env.NODE_ENV === 'staging';
export const isProduction = !isLocal && !isDevelopment && !isStaging;
