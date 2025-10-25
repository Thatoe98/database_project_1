# Database Schema Diagram - 3NF Normalized

## Visual Schema Representation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BLOOD INVENTORY MANAGEMENT SYSTEM                        │
│                         3NF Normalized Schema                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│      HOSPITALS           │  ← INDEPENDENT TABLE (No FK)
├──────────────────────────┤
│ PK: hospital_id (UUID)   │
│     name                 │
│     type                 │
│     phone                │
│     email                │
│     address, city, state │
│     postal_code          │
└──────────────────────────┘
        │
        │ (Referenced by campaigns, patients, donations, inventory)
        │
        ├───────────────────────────────────────┐
        │                                       │
        ↓                                       ↓
┌──────────────────────────┐          ┌──────────────────────────┐
│      CAMPAIGNS           │          │       PATIENTS           │
├──────────────────────────┤          ├──────────────────────────┤
│ PK: campaign_id (UUID)   │          │ PK: patient_id (UUID)    │
│ FK: hospital_id          │──────┐   │ FK: hospital_id          │
│     name                 │      │   │     case_no (UNIQUE)     │
│     start_date           │      │   │     first_name, last_name│
│     end_date             │      │   │     date_of_birth, sex   │
│     location             │      │   │     abo_group, rh_factor │
│     notes                │      │   │     diagnosis, notes     │
└──────────────────────────┘      │   └──────────────────────────┘
                                  │
                                  │   ┌──────────────────────────┐
                                  │   │       DONORS             │  ← INDEPENDENT TABLE
                                  │   ├──────────────────────────┤     (Blood Type Source)
                                  │   │ PK: donor_id (UUID)      │
                                  │   │     first_name, last_name│
                                  │   │     date_of_birth, sex   │
                                  │   │     phone_number (UNIQUE)│
                                  │   │     email (UNIQUE)       │
                                  │   │  ★  abo_group           │  ★ ONLY place blood
                                  │   │  ★  rh_factor           │    type is stored!
                                  │   │     last_donation_date   │
                                  │   │     eligibility_status   │
                                  │   │     notes                │
                                  │   └──────────────────────────┘
                                  │            │
                                  │            │ (Referenced by donations)
                                  │            │
                                  │            ↓
                                  │   ┌──────────────────────────┐
                                  └──→│      DONATIONS           │
                                      ├──────────────────────────┤
                                      │ PK: donation_id (UUID)   │
                                      │ FK: donor_id             │─────┐
                                      │ FK: hospital_id          │     │
                                      │ FK: campaign_id (NULL OK)│     │
                                      │     donation_timestamp   │     │
                                      │     test_result          │     │
                                      │     quantity_ml          │     │
                                      │     hemoglobin_level     │     │
                                      │     notes                │     │
                                      │                          │     │
                                      │ ❌ NO abo_group          │     │
                                      │ ❌ NO rh_factor          │     │
                                      │ (Derive from donors)     │     │
                                      └──────────────────────────┘     │
                                               │                       │
                                               │ (Referenced by        │
                                               │  inventory)           │
                                               │                       │
                                               ↓                       │
                                      ┌──────────────────────────┐     │
                                      │      INVENTORY           │     │
                                      ├──────────────────────────┤     │
                                      │ PK: inventory_id (UUID)  │     │
                                      │ FK: donation_id (UNIQUE) │◄────┘
                                      │ FK: hospital_id          │      1:1 Relationship
                                      │     number_of_units      │      (One donation =
                                      │     collection_ts        │       One inventory)
                                      │     expiry_ts            │
                                      │     status               │
                                      │     notes                │
                                      │                          │
                                      │ ❌ NO abo_group          │
                                      │ ❌ NO rh_factor          │
                                      │ (Derive from donations→donors)
                                      └──────────────────────────┘
```

## Blood Type Derivation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  HOW BLOOD TYPE IS DERIVED                      │
└─────────────────────────────────────────────────────────────────┘

   DONORS TABLE                DONATIONS TABLE              INVENTORY TABLE
   ════════════                ════════════════             ════════════════
   
   donor_id: A1                donation_id: D1              inventory_id: I1
   abo_group: "O"  ─────────→  donor_id: A1     ─────────→  donation_id: D1
   rh_factor: "+"              test_result: "Accepted"      status: "Available"
   
   ★ STORED HERE               ❌ NOT stored here           ❌ NOT stored here
   (Single source              (Get from donors             (Get from donations
    of truth)                   via donor_id)                via donation_id)


   QUERY EXAMPLE:
   ══════════════
   
   -- Get inventory with blood type
   SELECT i.inventory_id, 
          CONCAT(d.abo_group, d.rh_factor) as blood_type,
          i.status
   FROM inventory i
   INNER JOIN donations don ON i.donation_id = don.donation_id
   INNER JOIN donors d ON don.donor_id = d.donor_id;
   
   -- OR use the view (easier):
   SELECT * FROM inventory_with_blood_type;
```

## Foreign Key Relationships

```
┌──────────────────────────────────────────────────────────────────┐
│                   FOREIGN KEY DEPENDENCIES                       │
└──────────────────────────────────────────────────────────────────┘

1. campaigns.hospital_id       →  hospitals.hospital_id
2. patients.hospital_id        →  hospitals.hospital_id
3. donations.donor_id          →  donors.donor_id
4. donations.hospital_id       →  hospitals.hospital_id
5. donations.campaign_id       →  campaigns.campaign_id  (NULL OK)
6. inventory.donation_id       →  donations.donation_id  (UNIQUE)
7. inventory.hospital_id       →  hospitals.hospital_id

CASCADING RULES:
═══════════════
- Delete hospital    → CASCADE deletes campaigns, patients, donations, inventory
- Delete donor       → CASCADE deletes donations (and their inventory)
- Delete campaign    → SET NULL in donations.campaign_id
- Delete donation    → CASCADE deletes inventory
```

## Database Normalization Status

```
┌──────────────────────────────────────────────────────────────────┐
│                    3NF COMPLIANCE CHECK                          │
└──────────────────────────────────────────────────────────────────┘

✅ First Normal Form (1NF)
   • All attributes contain atomic values
   • No repeating groups
   • Each cell contains single value

✅ Second Normal Form (2NF)
   • Meets 1NF requirements
   • All non-key attributes fully depend on primary key
   • No partial dependencies

✅ Third Normal Form (3NF)
   • Meets 2NF requirements
   • No transitive dependencies
   • Blood type stored ONLY in donors table
   • Other tables derive through foreign keys
   
   BEFORE (Violated 3NF):
   ─────────────────────
   donations:  abo_group, rh_factor ← REDUNDANT
   inventory:  abo_group, rh_factor ← REDUNDANT
   donors:     abo_group, rh_factor ← Original
   
   AFTER (3NF Compliant):
   ─────────────────────
   donations:  (no blood type) ← Derive from donors
   inventory:  (no blood type) ← Derive from donations→donors
   donors:     abo_group, rh_factor ← ONLY PLACE STORED
```

## Helper Views for Transparent Querying

```
┌──────────────────────────────────────────────────────────────────┐
│                     DATABASE VIEWS                               │
└──────────────────────────────────────────────────────────────────┘

VIEW 1: inventory_with_blood_type
══════════════════════════════════
Purpose: Show inventory with blood type from donors
Query:   SELECT i.*, dn.abo_group, dn.rh_factor,
                CONCAT(dn.abo_group, dn.rh_factor) as blood_type
         FROM inventory i
         INNER JOIN donations d ON i.donation_id = d.donation_id
         INNER JOIN donors dn ON d.donor_id = dn.donor_id;

Usage:   SELECT * FROM inventory_with_blood_type 
         WHERE blood_type = 'O+' AND status = 'Available';


VIEW 2: donations_with_blood_type
═══════════════════════════════════
Purpose: Show donations with donor blood type and name
Query:   SELECT d.*, dn.abo_group, dn.rh_factor,
                CONCAT(dn.abo_group, dn.rh_factor) as blood_type,
                dn.first_name || ' ' || dn.last_name as donor_name
         FROM donations d
         INNER JOIN donors dn ON d.donor_id = dn.donor_id;

Usage:   SELECT * FROM donations_with_blood_type 
         WHERE test_result = 'Accepted';


VIEW 3: inventory_summary
═════════════════════════
Purpose: Aggregate inventory statistics by blood type
Query:   SELECT dn.abo_group, dn.rh_factor,
                CONCAT(dn.abo_group, dn.rh_factor) as blood_type,
                COUNT(i.inventory_id) as total_units,
                SUM(CASE WHEN i.status = 'Available' THEN 1 ELSE 0 END) as available
         FROM inventory i
         INNER JOIN donations d ON i.donation_id = d.donation_id
         INNER JOIN donors dn ON d.donor_id = dn.donor_id
         GROUP BY dn.abo_group, dn.rh_factor;

Usage:   SELECT blood_type, available_units 
         FROM inventory_summary 
         ORDER BY blood_type;
```

## Automated Triggers

```
┌──────────────────────────────────────────────────────────────────┐
│                    DATABASE TRIGGERS                             │
└──────────────────────────────────────────────────────────────────┘

TRIGGER 1: create_inventory_on_accepted_donation
════════════════════════════════════════════════
When:   AFTER INSERT or UPDATE on donations
If:     NEW.test_result = 'Accepted'
Then:   INSERT INTO inventory (
           donation_id, hospital_id, number_of_units,
           collection_ts, expiry_ts (35 days), status='Available'
        )
Effect: Automatically creates inventory when donation approved


TRIGGER 2: update_donor_on_donation
═══════════════════════════════════
When:   AFTER INSERT on donations
Then:   UPDATE donors SET
           last_donation_date = NEW.donation_timestamp,
           eligibility_status = 'Deferred' (for 56 days)
        WHERE donor_id = NEW.donor_id
Effect: Updates donor eligibility automatically


TRIGGER 3: auto_expire_inventory
════════════════════════════════
When:   BEFORE UPDATE on inventory
If:     NEW.expiry_ts < NOW() AND NEW.status = 'Available'
Then:   SET NEW.status = 'Expired'
Effect: Automatically expires old blood units
```

## Table Indexes

```
┌──────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE INDEXES                           │
└──────────────────────────────────────────────────────────────────┘

DONORS TABLE:
- idx_donors_phone           ON phone_number
- idx_donors_blood_type      ON (abo_group, rh_factor)
- idx_donors_eligibility     ON eligibility_status

PATIENTS TABLE:
- idx_patients_case_no       ON case_no
- idx_patients_hospital      ON hospital_id
- idx_patients_blood_type    ON (abo_group, rh_factor)

DONATIONS TABLE:
- idx_donations_donor        ON donor_id
- idx_donations_hospital     ON hospital_id
- idx_donations_campaign     ON campaign_id
- idx_donations_test_result  ON test_result
- idx_donations_timestamp    ON donation_timestamp

INVENTORY TABLE:
- idx_inventory_donation     ON donation_id
- idx_inventory_hospital     ON hospital_id
- idx_inventory_status       ON status
- idx_inventory_expiry       ON expiry_ts

CAMPAIGNS TABLE:
- idx_campaigns_hospital     ON hospital_id
- idx_campaigns_dates        ON (start_date, end_date)
```

## Data Integrity Constraints

```
┌──────────────────────────────────────────────────────────────────┐
│                  INTEGRITY CONSTRAINTS                           │
└──────────────────────────────────────────────────────────────────┘

CHECK CONSTRAINTS:
═════════════════
✓ donors.sex              IN ('Male', 'Female', 'Other')
✓ donors.abo_group        IN ('A', 'B', 'AB', 'O')
✓ donors.rh_factor        IN ('+', '-')
✓ donors.eligibility      IN ('Eligible', 'Ineligible', 'Deferred')
✓ patients.sex            IN ('Male', 'Female', 'Other')
✓ patients.abo_group      IN ('A', 'B', 'AB', 'O')
✓ patients.rh_factor      IN ('+', '-')
✓ donations.test_result   IN ('Pending', 'Accepted', 'Rejected')
✓ donations.quantity_ml   > 0
✓ inventory.number_of_units > 0
✓ inventory.status        IN ('Available', 'Reserved', 'Issued', 'Expired', 'Discarded')

UNIQUE CONSTRAINTS:
══════════════════
✓ donors.phone_number     UNIQUE
✓ donors.email            UNIQUE
✓ patients.case_no        UNIQUE
✓ inventory.donation_id   UNIQUE (1:1 with donations)

NOT NULL CONSTRAINTS:
════════════════════
✓ All primary keys (UUID)
✓ All foreign keys (except nullable ones)
✓ donors: first_name, last_name, date_of_birth, phone, abo_group, rh_factor
✓ hospitals: name, phone, address, city, state, postal_code
✓ donations: donor_id, hospital_id, donation_timestamp
✓ inventory: donation_id, hospital_id, collection_ts, expiry_ts
```

---

**Schema Design**: Third Normal Form (3NF) Compliant
**Referential Integrity**: Enforced via Foreign Keys
**Data Integrity**: Enforced via CHECK and UNIQUE Constraints
**Automation**: 3 Triggers for Business Logic
**Query Optimization**: 15 Indexes on Frequently Accessed Columns
**Abstraction Layer**: 3 Views for Transparent Data Access

