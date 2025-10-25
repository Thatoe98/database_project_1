-- CRITICAL: Disable Row Level Security (RLS)
-- If you're getting "permission denied" or "policy" errors, run this:

ALTER TABLE hospitals DISABLE ROW LEVEL SECURITY;
ALTER TABLE donors DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled (should all return FALSE)
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('hospitals', 'donors', 'campaigns', 'patients', 'donations', 'inventory')
ORDER BY tablename;
