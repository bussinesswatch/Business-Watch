# User Manual - Business Watch

Complete guide for using the Business Watch tender management system.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Navigation Overview](#navigation-overview)
4. [Tenders](#tenders)
5. [Bids](#bids)
6. [Bid Compiler](#bid-compiler)
7. [Quotations](#quotations)
8. [Procurement](#procurement)
9. [Suppliers](#suppliers)
10. [Deliveries](#deliveries)
11. [Documents](#documents)
12. [Projects](#projects)
13. [Finance](#finance)
14. [Analytics](#analytics)
15. [Reports](#reports)
16. [Calendar](#calendar)
17. [KPI Dashboard](#kpi-dashboard)
18. [Cost Calculator](#cost-calculator)
19. [Staff Expense](#staff-expense)
20. [Advanced Search](#advanced-search)
21. [Email Notifications](#email-notifications)
22. [Administration](#administration)
23. [Mobile Usage](#mobile-usage)
24. [Data Sources](#data-sources)
25. [Troubleshooting](#troubleshooting)
26. [Quick Reference](#quick-reference)

---

## Getting Started

### Login

1. Open the application at `http://localhost:5173` (local) or your Vercel URL
2. Enter your email and password
3. Click "Sign In"

**Default Roles:**
- **Admin**: Full system access including user management
- **Staff**: Limited access (cannot delete or manage users)

---

## Dashboard

The Dashboard is your command center showing key business metrics and urgent alerts.

### Overview Cards

- **Total Tenders**: 50+ Gazette tenders from government sources
- **Active Bids**: Current bidding activities in progress
- **Won Projects**: Successfully awarded tenders
- **Pending Deliveries**: Items awaiting delivery
- **Net Profit**: Revenue minus costs minus staff expenses

### Urgent Alerts Section

Displays tenders with deadlines today or within 24 hours:
- Tender title and ID
- Deadline time
- Authority name
- Direct link to tender details

### Dashboard Charts

- **Revenue by Quarter**: Track income trends
- **Tenders by Category**: Visual breakdown (IT, Medical, Construction, etc.)
- **Bid Success Rate**: Win/loss ratio over time
- **Delivery Status**: Project completion tracking

---

## Navigation Overview

The sidebar contains 25+ modules organized by function:

### Main Modules
| Module | Description | Access |
|--------|-------------|--------|
| Dashboard | Overview and alerts | All users |
| Tenders | Browse all tenders | All users |
| Bids | Manage your bids | All users |
| Quotations | Create and track quotes | All users |
| Procurement | Purchase orders and tracking | All users |
| Suppliers | Vendor management | All users |
| Deliveries | Track shipments | All users |
| Documents | File management | All users |
| Projects | Won tender projects | All users |
| Finance | Budget and accounting | All users |
| Staff Expense | Track staff-related costs | All users |

### Analytics & Reports
| Module | Description | Access |
|--------|-------------|--------|
| Analytics | Data visualization | All users |
| Reports | Generate exports | All users |
| Calendar | Deadline timeline | All users |
| KPI Dashboard | Key metrics | All users |
| Cost Calculator | Bid estimation | All users |
| Advanced Search | Powerful filtering | All users |

### Administration
| Module | Description | Access |
|--------|-------------|--------|
| Users | User management | Admin only |
| Upload Excel | Bulk data import | Admin only |

---

## Tenders

Browse and search all 43+ Gazette tenders from Maldives government sources.

### Viewing Tenders

Each tender displays:
- **ID**: Unique identifier (TND-2026-XXX)
- **Title**: Tender description
- **Authority**: Government organization
- **Category**: IT, Construction, Medical, etc.
- **Deadline**: Submission deadline with countdown
- **Status**: Open, Closed, Won, Lost
- **Estimated Budget**: Project value range

### Search & Filter

**Search by:**
- Title keywords
- Authority name
- Category dropdown
- Tender ID

**Filter by:**
- Status (Open/Closed/Won/Lost)
- Category (18 categories)
- Authority (20+ organizations)
- Deadline range (Next 7/30/90 days)

### Tender Details Modal

Click any tender to view:
- Full description and requirements
- Quantities and specifications
- Contact information
- Gazette URL (external link)
- Info Sheet URL (PDF download)
- Bid opening date/time
- Your bid amount (if submitted)
- Submission history

### Creating a Bid from Tender

1. Click on tender card
2. Click "Create Bid" button
3. Enter bid amount and cost estimate
4. Add notes and attachments
5. Save - system calculates profit margin automatically

---

## Bids

Manage all your bidding activities in one place.

### Bid Status Types

- **Draft**: Bid in preparation
- **Submitted**: Bid sent to authority
- **Pending**: Awaiting results
- **Won**: Successfully awarded
- **Lost**: Not awarded
- **Withdrawn**: Bid retracted

### Search & Filter

**Comprehensive Search:**
- Search across all bid fields: title, authority, office, category, tender number, status, items, notes
- Real-time filtering as you type
- Case-insensitive matching

**Authority Filter:**
- Dropdown filter to show bids by specific authority/office
- "All Authorities" option to clear filter
- Combine with search for powerful filtering

**Archive Toggle:**
- "Show Archived" checkbox to control visibility
- By default, archived bids (Expired, Not Registered, Missed) are hidden
- Toggle on to view all bids including archived ones

### Bid List Views

**Card View:**
- Visual grid layout
- Color-coded by status
- Quick action buttons

**Table View:**
- Sortable columns
- Bulk actions
- Export to Excel

### Bid Statistics

Top of page shows:
- Total bids count
- Total value (all bids)
- Won count and value
- Win rate percentage
- Pending count

### Bid Management Actions

- **Edit**: Modify draft bids
- **Submit**: Send to authority
- **Duplicate**: Copy for similar tender
- **Convert to Project**: When won
- **Delete**: Remove draft bids

### Lot Configuration

When creating or editing a bid with requirement items, you can configure how LOT numbers are assigned:

**Lot Mode Options:**
- **Many Items with One Lot**: All items grouped under LOT 1 (default)
- **Each Item with 1 Lot**: Each item gets its own LOT number (LOT 1, LOT 2, etc.)

**How to Configure:**
1. Add requirement items to your bid
2. Look for "Lot Configuration" toggle that appears above the items list
3. Click your preferred option
4. LOT display updates automatically for all items

**When to Use:**
- Use "Many Items with One Lot" when bidding on a single contract covering multiple items
- Use "Each Item with 1 Lot" when each item is a separate contract/lot

### Additional Costs

Add extra costs to your bid calculation:

**Predefined Cost Types:**
- Commission
- Installation
- Boat Naal (transport)
- Helpers Charge
- Unloading Charge
- Loading Charge
- Tea / Dinner Charge

**Custom Costs:**
- Add any custom cost type
- Automatically saved for future use
- Included in total bid calculation

**How to Add:**
1. In bid form, scroll to "Additional Costs" section
2. Click quick-add buttons for common costs
3. Or click "+ Custom" for custom types
4. Enter amount for each cost
5. Total automatically calculated

### Auto-Generate Bid Number

Generate unique bid numbers automatically to avoid duplicates:

**Format:** `BID-YYYY-NNN` (e.g., `BID-2025-001`)

**How to Use:**
1. In the bid creation/editing form, find the "Tender Number" field
2. Click the **"Auto-Generate"** button next to the field
3. System generates next available number based on existing bids
4. Prevents duplicate numbers automatically

**Benefits:**
- No manual entry needed
- Consistent numbering format
- Automatic sequencing
- No duplicates

### Gazette URL Auto-Fetch

Quickly populate bid forms by pasting a Gazette URL. The system fetches tender details and auto-fills the form.

**How to Use:**
1. In the bid creation form, find the "Gazette URL" field
2. Paste a Gazette link (e.g., `https://gazette.gov.mv/iulaan/384248`)
3. Click the **download icon** button next to the field
4. Wait for data to load (usually 2-3 seconds)
5. Form fields auto-populate with tender details

**Fields Auto-Populated:**
- **Title** (translated from Dhivehi to English)
- **Title in Dhivehi** (original text)
- **Authority/Ministry** name
- **Category** (auto-detected)
- **Gazette ID** and **Tender Number**
- **Deadlines**: Submission, registration, opening, closing
- **Contact Information**: Email and phone numbers
- **Bid Security** amount
- **Performance Guarantee** amount
- **Funding Source** and **Project Name**
- **Eligibility Criteria**

**Translation:**
- System uses a built-in dictionary with 150+ common tender terms
- Translates ministry names, equipment types, and technical terms
- Original Dhivehi text preserved for reference

**Notes:**
- Requires internet connection to fetch Gazette data
- Some fields may remain empty if not available on Gazette page
- Always review and verify auto-populated data before saving

## Bid Compiler

Generate complete 23-page bid documents ready for tender submission. The Bid Compiler integrates with Bids and Documents pages for seamless workflow. Customize which sections to include before printing.

### Bid Compiler Features

**23-Page Structure:**
- **Page 1**: Declaration of Ethical Conduct - signature fields, company info
- **Page 2**: Bid Quotation - dynamic itemized table with qty, rate, amount
- **Page 3**: Company Registration Certificate - select from Documents page
- **Page 4**: Past Completed Bids - list of previous projects
- **Page 5**: GST Registration Certificate - document selection
- **Page 6**: SME Registration - certificate upload
- **Page 7**: Tax Clearance Certificate - document selection
- **Page 8**: Other Certificates - additional documents
- **Pages 9-23**: Technical Specifications & Terms - editable sections

### Using the Bid Compiler

**Method 1: From Bids Page (Recommended)**
1. Go to **Bids** page
2. Find the bid you want to compile
3. Click the **green "Bid Compile" button** (FileStack icon)
4. Bid Compiler opens with all data pre-filled:
   - Quotation number and date
   - Client and procurement reference
   - Itemized list with quantities, rates, amounts
   - Subtotal, GST 8%, Grand Total calculated automatically

**Method 2: Manual Selection**
1. Go to **Bid Compiler** page from sidebar
2. Use the **"Select from Open Bids"** dropdown in the sidebar
3. Choose an open bid to populate all fields
4. Or manually fill in the information

### Document Selection for Pages 3-8

Each certificate page has a dropdown to select documents:
1. Click on a certificate section (e.g., Page 3 - Company Registration)
2. Select from the **"Select from Documents"** dropdown
3. The dropdown shows documents filtered by type:
   - Page 3: Company Registration → `registration` type documents
   - Page 5: GST → `gst` type documents
   - Page 7: Tax Clearance → `bank` type documents
4. **View button** (eye icon) opens document preview
5. Or upload a new document directly

### Section Selection (Before Printing)

Choose which sections to include in your printed bid:

**How to Select Sections:**
1. Click **"Print Preview"** to enter preview mode
2. Look for **"Sections to Print"** panel at top
3. Check/uncheck sections you want to include
4. Only selected sections appear in final output

**When to Use:**
- Some tenders don't require all 23 pages
- Customize bid for specific tender requirements
- Remove unnecessary certificate pages
- Create abbreviated bids for initial submissions

**Available Sections:**
- Page 1: Declaration of Ethical Conduct
- Page 2: Bid Quotation
- Pages 3-8: Certificate pages (Company Reg, Past Bids, GST, SME, Tax, Other)
- Pages 9-23: Technical specifications and terms

### Print Preview & Saving

**Print Preview:**
- Click **"Print Preview"** button to see selected pages
- Proper page breaks between pages
- Page numbers at bottom right
- Only selected sections displayed
- Click **Print** or **Download as PDF**

**Save Compiled Bid:**
- Click **"Save"** button (floppy disk icon)
- Enter a name for the compiled bid
- Saved to browser localStorage
- View saved bids in **"Saved Bids"** section

### Tips

- Review all pre-filled data from the bid before printing
- Ensure all required documents are selected/attached
- Check calculations: Subtotal + GST = Grand Total
- Save before printing as a backup
- Use Print Preview to check formatting before final print

---

## Quotations

Create and manage quotations for clients with full print and delete options.

### Quotation Features

- Create custom quotes
- Add line items with quantities
- Calculate totals with tax
- Track quotation status
- Convert to orders
- Print quotations
- Delete saved quotations

### Quotation Actions

**Print Quotation:**
1. Open saved quotation
2. Click **Print** button (printer icon)
3. Opens print-friendly view
4. Print or save as PDF

**Delete Quotation:**
1. Find quotation in list
2. Click **Delete** button (trash icon)
3. Confirm deletion
4. Quotation removed from system

**Edit Quotation:**
1. Click **Edit** on any quotation
2. Modify items, quantities, or prices
3. Save changes

### Quotation Status

- **Draft**: In preparation
- **Sent**: Delivered to client
- **Accepted**: Client approved
- **Rejected**: Client declined
- **Expired**: Past validity date

### Item Alignment

- Item descriptions are left-aligned for better readability
- Quantities, rates, and amounts remain right-aligned

---

## Procurement

Manage purchase orders and supplier interactions.

### Purchase Orders

Create POs for won tenders:
1. Select project/tender
2. Add items to purchase
3. Select suppliers
4. Set quantities and prices
5. Track delivery dates

### Procurement Workflow

- **Requisition**: Request items
- **Approved**: PO authorized
- **Ordered**: Sent to supplier
- **Shipped**: In transit
- **Delivered**: Items received
- **Invoiced**: Bill received

---

## Suppliers

Vendor and supplier management database.

### Supplier Information

Store and manage:
- Company name and contact details
- Primary contact person
- Email and phone
- Items/categories supplied
- Historical pricing data
- Performance ratings

### Supplier Actions

- Add new suppliers
- Edit existing records
- View purchase history
- Track performance
- Rate and review

---

## Deliveries

Track all incoming shipments and deliveries.

### Delivery Tracking

- Track shipment status
- Expected delivery dates
- Actual receipt dates
- Delivery notes
- Item condition records

### Delivery Status

- **Pending**: Awaiting shipment
- **Shipped**: In transit
- **In Customs**: Clearing customs
- **Out for Delivery**: Local delivery
- **Delivered**: Items received
- **Delayed**: Late shipment

---

## Documents

Full-featured document management system with Cloudinary integration for secure file storage.

### Document Categories

**Business Documents:**
- **Company Registration**: Registration certificates and business licenses
- **GST Certificate**: Tax registration and compliance documents
- **Experience Letters**: Completed project certificates and testimonials
- **Bank Statement**: Financial records and bank documents
- **Company Profile**: Business overview and capability statements
- **Others**: Miscellaneous documents

### Document Features

**Upload:**
1. Click "Upload Document" button
2. Select document type from dropdown
3. Enter document name
4. Add description (optional)
5. Select file (PDF, Word, Images up to 10MB)
6. Click Upload

**Preview:**
- Click any document card to open preview modal
- PDFs display as thumbnail image (first page)
- Images shown at full resolution
- Download button to save original file

**Manage Documents:**
- **Search**: Find by name or description
- **Filter**: Filter by document type
- **Edit**: Click pencil icon to modify name/type/description
- **Delete**: Click trash icon (Admin only)
- **Download**: Click download icon or use preview modal

### Storage

- **Cloudinary**: Secure cloud storage with free tier
- **Firebase**: Document metadata in Firestore
- **Real-time**: Changes synced across all users
- **Access**: All authenticated users can view, Admin can delete

---

## Projects

Track won tenders converted to active projects.

### Project Overview

Each project shows:
- Tender reference
- Contract value
- Start and end dates
- Project status
- Team assignments
- Budget vs actual costs

### Project Status

- **Planning**: Initial setup
- **Active**: In progress
- **On Hold**: Temporarily paused
- **Completed**: Finished
- **Cancelled**: Terminated

---

## Finance

Financial management and budget tracking.

### Financial Dashboard

- **Accounts**: Bank and cash accounts
- **Transactions**: All financial movements
- **Budget Summary**: Budget vs actual spending
- **Revenue Tracking**: Income by project

### Key Metrics

- Total revenue
- Total expenses
- Net profit
- Budget utilization
- Outstanding invoices
- Pending payments

### Data Source

Finance data is derived from:
- Bid amounts (revenue)
- Procurement costs (expenses)
- Project budgets

---

## Analytics

Deep data visualization and analysis.

### Analytics Views

- **Tender Analytics**: Trends over time
- **Bid Analytics**: Success patterns
- **Financial Analytics**: Revenue/expense trends
- **Supplier Analytics**: Vendor performance

### Chart Types

- Line charts (trends)
- Bar charts (comparisons)
- Pie charts (breakdowns)
- Heat maps (activity)

---

## Reports

Generate and export business reports.

### Report Types

**Tender Reports:**
- Summary by category
- By authority
- By deadline status
- New tenders report

**Financial Reports:**
- Revenue by quarter
- Profit margins
- Cost breakdowns
- Budget variance

**Performance Reports:**
- Bid success rate
- Won vs Lost analysis
- Delivery performance
- Supplier ratings

### Export Formats

- Excel (.xlsx)
- PDF
- CSV
- Print-friendly

---

## Calendar

Visual timeline of all tender deadlines.

### Calendar Views

- **Month View**: Overview of all deadlines
- **Week View**: Detailed weekly schedule
- **Day View**: Hour-by-hour on busy days

### Calendar Events

- Tender submission deadlines
- Bid opening dates
- Project milestones
- Delivery schedules
- Meeting reminders

### Color Coding

- Red: Urgent (today/tomorrow)
- Orange: This week
- Yellow: Next week
- Green: Future

---

## KPI Dashboard

Key Performance Indicators at a glance.

### KPIs Tracked

- **Total Bids**: Number submitted
- **Won Bids**: Successfully awarded
- **Win Rate**: Percentage won
- **Total Value**: All bid amounts
- **Won Value**: Revenue from wins
- **Average Profit Margin**: Bid profitability

### Time Periods

Filter KPIs by:
- This month
- This quarter
- This year
- All time

---

## Cost Calculator

Estimate costs for tender submissions with full calculation management.

### Calculator Features

- Select items from database
- Adjust quantities
- Add markup percentage
- Calculate exchange rates
- Factor in shipping costs
- Include tax calculations

### Saved Calculations Management

**Save Calculation:**
1. Add items and set quantities
2. Adjust markup and exchange rate
3. Click **"Save Calculation"** button
4. Enter a name for the calculation
5. Saved to your calculation list

**Load/Edit Calculation:**
1. Find saved calculation in the list
2. Click **Edit** (pencil icon) to load it back
3. Modify items, quantities, or rates
4. Save again to update

**Delete Calculation:**
1. Click **Delete** (trash icon) on saved calculation
2. Confirm deletion
3. Calculation removed from list

**Print Calculation:**
1. Click **Print** (printer icon) on saved calculation
2. Opens print-friendly report in new window
3. Includes all items, quantities, prices, and totals
4. Print or save as PDF

### Cost Components

- Base item costs
- Shipping and freight
- Import duties
- Handling fees
- Insurance
- Contingency (10-15%)

---

## Staff Expense

Track and manage all staff-related expenses with detailed categorization.

### Dashboard Overview

The Staff Expense page provides a comprehensive dashboard with:

- **Total Expenses**: All-time expense summary
- **This Month**: Current month's expenses
- **Staff Count**: Number of unique staff members with expenses
- **Expense Entries**: Total number of expense records

### Expense Types

**Predefined Categories:**
- **Salary**: Staff salaries and wages
- **Printing Charge**: Document printing costs
- **Binding**: Book and document binding
- **Laminating**: Document lamination services
- **Transport**: Transportation and travel expenses
- **Meals**: Food and meal expenses
- **Office Supplies**: General office materials
- **Utilities**: Electricity, water, internet bills
- **Maintenance**: Equipment and facility maintenance

**Custom Types:**
- Add any custom expense type
- Automatically saved to localStorage for future use
- Unlimited custom categories supported

### Managing Expenses

**Add New Expense:**
1. Click "Add Expense" button
2. Select expense type (or enter custom)
3. Enter description
4. Set amount (MVR)
5. Choose date
6. Add staff name (optional)
7. Add notes (optional)
8. Click Save

**Edit Expense:**
1. Find expense in table
2. Click edit (pencil) icon
3. Modify fields
4. Save changes

**Delete Expense:**
1. Find expense in table
2. Click delete (trash) icon
3. Confirm deletion

### Expense by Type Breakdown

Visual summary showing:
- Total amount per expense type
- Percentage distribution
- Top expense categories
- Historical trends

### Search and Filter

**Search by:**
- Description keywords
- Staff name
- Expense type

**Filter by:**
- Expense type (dropdown)
- Date range (use search)

### Data Storage

- **Primary**: Firebase Firestore (`staffExpenses` collection)
- **Custom Types**: localStorage for persistence
- **Real-time**: Synced across all users
- **Secure**: Authentication required

---

## Advanced Search

Powerful search across all data.

### Search Capabilities

- **Tenders**: Search by any field
- **Bids**: Find by status, value, date
- **Suppliers**: Search by name, items
- **Projects**: Find by status, value

### Search Filters

- Date ranges
- Value ranges
- Status filters
- Category filters
- Authority filters

---

## Email Notifications

Stay informed with automatic alerts.

### Notification Types

**Tender Alerts:**
- New tenders matching your criteria
- Tender deadline reminders (7, 3, 1 days)
- Bid opening reminders

**Bid Alerts:**
- Bid result updates
- Status change notifications
- **New bid created** (automatic email to all subscribers)

**Deadline Alerts:**
- Daily summary of urgent tenders
- Weekly digest of upcoming deadlines

### Setting Up Notifications

1. Click the **bell icon** in the top navigation
2. Click "Notification Settings"
3. Enter your email
4. Select alert types:
   - Deadline alerts
   - Bid opening reminders
   - New tender alerts
   - Result updates
5. Click "Subscribe"

### Managing Preferences

- Enable/disable specific alert types
- Change email address
- Unsubscribe anytime
- Set quiet hours (no night emails)

---

## Team Chat

Real-time messaging for team collaboration.

### Chat Features

- **Real-time messaging**: Instant message delivery
- **@mentions**: Tag specific users or @all to notify everyone
- **User identification**: See who's online with role badges (Admin/Staff)
- **Message history**: Last 100 messages stored locally for 24 hours
- **Mobile responsive**: Full chat functionality on mobile devices

### Using @mentions

To tag someone in a message:
1. Type `@` in the message box
2. Select a user from the dropdown, or type their name
3. Use `@all` to notify all team members
4. Mentioned users see a yellow highlight on the message

### Pusher Setup (Required for Chat)

Chat uses **Pusher** for real-time messaging (free forever, 200k messages/day, no credit card).

**Setup Steps:**

1. **Create free account**: Go to [pusher.com](https://pusher.com) and sign up
2. **Create app**: Click "Create app" → Name it "Business Watch Chat"
3. **Get credentials**: 
   - Go to "App Keys" tab
   - Copy your `app_id`, `key`, and `secret`
4. **Update code**: Open `src/hooks/useChat.js` and replace:
   ```javascript
   const PUSHER_KEY = 'a6f9d8c2a8e8c2a8e8c2'; // Replace with your actual key
   const PUSHER_CLUSTER = 'ap2'; // Or your cluster (mt1, eu, etc.)
   ```
5. **Enable client events** (for @all mentions):
   - In Pusher dashboard → App Settings
   - Enable "Client Events"
   - Save changes

**Free Tier Limits:**
- 200,000 messages per day
- 100 concurrent connections
- No expiration
- No credit card required

---

## Administration (Admin Only)

### User Management

**Create New User:**
1. Go to Users page (sidebar)
2. Click "Add User"
3. Enter:
   - Full name
   - Email address
   - Temporary password
   - Role (Admin/Staff)
4. Click Save

**Edit User:**
- Click user row
- Modify details
- Change role if needed
- Save changes

**Delete User:**
- Click delete icon
- Confirm deletion
- User data archived

### Data Upload

**Upload Gazette Tenders:**
```bash
npm run upload-tenders
```
This uploads all 43 tenders from `data/working_file.json` to Firebase.

**Upload Excel Data:**
1. Go to "Upload Excel" page
2. Select file type:
   - Suppliers
   - Purchases
   - Projects
   - Deliveries
3. Upload Excel file
4. Map columns to system fields
5. Preview data
6. Import to system

### Firestore Rules

View/modify security rules in `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tenders/{tenderId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules --project bussiness-watch
```

---

## Mobile Usage

Business Watch is fully responsive for mobile devices.

### Mobile Navigation

- **Hamburger Menu**: Tap to open sidebar
- **Swipe**: Swipe right to open menu
- **Touch-friendly**: All buttons sized for touch
- **Scrollable**: Smooth scrolling on all pages

### Mobile-Optimized Pages

**Dashboard:**
- Cards stack vertically
- Charts resize to fit screen
- Alerts in scrollable list

**Tenders & Bids:**
- Card view default on mobile
- Table view available via toggle
- Horizontal scroll for tables
- Touch to open details

**Forms:**
- Full-width inputs
- Large touch targets
- Number pad for amounts
- Date pickers optimized

### Mobile Tips

- Use landscape mode for tables
- Pinch to zoom on charts
- Pull down to refresh data
- Long press for quick actions

---

## Data Sources

### Gazette Tenders

**Source**: https://gazette.gov.mv/iulaan

**Current Dataset**:
- 50+ active tenders
- 18 categories
- 20+ authorities
- Updated: April 3, 2026

**File Locations**:
- Local: `data/working_file.json`
- Firebase: `tenders/` collection
- Backup: Projects 2026.json

### Categories

Most common tender categories:
1. IT Equipment (17 tenders)
2. Medical Equipment (3 tenders)
3. Construction (3 tenders)
4. Office Supplies (2 tenders)
5. Apparel/Uniform (2 tenders)

### Top Authorities

Tenders by organization:
1. Islamic University of Maldives (4 tenders)
2. Elections Commission (3 tenders)
3. Male City Council (2 tenders)
4. Ministry of Health (2 tenders)

---

## Troubleshooting

### Cannot See Tenders

1. Check Firebase connection
2. Run: `npm run upload-tenders`
3. Check browser console for errors
4. Verify Firestore rules allow reads

### Upload Script Fails

1. Check Firestore rules allow writes
2. Verify Firebase project ID: `bussiness-watch`
3. Check internet connection
4. Try: `firebase login:ci` then deploy with token

### Permission Denied

1. Ensure you're logged in
2. Check your role (Admin vs Staff)
3. Verify Firestore security rules
4. Contact admin if access needed

### Data Not Syncing

1. Check `useTenders()` hook
2. Verify Firebase connection
3. Check local data file exists
4. Force refresh: `useTenders(true)` for local mode

### Email Notifications Not Working

1. Check SMTP settings in `.env`
2. Verify subscriber exists in `data/subscribers.json`
3. Check GitHub Actions cron job status
4. Verify `CRON_SECRET` is set correctly

---

## Quick Reference

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl + K` | Search |
| `Esc` | Close modal |
| `Ctrl + S` | Save form |
| `Ctrl + N` | New item |
| `Ctrl + E` | Export |

### Common Tasks

| Task | Steps |
|------|-------|
| View urgent tenders | Dashboard → Urgent Alerts |
| Search tenders | Tenders page → Search bar |
| Create bid | Tenders → Select tender → Create Bid |
| Upload document | Documents → Upload Document |
| View PDF | Documents → Click any document card |
| Print bid quotation | Bids → View Bid → Print Preview |
| Upload data | Admin → Upload Excel / Run script |
| Export report | Reports → Select report → Export |
| Subscribe to alerts | Click bell icon → Notification Settings |
| Check deadlines | Calendar page or Dashboard |
| Calculate costs | Cost Calculator page |
| Track staff expenses | Staff Expense page → Add Expense |

### Important Dates (Sample)

**Urgent Deadlines**:
- March 30, 2026: 3 IUM tenders (14:00)
- April 2, 2026: Multiple deadlines
- April 5-9, 2026: Various submissions

---

## Version Information

**Document Version**: 1.8.0  
**Last Updated**: April 19, 2026  
**App Version**: 1.8.0  
**Total Tenders**: 50+

### Recent Updates (v1.8.0)
- **Bids Page Search**: Fixed comprehensive search across all fields
- **Authority Filter**: Filter bids by authority/office
- **Archive Feature**: Hide expired/missed/not registered bids
- **Auto-Generate Bid Number**: Unique BID-YYYY-NNN format
- **Cost Calculator**: Edit, delete, and print saved calculations
- **Quotation Actions**: Delete and print options
- **Bid Compiler**: Section selection before printing
- **Quotation Alignment**: Left-aligned item descriptions

### Previous Updates (v1.7.0)
- **Bid Compiler**: 23-page bid document generator
- **Document Integration**: Select documents from Documents page
- **Bids Page Integration**: Bid Compile button for one-click compilation
- **Full Quotation Table**: Itemized list with qty, rate, amount columns
- **Firebase Timestamp Fix**: Proper date formatting

---

**For technical support:**
1. Check this manual
2. Review README.md
3. Check CHANGELOG.md
4. Contact system administrator
