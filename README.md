# Blood Inventory Management System

A comprehensive web-based Blood Inventory Management System built with HTML, CSS, JavaScript, and Supabase backend.

## 🩸 Features

- **Donor Management**: Register and track blood donors with eligibility checks
- **Donation Tracking**: Record blood donations and automatically update inventory
- **Blood Inventory**: Real-time monitoring of blood stock levels by type
- **Hospital Management**: Register and manage partner hospitals
- **Blood Requests**: Process blood requests with urgency levels and approval workflow
- **Blood Camps**: Schedule and manage blood donation camps
- **Transfusion Records**: Track blood transfusions and automatic inventory updates
- **Dashboard**: Overview with statistics, alerts, and recent activity

## 📋 Table of Contents

- [Database Schema](#database-schema)
- [Local Development Setup](#local-development-setup)
- [Supabase Setup](#supabase-setup)
- [Vercel Deployment](#vercel-deployment)
- [Features Overview](#features-overview)
- [Troubleshooting](#troubleshooting)

## 🗄️ Database Schema (3NF Normalized)

The system uses **6 core tables** with a normalized database design:

### Core Tables
1. **hospitals** - Independent table for partner hospital information (name, type, contact, address)
2. **donors** - Independent table for donor information with blood type (ABO group + Rh factor), eligibility tracking
3. **campaigns** - Blood donation campaign scheduling (depends on hospitals)
4. **patients** - Patient records with case numbers and blood type (depends on hospitals)
5. **donations** - Individual donation records (depends on donors, hospitals, campaigns)
   - Blood type is NOT stored here - derived from donors table (3NF compliance)
6. **inventory** - Current blood stock levels (depends on donations, hospitals)
   - Blood type is NOT stored here - derived from donations→donors (3NF compliance)

### Helper Views (for easy querying)
- **inventory_with_blood_type** - Shows inventory with blood type derived from donors
- **donations_with_blood_type** - Shows donations with donor blood type and name
- **inventory_summary** - Aggregates inventory statistics by blood type

### Automated Triggers
- Auto-create inventory when donation test_result = 'Accepted' (35-day expiry)
- Auto-update donor eligibility (56-day deferral period after donation)
- Auto-expire inventory items past expiry date

### 3NF Normalization
- Blood type (abo_group + rh_factor) stored ONLY in **donors** table
- Other tables derive blood type through JOINs or views
- No transitive dependencies - proper database normalization

See `database.sql` for complete schema definitions.

## 🚀 Local Development Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code recommended)
- Supabase account (free tier available)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd database_project
   ```

2. **Set up environment variables for local development**

   ⚠️ **IMPORTANT**: Browsers cannot read `.env` files directly. Use one of these methods:

   **Option A: Using env-local.js (Recommended)**
   ```bash
   copy env-local.example.js env-local.js
   ```
   Then open `env-local.js` and add your credentials:
   ```javascript
   window.ENV = {
       SUPABASE_URL: 'https://your-project-id.supabase.co',
       SUPABASE_ANON_KEY: 'your-actual-anon-key-here'
   };
   ```
   
   Then in each HTML file, add this line BEFORE the other scripts:
   ```html
   <script src="env-local.js"></script>
   <script src="js/config.js"></script>
   ```

   **Option B: Edit HTML files directly (Quick but needs updates in all files)**
   1. Open each HTML file (index.html, donors.html, etc.)
   2. Find the `window.ENV` section near the bottom
   3. Replace the placeholder values with your actual credentials
   ```javascript
   window.ENV = {
       SUPABASE_URL: 'https://your-project-id.supabase.co',
       SUPABASE_ANON_KEY: 'your-actual-anon-key-here'
   };
   ```

3. **Open in browser**
   - **Option 1**: Open `index.html` directly in your browser
   - **Option 2**: Use VS Code Live Server extension (recommended)
     - Install "Live Server" extension in VS Code
     - Right-click `index.html` → "Open with Live Server"
     - Automatically opens at `http://localhost:5500`
   - **Option 3**: Use Python HTTP server
     ```bash
     python -m http.server 8000
     # Open http://localhost:8000 in your browser
     ```

4. **Configure your Supabase credentials**
   - No build process required!
   - Pure HTML/CSS/JS - works immediately

## 🔧 Supabase Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: Blood Inventory System
   - **Database Password**: (choose a strong password)
   - **Region**: (select closest to your location)

### 2. Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database.sql`
3. Paste into SQL Editor and click "Run"
4. Verify tables are created in **Table Editor**

### 3. Configure Row Level Security (RLS)

For development, RLS is already disabled in `database.sql`. For production, you should enable RLS and set up policies:

```sql
-- For production: Enable RLS and create policies
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Example: Allow all operations for authenticated users
CREATE POLICY "Enable all for authenticated users" ON donors
  FOR ALL USING (auth.role() = 'authenticated');
-- Repeat for other tables as needed
```

**Note**: The current `database.sql` has RLS disabled for development convenience.

### 4. Get API Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **anon public** key
3. Add these to your `.env` file

### 5. Initialize Sample Data (Optional)

Run the sample data section in `database.sql` to populate:
- 5 sample hospitals (City General, St. Mary Medical, Metro Health, Community Care, Phoenix Regional)
- 8 sample donors (all 8 blood types: O+, O-, A+, A-, B+, B-, AB+, AB-)
- 3 sample campaigns (Community Blood Drive, University Campus, Corporate Initiative)
- 3 sample patients with case numbers
- Sample donations and inventory are created automatically via triggers

## 🌐 Vercel Deployment

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Repository pushed to GitHub

### Deployment Steps

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects configuration from `vercel.json`

3. **Add Environment Variables**
   - In Vercel project settings → **Environment Variables**
   - Add:
     ```
     SUPABASE_URL = https://your-project.supabase.co
     SUPABASE_ANON_KEY = your-anon-key-here
     ```
   - Make sure to add for all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Visit your deployed site at `https://your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Go to project **Settings** → **Domains**
   - Add your custom domain
   - Follow DNS configuration instructions

### Automatic Deployments

- Every push to `main` branch automatically deploys to production
- Pull requests create preview deployments
- Vercel provides unique URLs for each deployment

## 📱 Features Overview

### Dashboard (index.html)
- Summary statistics (total donors, hospitals, inventory units, campaigns)
- Blood type distribution chart
- Low stock alerts
- Recent activity feed
- Quick navigation to all modules

### Donors Management (donors.html) ✅ **FULLY FUNCTIONAL**
- Add/edit/view/delete donors
- Search by name or phone
- Filter by blood type, eligibility, city
- Automatic eligibility calculation (56-day deferral)
- Blood type stored as ABO group + Rh factor
- View donation history

### Donations (donations.html) 🚧 **PLACEHOLDER**
- Record new donations (donor + hospital + optional campaign)
- Track test results (Pending/Accepted/Rejected)
- Link donations to blood camps (optional)
- Auto-create inventory when test_result = "Accepted"
- Auto-update donor's last donation date and eligibility
- Hemoglobin level tracking

### Blood Inventory (inventory.html) ✅ **FULLY FUNCTIONAL**
- Real-time stock levels for all blood types
- Uses `inventory_with_blood_type` view to show blood types
- Color-coded alerts (red/yellow/green based on units)
- Filter by blood type and status
- Available, reserved, issued, expired, discarded statuses
- Auto-expiry of blood units (35-day expiration)

### Hospitals (hospitals.html) 🚧 **PLACEHOLDER**
- Register partner hospitals
- Contact information (phone, email, address)
- Hospital type (Public, Private, Non-profit)
- Active/inactive status
- Link to campaigns and donations

### Blood Requests (requests.html) 🚧 **PLACEHOLDER**
- Create blood requests from patients
- Link to hospitals and patients (case numbers)
- Urgency levels: Emergency/Urgent/Normal
- Approval workflow with inventory check
- Status tracking: Pending/Approved/Fulfilled/Rejected

### Blood Camps (camps.html) 🚧 **PLACEHOLDER**
- Schedule donation campaigns
- Link to hospitals
- Track start and end dates
- Location and notes
- Link donations to specific campaigns

### Transfusions (transfusions.html) 🚧 **PLACEHOLDER**
- Record blood transfusions
- Link to patients and inventory
- Auto-decrease inventory when transfusion recorded
- Track transfusion details and notes

**Legend**: ✅ = Fully Functional | 🚧 = Placeholder (needs implementation)

## 🐛 Troubleshooting

### Environment Variables Not Loading

**Problem**: Application can't connect to Supabase

**Solution**:
1. Check `.env` file exists (not `.env.example`)
2. Verify credentials are correct
3. For Vercel: check Environment Variables in project settings
4. Clear browser cache and reload

### CORS Errors

**Problem**: "Access to fetch blocked by CORS policy"

**Solution**:
1. In Supabase dashboard, go to **Settings** → **API**
2. Add your Vercel domain to allowed origins
3. For local development, `http://localhost:5500` should work by default

### RLS (Row Level Security) Blocking Requests

**Problem**: "new row violates row-level security policy"

**Solution**:
1. Disable RLS for development (see Supabase Setup section)
2. Or create proper RLS policies for your use case
3. For production, implement authentication and proper policies

### Tables Not Found

**Problem**: "relation 'donors' does not exist"

**Solution**:
1. Run the complete `database.sql` script in Supabase SQL Editor
2. Verify tables exist in Table Editor
3. Check you're connected to the correct Supabase project

### Data Not Displaying

**Problem**: Tables/cards show "No data available"

**Solution**:
1. Check browser console for errors (F12)
2. Verify Supabase connection is working
3. Check network tab for failed API requests
4. Run sample data script to populate database
5. Verify RLS policies allow reading data
6. For inventory blood types, ensure you're querying `inventory_with_blood_type` view (not raw inventory table)
7. Check that triggers are working (donations → inventory creation)

### Deployment Issues

**Problem**: Site works locally but not on Vercel

**Solution**:
1. Verify environment variables are set in Vercel
2. Check Vercel deployment logs for errors
3. Ensure all file paths are relative (not absolute)
4. Test with Vercel preview deployment first

## 📊 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

## 🔒 Security Notes

- Never commit `.env` file to repository (use `.gitignore`)
- Never commit `env-local.js` file to repository
- Use environment variables for all sensitive data
- Implement proper RLS policies for production
- Validate all inputs on client side
- Use HTTPS in production (automatic with Vercel)
- Consider rate limiting for API endpoints

## 🎓 Database Design Notes

### 3NF Normalization Applied
This project demonstrates **Third Normal Form (3NF)** database design:

1. **No Repeating Groups** (1NF): All tables have atomic values
2. **No Partial Dependencies** (2NF): All non-key attributes depend on the entire primary key
3. **No Transitive Dependencies** (3NF): Blood type stored only in `donors` table
   - `donations` table does NOT store blood type (derivable from `donors`)
   - `inventory` table does NOT store blood type (derivable from `donations` → `donors`)

### Why This Matters
- **Data Integrity**: Blood type changes only need to update one place (donors table)
- **No Redundancy**: Eliminates duplicate storage of blood type information
- **Consistency**: Impossible to have conflicting blood types across tables

### How to Query Normalized Data
Instead of storing redundant data, use the provided **views**:
```sql
-- Get inventory with blood type (transparent JOIN)
SELECT * FROM inventory_with_blood_type WHERE status = 'Available';

-- Get donations with blood type
SELECT * FROM donations_with_blood_type WHERE test_result = 'Accepted';

-- Get inventory summary by blood type
SELECT * FROM inventory_summary ORDER BY blood_type;
```

Views provide a transparent abstraction layer - your queries look simple, but the database maintains referential integrity!

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues and questions:
- Check the Troubleshooting section
- Review Supabase documentation
- Check Vercel deployment logs
- Open an issue on GitHub

---

**Built with ❤️ for healthcare management**
