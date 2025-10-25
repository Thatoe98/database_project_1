-- =====================================================
-- TEST SCRIPT FOR INVENTORY TRIGGERS
-- =====================================================
-- Run this after setting up the database to verify triggers work correctly

-- =====================================================
-- Step 1: Check Initial Inventory
-- =====================================================
SELECT 'Initial Inventory' as step;
SELECT blood_type, total_units, available_units, reserved_units 
FROM blood_inventory 
ORDER BY blood_type;

-- =====================================================
-- Step 2: Test Donation → Inventory (Trigger 1)
-- =====================================================
-- Add a new donation with status 'Available'
INSERT INTO donations (donor_id, blood_type, quantity_ml, status) 
VALUES (
    (SELECT donor_id FROM donors WHERE blood_type = 'O+' LIMIT 1),
    'O+',
    450,
    'Available'
);

SELECT 'After Adding Available Donation' as step;
SELECT blood_type, total_units, available_units, reserved_units 
FROM blood_inventory 
WHERE blood_type = 'O+';

-- =====================================================
-- Step 3: Test Blood Request → Reserve (Trigger 5)
-- =====================================================
-- Create and approve a blood request
INSERT INTO blood_requests (hospital_id, patient_name, blood_type, units_requested, urgency_level, status)
VALUES (
    (SELECT hospital_id FROM hospitals LIMIT 1),
    'Test Patient',
    'A+',
    2,
    'Normal',
    'Pending'
) RETURNING request_id;

-- Update to Approved (this should reserve units)
UPDATE blood_requests
SET status = 'Approved'
WHERE patient_name = 'Test Patient';

SELECT 'After Approving Request' as step;
SELECT blood_type, total_units, available_units, reserved_units 
FROM blood_inventory 
WHERE blood_type = 'A+';

-- =====================================================
-- Step 4: Test Transfusion → Inventory (Trigger 2 & 4)
-- =====================================================
-- Issue blood transfusion
INSERT INTO blood_transfusions (
    request_id,
    hospital_id,
    patient_name,
    blood_type,
    units_issued,
    issued_by
)
VALUES (
    (SELECT request_id FROM blood_requests WHERE patient_name = 'Test Patient'),
    (SELECT hospital_id FROM hospitals LIMIT 1),
    'Test Patient',
    'A+',
    2,
    'Dr. Test'
);

SELECT 'After Transfusion' as step;
SELECT blood_type, total_units, available_units, reserved_units 
FROM blood_inventory 
WHERE blood_type = 'A+';

-- Check request status (should be 'Fulfilled')
SELECT request_id, patient_name, status, fulfilled_date
FROM blood_requests
WHERE patient_name = 'Test Patient';

-- =====================================================
-- Step 5: Test Donor Stats Update (Trigger 3)
-- =====================================================
SELECT 'Donor Stats After Donation' as step;
SELECT full_name, blood_type, total_donations, last_donation_date, is_eligible
FROM donors
WHERE blood_type = 'O+'
ORDER BY created_at DESC
LIMIT 3;

-- =====================================================
-- Step 6: Final Inventory Summary
-- =====================================================
SELECT 'Final Inventory Summary' as step;
SELECT 
    blood_type,
    total_units,
    available_units,
    reserved_units,
    (total_units - available_units - reserved_units) as used_units,
    CASE 
        WHEN available_units < minimum_threshold THEN '⚠️ LOW STOCK'
        ELSE '✅ OK'
    END as status
FROM blood_inventory
ORDER BY blood_type;

-- =====================================================
-- Cleanup Test Data (Optional)
-- =====================================================
-- Uncomment below to clean up test data:

-- DELETE FROM blood_transfusions WHERE patient_name = 'Test Patient';
-- DELETE FROM blood_requests WHERE patient_name = 'Test Patient';
-- DELETE FROM donations WHERE donation_id = (SELECT donation_id FROM donations ORDER BY created_at DESC LIMIT 1);

-- =====================================================
-- END OF TEST
-- =====================================================
