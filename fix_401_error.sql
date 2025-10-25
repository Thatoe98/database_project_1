-- =====================================================
-- COMPLETE FIX FOR 401 UNAUTHORIZED ERROR
-- =====================================================
-- Run this entire script in Supabase SQL Editor

-- Step 1: Make sure RLS is DISABLED (already done, but confirming)
ALTER TABLE hospitals DISABLE ROW LEVEL SECURITY;
ALTER TABLE donors DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (they might be blocking even with RLS disabled)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || 
                ' ON ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Step 3: Grant ALL privileges to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Step 4: Grant privileges to authenticated role (for future use)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Step 5: Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;

-- Step 6: Specifically grant on views (CRITICAL!)
GRANT SELECT ON inventory_with_blood_type TO anon, authenticated, postgres;
GRANT SELECT ON donations_with_blood_type TO anon, authenticated, postgres;
GRANT SELECT ON inventory_summary TO anon, authenticated, postgres;

-- Step 7: Grant on specific tables
GRANT ALL ON hospitals TO anon, authenticated;
GRANT ALL ON donors TO anon, authenticated;
GRANT ALL ON campaigns TO anon, authenticated;
GRANT ALL ON patients TO anon, authenticated;
GRANT ALL ON donations TO anon, authenticated;
GRANT ALL ON inventory TO anon, authenticated;

-- Step 8: Verify RLS is disabled
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('hospitals', 'donors', 'campaigns', 'patients', 'donations', 'inventory')
ORDER BY tablename;

-- Step 9: Verify anon has SELECT permission
SELECT 
    tablename,
    has_table_privilege('anon', 'public.' || tablename, 'SELECT') as can_select,
    has_table_privilege('anon', 'public.' || tablename, 'INSERT') as can_insert
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('hospitals', 'donors', 'campaigns', 'patients', 'donations', 'inventory')
ORDER BY tablename;

-- Expected result: All tables should show rls_enabled = false, can_select = true, can_insert = true
