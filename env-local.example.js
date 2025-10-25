// =====================================================
// LOCAL ENVIRONMENT CONFIGURATION
// =====================================================
// For local development: Copy this file and rename it to 'env-local.js'
// Then update the values below with your Supabase credentials
// Include this file BEFORE config.js in your HTML files

// IMPORTANT: Add env-local.js to .gitignore to keep your credentials safe!

// Set environment variables
window.ENV = {
    SUPABASE_URL: 'https://fiowdrewzweebztcxjnq.supabase.co',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key-here'
};

// Example:
// window.ENV = {
//     SUPABASE_URL: 'https://xyzcompany.supabase.co',
//     SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODMxNjgwMCwiZXhwIjoxOTUzODkyODAwfQ.abcdefghijklmnopqrstuvwxyz123456789'
// };

console.log('✅ Local environment configuration loaded');
