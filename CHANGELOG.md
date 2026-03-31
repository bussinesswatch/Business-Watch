# Changelog

All notable changes to the Business Watch project.

## [1.2.0] - 2026-03-31

### ✨ Added

#### Core Features
- **useData Hook**: New centralized data hook providing bids and tenders data across all pages
- **Auto Email Alerts**: Automatic email notifications for new tenders, deadline alerts, and bid openings
- **Subscriber Management**: Email subscription system with preference controls
- **GitHub Actions Cron Jobs**: Automated deadline checks and gazette scraping via GitHub Actions
- **Vercel Deployment**: Automated deployment pipeline via GitHub Actions

#### Tech Stack
- **Node.js Version**: Updated to Node.js 22 in GitHub Actions workflow

### 🔧 Changed

#### Data Architecture
- **Data Architecture**: Removed Hisaabu.json dependencies; all finance data now derived from bids
- **Mobile Responsiveness**: Removed sticky headers on all pages for better mobile UX
- **Finance Page**: Now uses useData hook instead of local accounting data
- **Cost Calculator**: Updated to use useData hook for item data

### 🐛 Fixed

#### Deployment Issues
- **Vercel Deployment**: Fixed deployment failure by hardcoding org/project IDs and removing Vercel cron jobs
- **JSON Parsing Errors**: Removed invalid Hisaabu_clean.json file causing build errors
- **Import Errors**: Fixed missing useData hook imports across pages
- **Mobile Overflow**: Fixed sticky header overflow issues on mobile devices

### 📦 Removed

#### Unused Files
- **Hisaabu Data Files**: Deleted Hisaabu.json and all related references
- **Vercel Cron Jobs**: Moved cron jobs to GitHub Actions (Hobby plan limitation)
- **Sticky Headers**: Removed sticky positioning from Bids page headers

## [1.1.0] - 2026-03-30

### ✨ Added

#### Gazette Tender Integration
- **43 Live Tenders** from gazette.gov.mv
  - IT Equipment: 17 tenders
  - Medical Equipment: 3 tenders
  - Office Supplies: 2 tenders
  - Construction: 3 tenders (including 58MW Power Plant)
  - 12 additional categories
- **Real-time Firebase Sync**: Firestore database integration
- **Dual Mode**: Firebase + Local JSON fallback
- **Advanced Search**: Search by title, authority, category
- **Deadline Alerts**: Automatic urgent deadline detection
- **Dhivehi Support**: Local language titles included

#### Firebase Services
- New `useTenders()` hook with Firebase + local fallback
- `tenderService.js` for Firebase CRUD operations
- `uploadTenders.js` script for bulk data upload
- Firestore security rules with public read access
- Firestore indexes for efficient queries

#### Data Management
- `working_file.json` with 43 structured tenders
- Metadata tracking (extracted_at, total count, source)
- Summary statistics by category
- Urgent deadlines array

### 🔧 Changed

#### Firebase Security Rules
- Updated to allow public read access to tenders
- Require authentication for writes
- Deployed to `bussiness-watch` project

#### Scripts
- Added `npm run upload-tenders` command

### 📁 New Files

```
business-watch/
├── data/
│   └── working_file.json (43 tenders)
├── scripts/
│   └── uploadTenders.js
├── src/
│   ├── hooks/
│   │   └── useTenders.js
│   └── services/
│       └── tenderService.js
├── firestore.rules
├── firestore.indexes.json
└── firebase.json
```

### 🔥 Urgent Tenders Today

| ID | Tender | Authority | Deadline |
|---|---|---|---|
| TND-2026-001 | 44 Monitors + 1 Laptop | IUM | March 30, 14:00 |
| TND-2026-002 | 40 Laptops | IUM | March 30, 14:00 |
| TND-2026-003 | 48 Computer Systems | IUM | March 30, 14:00 |

### 📊 Statistics

- **Total Tenders**: 43
- **Categories**: 18
- **Authorities**: 20+ different organizations
- **IT Tenders**: 17 (39.5%)
- **Urgent (7 days)**: 4 tenders

### 🔗 Data Sources

- Primary: https://gazette.gov.mv/iulaan
- 57 URLs processed
- 43 successfully extracted
- 14 failed (timeouts, 404s, expired)

## [1.0.0] - 2026-03-29

### ✨ Initial Release

#### Core Features
- Firebase Authentication (Email/Password)
- User Roles (Admin/Staff)
- Dashboard with statistics and charts
- Tender Management
- Bid Management with profit calculations
- Procurement System
- Supplier Management
- Delivery Tracking
- Document Management
- User Management
- Financial Overview

#### Tech Stack
- React 18 + Vite
- Firebase (Auth, Firestore, Storage)
- Tailwind CSS
- Recharts
- date-fns

#### Pages
- Login
- Dashboard
- Tenders
- Bids
- Quotations
- Procurement
- Suppliers
- Deliveries
- Documents
- Projects
- Users (Admin only)
- Data Upload
- Excel Data Upload
- Tender Sheets
- Quotes
- Finance

---

**Last Updated**: March 30, 2026
