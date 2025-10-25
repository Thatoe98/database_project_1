-- Quick Test Queries for Supabase SQL Editor
-- Copy and paste these one at a time to verify your setup

-- Test 1: Check if tables exist (should return numbers)
SELECT COUNT(*) as hospital_count FROM hospitals;
SELECT COUNT(*) as donor_count FROM donors;
SELECT COUNT(*) as campaign_count FROM campaigns;
SELECT COUNT(*) as patient_count FROM patients;
SELECT COUNT(*) as donation_count FROM donations;
SELECT COUNT(*) as inventory_count FROM inventory;

-- Test 2: Check if views exist (run these one by one)
SELECT * FROM inventory_with_blood_type LIMIT 5;
SELECT * FROM donations_with_blood_type LIMIT 5;
SELECT * FROM inventory_summary;

-- Test 3: If views don't exist, create them manually:

-- View 1: inventory_with_blood_type
CREATE OR REPLACE VIEW inventory_with_blood_type AS
SELECT 
    i.inventory_id,
    i.donation_id,
    i.hospital_id,
    i.number_of_units,
    i.collection_ts,
    i.expiry_ts,
    i.status,
    i.notes,
    i.created_at,
    dn.abo_group,
    dn.rh_factor,
    CONCAT(dn.abo_group, dn.rh_factor) as blood_type
FROM inventory i
INNER JOIN donations d ON i.donation_id = d.donation_id
INNER JOIN donors dn ON d.donor_id = dn.donor_id;

-- View 2: donations_with_blood_type
CREATE OR REPLACE VIEW donations_with_blood_type AS
SELECT 
    d.donation_id,
    d.donor_id,
    d.hospital_id,
    d.campaign_id,
    d.donation_timestamp,
    d.test_result,
    d.quantity_ml,
    d.hemoglobin_level,
    d.notes,
    d.created_at,
    dn.abo_group,
    dn.rh_factor,
    CONCAT(dn.abo_group, dn.rh_factor) as blood_type,
    dn.first_name || ' ' || dn.last_name as donor_name
FROM donations d
INNER JOIN donors dn ON d.donor_id = dn.donor_id;

-- View 3: inventory_summary
CREATE OR REPLACE VIEW inventory_summary AS
SELECT 
    dn.abo_group,
    dn.rh_factor,
    CONCAT(dn.abo_group, dn.rh_factor) as blood_type,
    COUNT(i.inventory_id) as total_units,
    SUM(CASE WHEN i.status = 'Available' THEN 1 ELSE 0 END) as available_units,
    SUM(CASE WHEN i.status = 'Reserved' THEN 1 ELSE 0 END) as reserved_units,
    SUM(CASE WHEN i.status = 'Issued' THEN 1 ELSE 0 END) as issued_units,
    SUM(CASE WHEN i.status = 'Expired' THEN 1 ELSE 0 END) as expired_units
FROM inventory i
INNER JOIN donations d ON i.donation_id = d.donation_id
INNER JOIN donors dn ON d.donor_id = dn.donor_id
GROUP BY dn.abo_group, dn.rh_factor;

-- Test 4: Check if triggers exist
SELECT tgname as trigger_name, tgrelid::regclass as table_name
FROM pg_trigger
WHERE tgname IN (
    'trigger_create_inventory_on_donation',
    'trigger_update_donor_on_donation',
    'trigger_auto_expire_inventory'
);

-- Test 5: Test sample data
SELECT h.name, COUNT(*) as campaign_count
FROM hospitals h
LEFT JOIN campaigns c ON h.hospital_id = c.hospital_id
GROUP BY h.hospital_id, h.name
ORDER BY h.name;

SELECT 
    CONCAT(abo_group, rh_factor) as blood_type,
    COUNT(*) as donor_count
FROM donors
GROUP BY abo_group, rh_factor
ORDER BY blood_type;
