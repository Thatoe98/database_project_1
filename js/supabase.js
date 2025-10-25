// =====================================================
// SUPABASE CLIENT INITIALIZATION
// =====================================================
// This file initializes the Supabase client for database operations

/**
 * Initialize Supabase client
 * Make sure to load config.js before this file
 */
let supabase = null;

function initializeSupabase() {
    try {
        // Check if Supabase library is loaded
        if (typeof supabase === 'undefined' || !window.supabase) {
            console.error('❌ Supabase library not loaded. Make sure to include the Supabase CDN script.');
            return null;
        }

        // Check if configuration is valid
        if (!config || !config.supabase || !config.supabase.url || !config.supabase.anonKey) {
            console.error('❌ Supabase configuration not found. Check config.js.');
            return null;
        }

        if (config.supabase.url === 'YOUR_SUPABASE_URL' || config.supabase.anonKey === 'YOUR_SUPABASE_ANON_KEY') {
            console.error('❌ Supabase credentials not configured. Please set your environment variables.');
            return null;
        }

        // Create Supabase client
        const { createClient } = window.supabase;
        supabase = createClient(config.supabase.url, config.supabase.anonKey);

        console.log('✅ Supabase client initialized successfully');
        return supabase;

    } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        return null;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    supabase = initializeSupabase();
});

/**
 * Check if Supabase is connected and ready
 */
async function checkSupabaseConnection() {
    try {
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }

        // Try a simple query to check connection (using hospitals table - always exists)
        const { data, error } = await supabase
            .from('hospitals')
            .select('hospital_id')
            .limit(1);

        if (error) {
            console.error('❌ Supabase connection error:', error);
            return false;
        }

        console.log('✅ Supabase connection successful');
        return true;

    } catch (error) {
        console.error('❌ Supabase connection test failed:', error);
        return false;
    }
}

/**
 * Helper function to handle Supabase errors
 */
function handleSupabaseError(error, operation = 'Database operation') {
    console.error(`${operation} failed:`, error);
    
    let userMessage = 'An error occurred. Please try again.';
    
    if (error.message) {
        // Parse common error messages
        if (error.message.includes('violates row-level security')) {
            userMessage = 'Access denied. Please check your permissions.';
        } else if (error.message.includes('duplicate key')) {
            userMessage = 'This record already exists.';
        } else if (error.message.includes('violates foreign key')) {
            userMessage = 'Cannot complete operation due to related records.';
        } else if (error.message.includes('not found')) {
            userMessage = 'Record not found.';
        } else {
            userMessage = error.message;
        }
    }
    
    return userMessage;
}
