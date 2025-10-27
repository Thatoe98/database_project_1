// =====================================================
// MAIN.JS - Common Functions Used Across Pages
// =====================================================

// ===== SUPABASE CRUD OPERATIONS =====

/**
 * Fetch all donors
 */
async function fetchDonors(filters = {}) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Use the view with calculated eligibility
        let query = supabase.from('donors_with_eligibility').select('*');
        
        // Apply filters based on actual schema
        if (filters.bloodType) {
            // Blood type is abo_group + rh_factor (e.g., "A+", "B-")
            const aboGroup = filters.bloodType.replace(/[+-]/g, '');
            const rhFactor = filters.bloodType.includes('+') ? '+' : '-';
            query = query.eq('abo_group', aboGroup).eq('rh_factor', rhFactor);
        }
        if (filters.city) {
            query = query.eq('city', filters.city);
        }
        if (filters.isEligible !== undefined) {
            const status = filters.isEligible ? 'Eligible' : 'Deferred';
            query = query.eq('calculated_eligibility', status);
        }
        if (filters.search) {
            query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,phone_number.ilike.%${filters.search}%`);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transform data to match frontend expectations
        return data?.map(donor => ({
            ...donor,
            full_name: `${donor.first_name} ${donor.last_name}`,
            blood_type: `${donor.abo_group}${donor.rh_factor}`,
            phone: donor.phone_number,
            is_eligible: donor.calculated_eligibility === 'Eligible',
            eligibility_status: donor.calculated_eligibility, // Add this for compatibility
            last_donation: donor.last_donation_date
        })) || [];
    } catch (error) {
        console.error('Error fetching donors:', error);
        throw error;
    }
}

/**
 * Fetch blood inventory
 */
async function fetchBloodInventory() {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Use the view that includes blood type from donors table (3NF)
        const { data, error } = await supabase
            .from('inventory_with_blood_type')
            .select('*')
            .order('blood_type');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
}

/**
 * Fetch blood inventory summary (aggregated by blood type)
 */
async function fetchBloodInventorySummary() {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Fetch all blood types and their counts
        const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const inventory = await fetchBloodInventory();
        
        // Aggregate by blood type
        const summary = bloodTypes.map(bloodType => {
            const units = inventory.filter(item => item.blood_type === bloodType);
            const totalUnits = units.length;
            const availableUnits = units.filter(u => u.status === 'Available').length;
            const reservedUnits = units.filter(u => u.status === 'Reserved').length;
            const minimum_threshold = 10; // Default threshold
            
            // Get latest update time
            const lastUpdated = units.length > 0 
                ? units.reduce((latest, item) => {
                    const itemDate = new Date(item.created_at);
                    return itemDate > latest ? itemDate : latest;
                  }, new Date(0))
                : new Date();
            
            return {
                blood_type: bloodType,
                total_units: totalUnits,
                available_units: availableUnits,
                reserved_units: reservedUnits,
                minimum_threshold,
                last_updated: lastUpdated.toISOString()
            };
        });
        
        return summary;
    } catch (error) {
        console.error('Error fetching inventory summary:', error);
        throw error;
    }
}

/**
 * Update blood inventory
 */
async function updateBloodInventory(inventoryId, updates) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Update the base inventory table (not the view)
        const { data, error } = await supabase
            .from('inventory')
            .update(updates)
            .eq('inventory_id', inventoryId)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating inventory:', error);
        throw error;
    }
}

/**
 * Fetch hospitals
 */
async function fetchHospitals(filters = {}) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        let query = supabase.from('hospitals').select('*');
        
        if (filters.city) {
            query = query.eq('city', filters.city);
        }
        if (filters.isActive !== undefined) {
            query = query.eq('is_active', filters.isActive);
        }
        if (filters.search) {
            query = query.or(`hospital_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
        }
        
        query = query.order('hospital_name');
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        throw error;
    }
}

/**
 * Fetch patients
 */
async function fetchPatients(filters = {}) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        let query = supabase
            .from('patients')
            .select(`
                *,
                hospitals (name, phone)
            `);
        
        if (filters.hospital_id) {
            query = query.eq('hospital_id', filters.hospital_id);
        }
        if (filters.bloodType) {
            const [abo, rh] = filters.bloodType.split(/([+-])/).filter(Boolean);
            query = query.eq('abo_group', abo).eq('rh_factor', rh);
        }
        if (filters.search) {
            query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,case_no.ilike.%${filters.search}%`);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
}

/**
 * Fetch donations
 */
async function fetchDonations(filters = {}) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        let query = supabase
            .from('donations')
            .select(`
                *,
                donors (first_name, last_name, phone_number, abo_group, rh_factor),
                campaigns (name)
            `);
        
        if (filters.bloodType) {
            query = query.eq('blood_type', filters.bloodType);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.donorId) {
            query = query.eq('donor_id', filters.donorId);
        }
        
        query = query.order('donation_date', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching donations:', error);
        throw error;
    }
}

/**
 * Fetch campaigns
 */
async function fetchCampaigns(filters = {}) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        let query = supabase
            .from('campaigns')
            .select(`
                *,
                hospitals (name, phone)
            `);
        
        if (filters.hospital_id) {
            query = query.eq('hospital_id', filters.hospital_id);
        }
        if (filters.search) {
            query = query.ilike('name', `%${filters.search}%`);
        }
        
        query = query.order('start_date', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
    }
}

// ===== DASHBOARD STATISTICS =====

/**
 * Get dashboard statistics
 */
async function getDashboardStats() {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Total donors
        const { count: donorCount } = await supabase
            .from('donors')
            .select('*', { count: 'exact', head: true });
        
        // Total hospitals
        const { count: hospitalCount } = await supabase
            .from('hospitals')
            .select('*', { count: 'exact', head: true });
        
        // Total patients
        const { count: patientCount } = await supabase
            .from('patients')
            .select('*', { count: 'exact', head: true });
        
        // Upcoming campaigns
        const today = formatDate(new Date());
        const { count: upcomingCampaigns } = await supabase
            .from('campaigns')
            .select('*', { count: 'exact', head: true })
            .gte('start_date', today);
        
        // Total inventory units (using view for 3NF)
        const { data: inventory } = await supabase
            .from('inventory_with_blood_type')
            .select('number_of_units, status')
            .eq('status', 'Available');
        
        const totalUnits = inventory?.reduce((sum, item) => sum + item.number_of_units, 0) || 0;
        
        // Low stock alerts (count by blood type)
        const { data: lowStock } = await supabase
            .from('inventory_summary')
            .select('*')
            .lt('available_units', 5);  // Alert if less than 5 units per blood type
        
        return {
            totalDonors: donorCount || 0,
            totalHospitals: hospitalCount || 0,
            totalPatients: patientCount || 0,
            upcomingCampaigns: upcomingCampaigns || 0,
            totalUnits: totalUnits,
            lowStockItems: lowStock || []
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
}

/**
 * Get low stock alerts
 */
async function getLowStockAlerts() {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Use inventory_summary view to check stock levels by blood type
        const { data, error } = await supabase
            .from('inventory_summary')
            .select('*')
            .lt('available_units', 5);  // Alert if less than 5 units per blood type
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching low stock alerts:', error);
        throw error;
    }
}

/**
 * Get recent activity (donations, requests, transfusions)
 */
async function getRecentActivity(limit = 10) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Recent donations
        const { data: donations } = await supabase
            .from('donations')
            .select('donation_date, donors(full_name), blood_type')
            .order('created_at', { ascending: false })
            .limit(limit);
        
        // Recent patients
        const { data: patients } = await supabase
            .from('patients')
            .select('created_at, hospitals(hospital_name), blood_type, status')
            .order('created_at', { ascending: false })
            .limit(limit);
        
        return {
            donations: donations || [],
            patients: patients || []
        };
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        throw error;
    }
}

// ===== INVENTORY MANAGEMENT =====

/**
 * Add units to inventory (after donation approval)
 */
async function addToInventory(bloodType, units) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Get current inventory
        const { data: current } = await supabase
            .from('blood_inventory')
            .select('*')
            .eq('blood_type', bloodType)
            .single();
        
        if (!current) throw new Error('Blood type not found in inventory');
        
        // Update inventory
        const { data, error } = await supabase
            .from('blood_inventory')
            .update({
                total_units: current.total_units + units,
                available_units: current.available_units + units,
                last_updated: new Date().toISOString()
            })
            .eq('blood_type', bloodType)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error adding to inventory:', error);
        throw error;
    }
}

/**
 * Remove units from inventory (after transfusion)
 */
async function removeFromInventory(bloodType, units) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Get current inventory
        const { data: current } = await supabase
            .from('blood_inventory')
            .select('*')
            .eq('blood_type', bloodType)
            .single();
        
        if (!current) throw new Error('Blood type not found in inventory');
        if (current.available_units < units) throw new Error('Insufficient units available');
        
        // Update inventory
        const { data, error } = await supabase
            .from('blood_inventory')
            .update({
                available_units: current.available_units - units,
                last_updated: new Date().toISOString()
            })
            .eq('blood_type', bloodType)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error removing from inventory:', error);
        throw error;
    }
}

/**
 * Reserve units (when request is approved)
 */
async function reserveUnits(bloodType, units) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Get current inventory
        const { data: current } = await supabase
            .from('blood_inventory')
            .select('*')
            .eq('blood_type', bloodType)
            .single();
        
        if (!current) throw new Error('Blood type not found in inventory');
        if (current.available_units < units) throw new Error('Insufficient units available');
        
        // Update inventory
        const { data, error } = await supabase
            .from('blood_inventory')
            .update({
                available_units: current.available_units - units,
                reserved_units: current.reserved_units + units,
                last_updated: new Date().toISOString()
            })
            .eq('blood_type', bloodType)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error reserving units:', error);
        throw error;
    }
}

/**
 * Fulfill reserved units (when transfusion is completed)
 */
async function fulfillReservedUnits(bloodType, units) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Get current inventory
        const { data: current } = await supabase
            .from('blood_inventory')
            .select('*')
            .eq('blood_type', bloodType)
            .single();
        
        if (!current) throw new Error('Blood type not found in inventory');
        if (current.reserved_units < units) throw new Error('Not enough reserved units');
        
        // Update inventory
        const { data, error } = await supabase
            .from('blood_inventory')
            .update({
                reserved_units: current.reserved_units - units,
                total_units: current.total_units - units,
                last_updated: new Date().toISOString()
            })
            .eq('blood_type', bloodType)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error fulfilling reserved units:', error);
        throw error;
    }
}

/**
 * Check inventory availability
 */
async function checkInventoryAvailability(bloodType, unitsNeeded) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        const { data, error } = await supabase
            .from('blood_inventory')
            .select('available_units')
            .eq('blood_type', bloodType)
            .single();
        
        if (error) throw error;
        
        return {
            available: data.available_units >= unitsNeeded,
            currentUnits: data.available_units,
            unitsNeeded: unitsNeeded,
            shortage: Math.max(0, unitsNeeded - data.available_units)
        };
    } catch (error) {
        console.error('Error checking inventory availability:', error);
        throw error;
    }
}

// ===== DONOR MANAGEMENT =====

/**
 * Update donor's last donation date and total donations
 */
async function updateDonorStats(donorId) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        // Get donor's current stats
        const { data: donor } = await supabase
            .from('donors')
            .select('total_donations')
            .eq('donor_id', donorId)
            .single();
        
        // Update donor
        const { data, error } = await supabase
            .from('donors')
            .update({
                last_donation_date: formatDate(new Date()),
                total_donations: (donor?.total_donations || 0) + 1,
                is_eligible: false // Will be eligible again after 90 days
            })
            .eq('donor_id', donorId)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating donor stats:', error);
        throw error;
    }
}

/**
 * Check and update donor eligibility
 */
async function updateDonorEligibility(donorId) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        const { data: donor } = await supabase
            .from('donors')
            .select('*')
            .eq('donor_id', donorId)
            .single();
        
        if (!donor) throw new Error('Donor not found');
        
        // Check eligibility criteria
        const isAgeValid = validateAge(donor.date_of_birth, 18, 65);
        const isWeightValid = validateWeight(donor.weight_kg, 50);
        const isDonationIntervalValid = checkDonorEligibility(donor.last_donation_date);
        
        const isEligible = isAgeValid && isWeightValid && isDonationIntervalValid;
        
        // Update eligibility status
        if (donor.is_eligible !== isEligible) {
            const { data, error } = await supabase
                .from('donors')
                .update({ is_eligible: isEligible })
                .eq('donor_id', donorId)
                .select();
            
            if (error) throw error;
            return data[0];
        }
        
        return donor;
    } catch (error) {
        console.error('Error updating donor eligibility:', error);
        throw error;
    }
}

// ===== GENERIC CRUD OPERATIONS =====

/**
 * Generic insert function
 */
async function insertRecord(table, data) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        const { data: result, error } = await supabase
            .from(table)
            .insert(data)
            .select();
        
        if (error) throw error;
        return result[0];
    } catch (error) {
        console.error(`Error inserting into ${table}:`, error);
        throw error;
    }
}

/**
 * Generic update function
 */
async function updateRecord(table, id, idColumn, data) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        const { data: result, error } = await supabase
            .from(table)
            .update(data)
            .eq(idColumn, id)
            .select();
        
        if (error) throw error;
        return result[0];
    } catch (error) {
        console.error(`Error updating ${table}:`, error);
        throw error;
    }
}

/**
 * Generic delete function
 */
async function deleteRecord(table, id, idColumn) {
    try {
        if (!supabase) throw new Error('Supabase not initialized');
        
        const { error } = await supabase
            .from(table)
            .delete()
            .eq(idColumn, id);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Error deleting from ${table}:`, error);
        throw error;
    }
}

// ===== REAL-TIME SUBSCRIPTIONS =====

/**
 * Subscribe to inventory changes
 */
function subscribeToInventoryChanges(callback) {
    if (!supabase) {
        console.error('Supabase not initialized');
        return null;
    }
    
    const subscription = supabase
        .channel('inventory-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'blood_inventory' },
            callback
        )
        .subscribe();
    
    return subscription;
}

/**
 * Unsubscribe from real-time updates
 */
function unsubscribe(subscription) {
    if (subscription) {
        supabase.removeChannel(subscription);
    }
}

// Export functions for use in other scripts
// All functions are globally available
