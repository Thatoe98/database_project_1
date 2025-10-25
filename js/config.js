// =====================================================
// CONFIGURATION - Environment Variables
// =====================================================
// This file reads environment variables for both local and Vercel deployment

/**
 * Get environment variable value
 * Works in both local development (reading from .env) and Vercel production
 */
function getEnvVariable(key) {
    // For local development: parse .env file if it exists
    // For Vercel: environment variables are injected at build time
    
    // Check if running in browser with build-time injected variables
    if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
        return window.ENV[key];
    }
    
    // Fallback: Check if variables are defined globally (for Vercel)
    if (typeof SUPABASE_URL !== 'undefined' && key === 'SUPABASE_URL') {
        return SUPABASE_URL;
    }
    if (typeof SUPABASE_ANON_KEY !== 'undefined' && key === 'SUPABASE_ANON_KEY') {
        return SUPABASE_ANON_KEY;
    }
    
    // Default fallback for local development
    // Note: For local testing, you need to manually set these in your HTML file
    // or create a local .env.js file
    return null;
}

// Export configuration
const config = {
    supabase: {
        url: getEnvVariable('SUPABASE_URL') || 'YOUR_SUPABASE_URL',
        anonKey: getEnvVariable('SUPABASE_ANON_KEY') || 'YOUR_SUPABASE_ANON_KEY'
    },
    app: {
        name: 'Blood Inventory Management System',
        version: '1.0.0'
    }
};

// Log configuration status (for debugging)
console.log('Configuration loaded:', {
    hasSupabaseUrl: !!config.supabase.url && config.supabase.url !== 'YOUR_SUPABASE_URL',
    hasSupabaseKey: !!config.supabase.anonKey && config.supabase.anonKey !== 'YOUR_SUPABASE_ANON_KEY'
});

// Check if configuration is valid
if (config.supabase.url === 'YOUR_SUPABASE_URL' || config.supabase.anonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn('⚠️ Supabase configuration not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    console.warn('For local development: Create a .env file or set variables in your HTML file.');
    console.warn('For Vercel: Add environment variables in your Vercel project settings.');
}
