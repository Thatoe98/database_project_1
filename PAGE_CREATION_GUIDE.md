# Creating Remaining HTML Pages

This guide will help you create the remaining pages using the established patterns from index.html, donors.html, and inventory.html.

## Pages to Create

1. **donations.html** - Record and manage blood donations
2. **hospitals.html** - Register and manage partner hospitals
3. **requests.html** - Handle blood requests from hospitals
4. **camps.html** - Schedule and manage blood donation camps
5. **transfusions.html** - Record blood transfusions

## Common Structure for All Pages

All pages follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Same head content as other pages -->
</head>
<body>
    <button class="menu-toggle">☰</button>
    
    <div class="app-container">
        <!-- Sidebar (copy from any existing page) -->
        <aside class="sidebar">...</aside>
        
        <!-- Main Content -->
        <main class="main-content">
            <header class="page-header">...</header>
            <div class="page-content">
                <!-- Page-specific content -->
            </div>
        </main>
    </div>
    
    <!-- Modals -->
    
    <!-- Scripts -->
    <script>
        window.ENV = {
            SUPABASE_URL: 'YOUR_SUPABASE_URL',
            SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY'
        };
    </script>
    <script src="js/config.js"></script>
    <script src="js/supabase.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/main.js"></script>
    <script>
        // Page-specific JavaScript
    </script>
</body>
</html>
```

## donations.html - Key Features

### Page Content:
- Search bar (by donor name)
- Filters: blood type, status, date range, camp
- Table columns: donation date, donor name, blood type, quantity (ml), hemoglobin, blood pressure, status, actions
- "Record Donation" button

### Modal Form Fields:
- Donor search/select (autocomplete dropdown)
- Blood camp (optional dropdown)
- Donation date (default: today)
- Blood type (auto-fill from donor)
- Quantity (ml) - default 450
- Hemoglobin level
- Blood pressure
- Status (Collected/Tested/Available/Expired/Used)
- Notes

### JavaScript Functions:
```javascript
async function loadDonations() {
    const donations = await fetchDonations();
    displayDonations(donations);
}

async function saveDonation(event) {
    event.preventDefault();
    const donationData = { /* form data */ };
    await insertRecord('donations', donationData);
    
    // If status is "Available", update inventory
    if (donationData.status === 'Available') {
        const units = Math.floor(donationData.quantity_ml / 450);
        await addToInventory(donationData.blood_type, units);
        await updateDonorStats(donationData.donor_id);
    }
    
    await loadDonations();
}
```

## hospitals.html - Key Features

### Page Content:
- Search bar (by name or phone)
- Filters: city, active status
- Table columns: hospital name, contact person, phone, email, city, license number, status, actions

### Modal Form Fields:
- Hospital name *
- Contact person
- Phone *
- Email
- Address *
- City
- License number (unique)
- Active status checkbox

### JavaScript Functions:
```javascript
async function loadHospitals() {
    const hospitals = await fetchHospitals();
    displayHospitals(hospitals);
}

async function saveHospital(event) {
    event.preventDefault();
    const hospitalData = { /* form data */ };
    await insertRecord('hospitals', hospitalData);
    await loadHospitals();
}

async function toggleHospitalStatus(hospitalId, currentStatus) {
    await updateRecord('hospitals', hospitalId, 'hospital_id', { is_active: !currentStatus });
    await loadHospitals();
}
```

## requests.html - Key Features

### Page Content:
- Filters: status, urgency, blood type, date range
- Table columns: request ID (first 8 chars), hospital name, patient name, blood type, units requested, urgency (badge), status (badge), request date, required by, actions
- "New Request" button

### Modal Form Fields:
- Hospital (dropdown) *
- Patient name *
- Blood type *
- Units requested *
- Urgency level (Emergency/Urgent/Normal) *
- Required by date
- Notes

### JavaScript Functions:
```javascript
async function loadRequests() {
    const requests = await fetchBloodRequests();
    displayRequests(requests);
}

async function saveRequest(event) {
    event.preventDefault();
    const requestData = { /* form data */ };
    
    // Check inventory availability
    const availability = await checkInventoryAvailability(
        requestData.blood_type, 
        requestData.units_requested
    );
    
    if (!availability.available && requestData.urgency_level === 'Emergency') {
        showToast(`Warning: Only ${availability.currentUnits} units available, but ${requestData.units_requested} requested`, 'warning');
    }
    
    await insertRecord('blood_requests', requestData);
    await loadRequests();
}

async function approveRequest(requestId) {
    const request = requests.find(r => r.request_id === requestId);
    
    // Check and reserve units
    const availability = await checkInventoryAvailability(request.blood_type, request.units_requested);
    if (!availability.available) {
        showToast('Insufficient blood units available', 'error');
        return;
    }
    
    await reserveUnits(request.blood_type, request.units_requested);
    await updateRecord('blood_requests', requestId, 'request_id', { status: 'Approved' });
    await loadRequests();
}

async function fulfillRequest(requestId) {
    // Navigate to transfusions page or open transfusion modal
    window.location.href = `transfusions.html?request=${requestId}`;
}
```

## camps.html - Key Features

### Page Content:
- Filters: status, date range, city
- Table columns: camp name, location, date, time, expected donors, actual donors, units collected, status (badge), actions

### Modal Form Fields:
- Camp name *
- Organizer
- Location *
- City
- Camp date *
- Start time
- End time
- Expected donors (number)
- Status (Scheduled/Ongoing/Completed/Cancelled)

### JavaScript Functions:
```javascript
async function loadCamps() {
    const camps = await fetchBloodCamps();
    displayCamps(camps);
}

async function saveCamp(event) {
    event.preventDefault();
    const campData = { /* form data */ };
    await insertRecord('blood_camps', campData);
    await loadCamps();
}

async function updateCampStats(campId) {
    // Count donations linked to this camp
    const donations = await fetchDonations({ campId });
    const actualDonors = donations.length;
    const totalUnits = donations.reduce((sum, d) => sum + Math.floor(d.quantity_ml / 450), 0);
    
    await updateRecord('blood_camps', campId, 'camp_id', {
        actual_donors: actualDonors,
        total_units_collected: totalUnits
    });
    
    await loadCamps();
}
```

## transfusions.html - Key Features

### Page Content:
- Filters: date range, hospital, blood type
- Table columns: transfusion date, hospital name, patient name, blood type, units issued, issued by, notes, actions

### Modal Form Fields:
- Request ID (optional, can link to approved request)
- Hospital (dropdown) *
- Patient name *
- Blood type *
- Units issued *
- Issued by (staff name)
- Notes

### JavaScript Functions:
```javascript
async function loadTransfusions() {
    const transfusions = await fetchTransfusions();
    displayTransfusions(transfusions);
}

async function saveTransfusion(event) {
    event.preventDefault();
    const transfusionData = { /* form data */ };
    
    // Check inventory
    const availability = await checkInventoryAvailability(
        transfusionData.blood_type, 
        transfusionData.units_issued
    );
    
    if (!availability.available) {
        showToast('Insufficient blood units available', 'error');
        return;
    }
    
    // Create transfusion record
    await insertRecord('blood_transfusions', transfusionData);
    
    // Update inventory (remove units)
    if (transfusionData.request_id) {
        // If linked to request, fulfill reserved units
        await fulfillReservedUnits(transfusionData.blood_type, transfusionData.units_issued);
        
        // Update request status
        await updateRecord('blood_requests', transfusionData.request_id, 'request_id', {
            status: 'Fulfilled',
            fulfilled_date: new Date().toISOString()
        });
    } else {
        // Direct transfusion, remove from available
        await removeFromInventory(transfusionData.blood_type, transfusionData.units_issued);
    }
    
    await loadTransfusions();
}
```

## Tips for Quick Development

1. **Copy from existing pages**: Use donors.html as template
2. **Update navigation**: Ensure correct nav-link has "active" class
3. **Update page title**: Change in <h1> and <title>
4. **Modify table columns**: Update <thead> and table body rendering
5. **Update form fields**: Modify modal form based on database schema
6. **Update JavaScript functions**: Change table name and field names
7. **Test each page**: Verify CRUD operations work

## Testing Checklist

For each page:
- [ ] Page loads without errors
- [ ] Data displays in table
- [ ] Search/filters work
- [ ] Modal opens and closes
- [ ] Form validation works
- [ ] Create new record works
- [ ] Edit record works
- [ ] Delete record works (with confirmation)
- [ ] Responsive design works on mobile
- [ ] Real-time updates work (if applicable)

## Common Code Snippets

### Donor Autocomplete for Donations
```javascript
async function loadDonorOptions() {
    const donors = await fetchDonors();
    const select = document.getElementById('donorId');
    select.innerHTML = '<option value="">Select Donor...</option>' +
        donors.map(d => `<option value="${d.donor_id}" data-bloodtype="${d.blood_type}">
            ${d.full_name} (${d.blood_type}) - ${d.phone}
        </option>`).join('');
}

// Auto-fill blood type when donor selected
document.getElementById('donorId').addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const bloodType = selectedOption.getAttribute('data-bloodtype');
    if (bloodType) {
        document.getElementById('bloodType').value = bloodType;
        document.getElementById('bloodType').disabled = true;
    }
});
```

### Date Range Filter
```javascript
function applyDateFilter() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    let filtered = allRecords;
    if (startDate) {
        filtered = filtered.filter(r => r.date >= startDate);
    }
    if (endDate) {
        filtered = filtered.filter(r => r.date <= endDate);
    }
    
    displayRecords(filtered);
}
```

### UUID Display (First 8 characters)
```javascript
function formatUUID(uuid) {
    return uuid ? uuid.substring(0, 8) : 'N/A';
}
```

## Quick Copy-Paste Sidebar (for all pages)

```html
<aside class="sidebar">
    <div class="sidebar-header">
        <div class="sidebar-logo">
            <div class="logo-icon">🩸</div>
            <div class="logo-text">
                <h1>Blood Bank</h1>
                <p>Management System</p>
            </div>
        </div>
    </div>

    <nav class="nav-menu">
        <div class="nav-section">
            <div class="nav-section-title">Main</div>
            <a href="index.html" class="nav-link"><span class="nav-icon">📊</span><span>Dashboard</span></a>
        </div>

        <div class="nav-section">
            <div class="nav-section-title">Management</div>
            <a href="donors.html" class="nav-link"><span class="nav-icon">👥</span><span>Donors</span></a>
            <a href="donations.html" class="nav-link"><span class="nav-icon">💉</span><span>Donations</span></a>
            <a href="inventory.html" class="nav-link"><span class="nav-icon">🏥</span><span>Inventory</span></a>
            <a href="hospitals.html" class="nav-link"><span class="nav-icon">🏨</span><span>Hospitals</span></a>
        </div>

        <div class="nav-section">
            <div class="nav-section-title">Operations</div>
            <a href="requests.html" class="nav-link"><span class="nav-icon">📋</span><span>Blood Requests</span></a>
            <a href="camps.html" class="nav-link"><span class="nav-icon">⛺</span><span>Blood Camps</span></a>
            <a href="transfusions.html" class="nav-link"><span class="nav-icon">💊</span><span>Transfusions</span></a>
        </div>
    </nav>
</aside>
```

**Remember**: Add `class="active"` to the current page's nav-link!

## Final Steps After Creating All Pages

1. Test navigation between all pages
2. Verify Supabase credentials in all HTML files
3. Test all CRUD operations
4. Test filters and search on each page
5. Check responsive design on mobile
6. Review browser console for errors
7. Test export CSV functionality
8. Verify real-time updates work
9. Test print functionality
10. Deploy to Vercel

Good luck! 🚀
