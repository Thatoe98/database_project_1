-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================
-- This will populate your database with test data

-- Sample Hospitals
INSERT INTO hospitals (name, type, phone, email, address, city, state, postal_code)
VALUES 
    ('City General Hospital', 'Public', '+1-555-0001', 'admin@citygen.hospital', '100 Hospital Blvd', 'New York', 'NY', '10001'),
    ('St. Mary Medical Center', 'Private', '+1-555-0002', 'contact@stmary.hospital', '200 Healthcare Ave', 'Los Angeles', 'CA', '90001'),
    ('Metro Health Institute', 'Public', '+1-555-0003', 'info@metrohealth.hospital', '300 Medical Plaza', 'Chicago', 'IL', '60601'),
    ('Community Care Hospital', 'Non-profit', '+1-555-0004', 'service@commcare.hospital', '400 Wellness Dr', 'Houston', 'TX', '77001'),
    ('Phoenix Regional Medical', 'Private', '+1-555-0005', 'admin@phoenixmed.hospital', '500 Care Center Rd', 'Phoenix', 'AZ', '85001')
ON CONFLICT DO NOTHING;

-- Sample Donors (all 8 blood types)
INSERT INTO donors (first_name, last_name, date_of_birth, sex, phone_number, email, abo_group, rh_factor, last_donation_date, eligibility_status, notes)
VALUES 
    ('John', 'Smith', '1990-05-15', 'Male', '+1-234-567-8901', 'john.smith@email.com', 'O', '+', '2024-08-15', 'Eligible', NULL),
    ('Emily', 'Johnson', '1985-08-22', 'Female', '+1-234-567-8902', 'emily.j@email.com', 'A', '+', '2024-09-10', 'Eligible', NULL),
    ('Michael', 'Brown', '1992-03-10', 'Male', '+1-234-567-8903', 'michael.b@email.com', 'B', '+', '2024-07-20', 'Eligible', NULL),
    ('Sarah', 'Davis', '1988-11-30', 'Female', '+1-234-567-8904', 'sarah.d@email.com', 'AB', '+', '2024-09-25', 'Eligible', NULL),
    ('David', 'Wilson', '1995-01-18', 'Male', '+1-234-567-8905', 'david.w@email.com', 'O', '-', '2024-08-05', 'Eligible', NULL),
    ('Jessica', 'Martinez', '1987-07-25', 'Female', '+1-234-567-8906', 'jessica.m@email.com', 'A', '-', '2024-09-15', 'Eligible', NULL),
    ('James', 'Anderson', '1993-09-12', 'Male', '+1-234-567-8907', 'james.a@email.com', 'B', '-', '2024-08-28', 'Eligible', NULL),
    ('Jennifer', 'Taylor', '1991-04-05', 'Female', '+1-234-567-8908', 'jennifer.t@email.com', 'AB', '-', '2024-09-20', 'Eligible', NULL)
ON CONFLICT (phone_number) DO NOTHING;

-- Sample Campaigns
INSERT INTO campaigns (hospital_id, name, start_date, end_date, location, notes)
SELECT 
    hospital_id,
    'Community Blood Drive 2024',
    '2024-11-15',
    '2024-11-15',
    'Central Community Center',
    'Annual drive'
FROM hospitals WHERE name = 'City General Hospital'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO campaigns (hospital_id, name, start_date, end_date, location, notes)
SELECT 
    hospital_id,
    'University Campus Donation',
    '2024-11-20',
    '2024-11-20',
    'University Main Hall',
    'Student initiative'
FROM hospitals WHERE name = 'St. Mary Medical Center'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Sample Patients
INSERT INTO patients (hospital_id, case_no, first_name, last_name, date_of_birth, sex, abo_group, rh_factor, diagnosis, notes)
SELECT 
    hospital_id,
    'CASE-2024-001',
    'Robert',
    'Miller',
    '1975-03-20',
    'Male',
    'O',
    '+',
    'Anemia',
    'Requires transfusion'
FROM hospitals WHERE name = 'City General Hospital'
LIMIT 1
ON CONFLICT (case_no) DO NOTHING;

INSERT INTO patients (hospital_id, case_no, first_name, last_name, date_of_birth, sex, abo_group, rh_factor, diagnosis, notes)
SELECT 
    hospital_id,
    'CASE-2024-002',
    'Linda',
    'Garcia',
    '1982-06-15',
    'Female',
    'A',
    '+',
    'Post-surgery',
    'Blood loss during surgery'
FROM hospitals WHERE name = 'St. Mary Medical Center'
LIMIT 1
ON CONFLICT (case_no) DO NOTHING;

-- Verify data was inserted
SELECT 'Sample data inserted successfully!' as status;
SELECT COUNT(*) as hospital_count FROM hospitals;
SELECT COUNT(*) as donor_count FROM donors;
SELECT COUNT(*) as campaign_count FROM campaigns;
SELECT COUNT(*) as patient_count FROM patients;
