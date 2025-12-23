'use client';

/**
 * Environment Hook
 * Provides environment information for conditional rendering
 */
export const useEnvironment = () => {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || 'local';
  
  return {
    isProduction: appEnv === 'production',
    isLocal: appEnv === 'local',
    appEnv
  };
};

/**
 * Check if write operations are allowed
 * Returns true only in local environment
 */
export const isWriteAllowed = () => {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || 'local';
  return appEnv === 'local';
};
