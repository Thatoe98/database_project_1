# 🩸 Blood Inventory Management System - Quick Reference

## 📁 Project Structure

```
database_project/
├── css/styles.css          # Complete design system
├── js/
│   ├── config.js          # Environment config
│   ├── supabase.js        # DB client
│   ├── utils.js           # Helper functions
│   └── main.js            # CRUD operations
├── *.html                 # 8 page files
├── database.sql           # Complete schema
├── env-local.example.js   # Local config template
└── *.md                   # Documentation
```

## ⚡ Quick Start (Copy-Paste)

### 1. Supabase Setup SQL
```sql
-- Run in Supabase SQL Editor
-- Disable RLS for development
ALTER TABLE donors DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE blood_inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals DISABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE blood_camps DISABLE ROW LEVEL SECURITY;
ALTER TABLE blood_transfusions DISABLE ROW LEVEL SECURITY;
```

### 2. Local Environment (PowerShell)
```powershell
# Create local env file
copy env-local.example.js env-local.js

# Then edit env-local.js with your credentials
```

### 3. Start Local Server
```powershell
# VS Code Live Server (recommended)
# Right-click index.html → "Open with Live Server"

# OR Python HTTP server
python -m http.server 8000
# Open http://localhost:8000
```

## 🔑 Key Functions (js/main.js)

### Fetch Data
```javascript
await fetchDonors(filters)           // Get all donors
await fetchBloodInventory()          // Get inventory
await fetchHospitals(filters)        // Get hospitals
await fetchBloodRequests(filters)    // Get requests
await fetchDonations(filters)        // Get donations
await fetchBloodCamps(filters)       // Get camps
await fetchTransfusions(filters)     // Get transfusions
```

### CRUD Operations
```javascript
await insertRecord(table, data)                    // Create
await updateRecord(table, id, idColumn, data)      // Update
await deleteRecord(table, id, idColumn)            // Delete
```

### Inventory Management
```javascript
await addToInventory(bloodType, units)             // Add units
await removeFromInventory(bloodType, units)        // Remove units
await reserveUnits(bloodType, units)               // Reserve
await fulfillReservedUnits(bloodType, units)       // Fulfill
await checkInventoryAvailability(bloodType, units) // Check
```

### Dashboard
```javascript
await getDashboardStats()         // Get all statistics
await getLowStockAlerts()        // Get alerts
await getRecentActivity(limit)   // Get recent items
```

## 🎨 UI Functions (js/utils.js)

### Notifications
```javascript
showToast(message, type, duration)   // type: success/error/warning/info
showLoading()                        // Show spinner
hideLoading()                        // Hide spinner
showConfirmDialog(msg, onConfirm)   // Confirmation dialog
```

### Modal
```javascript
toggleModal(modalId, show)          // Show/hide modal
setupModalClose()                   // Click outside to close
```

### Validation
```javascript
validateEmail(email)                // Email format
validatePhone(phone)                // Phone format
validateAge(dob, min, max)         // Age range
validateWeight(weight, min)        // Min weight
checkDonorEligibility(lastDonation) // 90-day check
```

### Formatting
```javascript
formatDate(date)                    // YYYY-MM-DD
formatDateReadable(date)           // Oct 25, 2024
formatDateTime(datetime)           // Oct 25, 2024, 2:30 PM
formatPhoneNumber(phone)           // (123) 456-7890
calculateAge(dob)                  // Age in years
```

### Utility
```javascript
getBloodTypes()                    // Array of blood types
getStatusBadgeClass(status)       // Badge CSS class
getStockLevelClass(units, threshold) // Stock level class
debounce(func, delay)             // Debounce function
```

## 📋 Common Patterns

### Page Initialization
```javascript
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        loadData();
        setupRealtimeUpdates();
    }, 500);
});
```

### Load and Display Data
```javascript
async function loadData() {
    try {
        showLoading();
        const data = await fetchSomething();
        displayData(data);
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Error: ' + error.message, 'error');
    }
}
```

### Form Submission
```javascript
async function saveRecord(event) {
    event.preventDefault();
    
    const data = {
        field1: document.getElementById('field1').value,
        field2: document.getElementById('field2').value
    };
    
    try {
        if (editMode) {
            await updateRecord('table', id, 'id_column', data);
            showToast('Updated successfully', 'success');
        } else {
            await insertRecord('table', data);
            showToast('Created successfully', 'success');
        }
        
        closeModal();
        await loadData();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}
```

### Real-time Updates
```javascript
let subscription = null;

function setupRealtimeUpdates() {
    subscription = subscribeToInventoryChanges((payload) => {
        console.log('Change detected:', payload);
        loadData();
    });
}

window.addEventListener('beforeunload', () => {
    if (subscription) unsubscribe(subscription);
});
```

## 🎯 CSS Classes

### Buttons
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-lg">Large</button>
```

### Badges
```html
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-info">Info</span>
<span class="badge badge-secondary">Secondary</span>
```

### Cards
```html
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Title</h2>
    </div>
    <div class="card-body">
        Content
    </div>
</div>
```

### Form
```html
<div class="form-group">
    <label class="form-label">Label <span class="required">*</span></label>
    <input type="text" class="form-control" required>
    <div class="form-error">Error message</div>
    <div class="form-help">Help text</div>
</div>
```

### Table
```html
<div class="table-container">
    <table class="table">
        <thead>
            <tr>
                <th class="sortable">Column</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Data</td>
            </tr>
        </tbody>
    </table>
</div>
```

## 🗄️ Database Schema Quick Reference

### donors
```javascript
{
    donor_id: UUID,
    full_name: string,
    date_of_birth: date,
    gender: 'Male'|'Female'|'Other',
    blood_type: 'A+'|'A-'|'B+'|'B-'|'AB+'|'AB-'|'O+'|'O-',
    phone: string (unique),
    email: string (unique),
    address: text,
    city: string,
    weight_kg: decimal,
    last_donation_date: date,
    is_eligible: boolean,
    total_donations: integer
}
```

### blood_inventory
```javascript
{
    inventory_id: UUID,
    blood_type: string (unique),
    total_units: integer,
    available_units: integer,
    reserved_units: integer,
    minimum_threshold: integer,
    last_updated: timestamp
}
```

### donations
```javascript
{
    donation_id: UUID,
    donor_id: UUID (FK),
    blood_camp_id: UUID (FK),
    donation_date: date,
    blood_type: string,
    quantity_ml: integer (default 450),
    hemoglobin_level: decimal,
    blood_pressure: string,
    status: 'Collected'|'Tested'|'Available'|'Expired'|'Used',
    notes: text
}
```

### hospitals
```javascript
{
    hospital_id: UUID,
    hospital_name: string,
    contact_person: string,
    phone: string,
    email: string,
    address: text,
    city: string,
    license_number: string (unique),
    is_active: boolean
}
```

### blood_requests
```javascript
{
    request_id: UUID,
    hospital_id: UUID (FK),
    patient_name: string,
    blood_type: string,
    units_requested: integer,
    urgency_level: 'Emergency'|'Urgent'|'Normal',
    request_date: timestamp,
    required_by: date,
    status: 'Pending'|'Approved'|'Fulfilled'|'Rejected'|'Cancelled',
    fulfilled_date: timestamp,
    notes: text
}
```

## 🔄 Data Flow Examples

### Recording a Donation
```
1. User selects donor → auto-fills blood type
2. User fills form (quantity, hemoglobin, etc.)
3. On save:
   - Create donation record
   - If status = 'Available':
     * Calculate units (quantity_ml / 450)
     * Update inventory (addToInventory)
     * Update donor stats (updateDonorStats)
   - Refresh page
```

### Approving a Blood Request
```
1. User clicks "Approve" on pending request
2. Check inventory availability
3. If sufficient:
   - Reserve units (reserveUnits)
   - Update request status to 'Approved'
4. Else:
   - Show error toast
```

### Recording a Transfusion
```
1. User selects approved request (optional)
2. Fills form (hospital, patient, blood type, units)
3. On save:
   - Create transfusion record
   - If linked to request:
     * Fulfill reserved units
     * Update request status to 'Fulfilled'
   - Else:
     * Remove from available inventory
   - Refresh page
```

## 🐛 Debugging Tips

### Browser Console (F12)
```javascript
// Check if Supabase is initialized
console.log(supabase);

// Check configuration
console.log(config);

// Test database query
const { data, error } = await supabase.from('donors').select('*').limit(1);
console.log(data, error);

// Check environment variables
console.log(window.ENV);
```

### Common Errors
| Error | Cause | Fix |
|-------|-------|-----|
| "Supabase not initialized" | Config missing | Check window.ENV values |
| "violates row-level security" | RLS enabled | Run DISABLE RLS SQL |
| "relation does not exist" | Table not created | Run database.sql |
| CORS error | Direct file open | Use Live Server |
| 401 Unauthorized | Wrong API key | Check Supabase anon key |

## 📱 Responsive Breakpoints

```css
/* Mobile: < 480px */
/* Tablet: 480px - 768px */
/* Desktop: > 768px */

@media (max-width: 768px) {
    /* Sidebar becomes mobile menu */
    /* Tables convert to cards */
    /* Stats grid becomes single column */
}
```

## 🚀 Deployment Commands

### Git
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

### Vercel Environment Variables
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

## 📊 Status Mappings

### Donation Status
- **Collected** → Just donated, awaiting tests
- **Tested** → Tests complete, pending approval
- **Available** → Ready for use (adds to inventory)
- **Expired** → Past expiration date
- **Used** → Issued to patient

### Request Status
- **Pending** → Awaiting approval
- **Approved** → Approved, units reserved
- **Fulfilled** → Transfusion completed
- **Rejected** → Request denied
- **Cancelled** → Request cancelled

### Camp Status
- **Scheduled** → Future camp
- **Ongoing** → Camp in progress
- **Completed** → Camp finished
- **Cancelled** → Camp cancelled

### Urgency Levels
- **Emergency** → Critical, immediate (red)
- **Urgent** → Priority handling (yellow)
- **Normal** → Standard processing (green)

## 📞 Quick Links

- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Live Server Extension**: VS Code Marketplace
- **Project Docs**: README.md, SETUP_GUIDE.md, PAGE_CREATION_GUIDE.md

---

**Keep this file open while developing! 🚀**
