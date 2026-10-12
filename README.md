# Expense Voucher Management System (EVM)
> **Full Stack Developer Internship Assignment — ABC Company / Prachay Securities**

A modern full-stack web application that digitizes and streamlines employee expense voucher creation, executive Director approval workflows, and Accounts team reimbursement monitoring.

---

## 🌟 Key Features

### 1. 👥 Three Role-Based Portals
- **Employee Portal**:
  - Create and manage expense vouchers.
  - Save vouchers as **Draft** or **Submit for Approval**.
  - Edit or delete vouchers strictly while in **Draft** status.
  - Attach digital signatures via **image file upload (PNG/JPG)** or **draw directly on an interactive signature canvas**.
  - Strict privacy: Employees can only view vouchers created by themselves.
  - Track real-time status: Draft → Pending Approval → Approved / Rejected.
  - View rejection reasons and full audit details.

- **Director (Admin) Portal**:
  - Executive review queue for all vouchers in **Pending Approval** status.
  - Search, filter, and sort vouchers across the organization.
  - Approve vouchers with **mandatory Director digital signature**.
  - Reject vouchers with **mandatory rejection remarks/reason**.
  - Employee details are strictly immutable and protected from alteration.

- **Accounts Team Portal**:
  - Monitor all corporate vouchers across departments for reimbursement processing.
  - Advanced search and multi-parameter filtering (Bonus requirement).
  - Inspect employee signatures, Director approval signatures, and timestamps.
  - Print / Save official expense voucher certificates (Bonus requirement).
  - Read-only integrity: Cannot alter, approve, or delete vouchers.

### 2. ⚡ Search, Filter & Sorting (Bonus Point)
- Search across Voucher Number, Expense Title, Employee Name, and Department.
- Filter by:
  - Status (`Draft`, `Pending Approval`, `Approved`, `Rejected`)
  - Department
  - Expense Category
  - Date Range (`startDate`, `endDate`)
  - Amount Range (`minAmount`, `maxAmount`)
- Pagination and responsive design.

### 3. 📊 Role-Tailored KPI Dashboards
- **Employee**: Total Vouchers, Drafts, Pending, Approved, Rejected, Total Claimed Amount, Recent Activities.
- **Director**: Pending Approval Count, Approved Today, Rejected Today, Total Pending Amount, Total Organization Vouchers, Recent Activity.
- **Accounts**: Total Vouchers, Pending Approvals, Approved Vouchers, Rejected Claims, Total Approved Expense Amount, Recent Approved Payouts.

---

## 🏗️ Project Architecture & Folder Structure

```
expense-voucher-management/
│
├── frontend/                         # React + Vite application
│   ├── public/
│   │   ├── favicon.svg
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── styles/
│   │   │
│   │   ├── components/               # Reusable UI components
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── ConfirmDialog.jsx
│   │   │   ├── vouchers/
│   │   │   │   ├── VoucherForm.jsx
│   │   │   │   ├── VoucherTable.jsx
│   │   │   │   ├── VoucherFilters.jsx
│   │   │   │   └── StatusBadge.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── Login.jsx
│   │   │   ├── employee/
│   │   │   │   ├── EmployeeDashboard.jsx
│   │   │   │   ├── MyVouchers.jsx
│   │   │   │   ├── CreateVoucher.jsx
│   │   │   │   ├── EditVoucher.jsx
│   │   │   │   └── VoucherDetails.jsx
│   │   │   ├── director/
│   │   │   │   ├── DirectorDashboard.jsx
│   │   │   │   ├── PendingApprovals.jsx
│   │   │   │   ├── AllVouchers.jsx
│   │   │   │   └── ReviewVoucher.jsx
│   │   │   ├── accounts/
│   │   │   │   ├── AccountsDashboard.jsx
│   │   │   │   ├── AllVouchers.jsx
│   │   │   │   └── VoucherDetails.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── voucherService.js
│   │   │   └── dashboardService.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── formatCurrency.js
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/                          # Node.js + Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # Resilient DB connection + Auto-seeder
│   │   │   └── env.js
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.js
│   │   │   └── Voucher.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── voucherController.js
│   │   │   ├── approvalController.js
│   │   │   └── dashboardController.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── voucherService.js
│   │   │   └── approvalService.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── voucherRoutes.js
│   │   │   ├── approvalRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   ├── validateMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   └── voucherValidator.js
│   │   ├── migrations/
│   │   │   ├── schema.sql            # Relational PostgreSQL/MySQL schema DDL
│   │   │   └── init-mongo.js         # MongoDB index & collection initializer
│   │   ├── utils/
│   │   │   ├── generateVoucherNumber.js
│   │   │   ├── ApiError.js
│   │   │   └── asyncHandler.js
│   │   ├── uploads/signatures/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── voucher.test.js
│   │   └── approval.test.js
│   │
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── database-schema.md
│   └── api-documentation.md
│
├── .env.example                      # Root environment configuration
├── .gitignore
├── README.md
└── package.json
```

---

## 🚀 Getting Started & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- *Optional*: Local MongoDB daemon (If not running, the application starts an in-memory database automatically with zero manual setup required!)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd expense-voucher-management
   ```

2. **Install all dependencies** (Backend & Frontend):
   ```bash
   # From root:
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   # In backend/
   cp .env.example .env

   # In frontend/
   cp .env.example .env
   ```

4. **Run the Application**:
   - **Backend**:
     ```bash
     cd backend
     npm start
     # Server runs on http://localhost:5000
     ```
   - **Frontend**:
     ```bash
     cd frontend
     npm run dev
     # Client runs on http://localhost:5173
     ```

---

## 🔑 Pre-Seeded Demo Accounts (Instant 1-Click Login)

The login screen includes convenient 1-click test buttons for all roles:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Employee (1)** | `john.doe@abccompany.com` | `Password123!` | John Doe, Engineering (EMP-101) |
| **Employee (2)** | `jane.smith@abccompany.com` | `Password123!` | Jane Smith, Marketing (EMP-102) |
| **Director (Approver)** | `director@abccompany.com` | `Password123!` | Robert Director, Management (DIR-001) |
| **Accounts Team** | `accounts@abccompany.com` | `Password123!` | Alice Accountant, Finance (ACC-001) |

---

## 🧪 Running Automated Tests

A comprehensive Jest & Supertest test suite covers authentication, role middleware, voucher lifecycle, and director sign-offs:

```bash
cd backend
npm test
```

Test Results:
- `tests/auth.test.js`: User registration, login, JWT issuance, and invalid credential rejections.
- `tests/voucher.test.js`: Draft voucher creation, amount validations (>0), draft editing, and submission signature checks.
- `tests/approval.test.js`: Director approval signature requirement, rejection reason requirement, and non-director permission blockage.

---

## 🗄️ Database Schema Explanation

The application is built on **MongoDB (with Mongoose)** and includes portable **SQL DDL schema files (`backend/src/migrations/schema.sql`)** for relational database compatibility.

### 1. Entity Relationship (ER) Diagram

```text
+-----------------------------------+
|               User                |
+-----------------------------------+
| _id          : ObjectId (PK)      |
| name         : String             |
| email        : String (Unique)    |
| password     : String (Hashed)    |
| role         : Enum               |<----+
| employeeId   : String             |     |
| department   : String             |     | 1:N Relationship
| signature    : String (Data/URL)  |     | (Employee creates vouchers)
+-----------------------------------+     |
                  |                       |
                  | 1:N (Reviewed By)     |
                  v                       |
+-----------------------------------------+--+
|                  Voucher                   |
+--------------------------------------------+
| _id               : ObjectId (PK)          |
| voucherNumber     : String (Unique, Index) |
| voucherDate       : Date                   |
| expenseDate       : Date                   |
| department        : String                 |
| title             : String                 |
| category          : String                 |
| description       : String                 |
| amount            : Number (> 0)           |
| employeeName      : String                 |
| employeeId        : String                 |
| employeeSignature : String (Image/Canvas)  |
| status            : Enum                   |
|                   ['Draft',                |
|                    'Pending Approval',     |
|                    'Approved',             |
|                    'Rejected']             |
| directorSignature : String (Image/Canvas)  |
| approvalDate      : Date                   |
| rejectionReason   : String (if rejected)   |
| submittedAt       : Date                   |
| createdBy         : ObjectId (FK -> User)  |
| reviewedBy        : ObjectId (FK -> User)  |
| createdAt         : Date                   |
| updatedAt         : Date                   |
+--------------------------------------------+
```

### 2. Model Schemas in Detail

#### `User` Collection (`users` table)
- `_id` / `id` (ObjectId/UUID): Unique primary identifier.
- `name` (String, Required): Full display name of the user.
- `email` (String, Required, Unique, Lowercase, Indexed): Corporate email address.
- `password` / `password_hash` (String, Required): Securely hashed with bcrypt (salt = 10 rounds).
- `role` (Enum, Required): Role-based access level (`Employee`, `Director`, `Accounts`).
- `employeeId` (String, Optional): Corporate badge identifier (e.g. `EMP-101`).
- `department` (String, Optional): Operational department (e.g. `Engineering`, `Marketing`).
- `signature` (String, Optional): Saved default signature data URI or image URL.
- `createdAt` / `updatedAt` (Timestamps): Standard audit timestamps.

#### `Voucher` Collection (`vouchers` table)
- `_id` / `id` (ObjectId/UUID): Unique voucher identifier.
- `voucherNumber` (String, Required, Unique, Indexed): Sequential identifier in `EV-YYYYMM-XXXX` format.
- `voucherDate` (Date, Required): Voucher creation/claim date (defaults to current timestamp).
- `expenseDate` (Date, Required): Date the expenditure was actually incurred.
- `department` (String, Required): Claiming department.
- `title` (String, Required): Summary title of the expenditure.
- `category` (String, Required): Expense categorization (`Travel`, `Software & Tools`, `Office Supplies`, `Meals & Entertainment`, `Client Meeting`, `General`).
- `description` (String, Optional): Detailed breakdown or justification.
- `amount` (Number, Required, Min: 0.01): Total claimed expense amount strictly greater than zero.
- `employeeName` (String, Required): Name of the claiming employee.
- `employeeId` (String, Optional): Badge identifier of the claimant.
- `employeeSignature` (String, Mandatory for submission): Base64 image data URI or uploaded signature URL.
- `status` (Enum, Default: `Draft`): Lifecycle stage (`Draft`, `Pending Approval`, `Approved`, `Rejected`).
- `directorSignature` (String, Mandatory for approval): Base64 image data URI or uploaded signature of the reviewing Director.
- `approvalDate` (Date, Nullable): Timestamp of Director's approval or rejection.
- `rejectionReason` (String, Mandatory if rejected): Director's remarks explaining rejection.
- `submittedAt` (Date, Nullable): Timestamp when employee submitted voucher for review.
- `createdBy` (ObjectId/UUID, Ref: `User`): Foreign key identifying the voucher author.
- `reviewedBy` (ObjectId/UUID, Ref: `User`, Nullable): Foreign key identifying the approving/rejecting Director.
- `createdAt` / `updatedAt` (Timestamps): Document audit history.

### 3. Database Indexes & Integrity Constraints
1. **Uniqueness**: Unique index on `voucherNumber` prevents duplicates across parallel submissions.
2. **User Identity**: Unique index on `email` prevents duplicate registrations.
3. **Optimized Lookups**: Compound indexes on `status`, `department`, `createdBy`, and `createdAt` enable instant filter and search queries.
4. **Amount Integrity**: Check constraint `amount > 0` prevents negative or zero valuations.
5. **State Transition Rules**:
   - Vouchers can only be updated or deleted while in `Draft` state.
   - Vouchers cannot be submitted without an `employeeSignature`.
   - Vouchers cannot be approved without a `directorSignature`.
   - Vouchers cannot be rejected without a non-empty `rejectionReason`.

Schema and migration files are located at:
- SQL DDL Migration: [`backend/src/migrations/schema.sql`](backend/src/migrations/schema.sql)
- MongoDB Index Migration: [`backend/src/migrations/init-mongo.js`](backend/src/migrations/init-mongo.js)
- Extended Schema Reference: [`docs/database-schema.md`](docs/database-schema.md)

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require a valid JWT Bearer token in the request header:
```http
Authorization: Bearer <jwt_token>
```

### Endpoints Overview

| Category | Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/login` | Public | Authenticate user & issue JWT |
| **Auth** | `POST` | `/auth/register` | Public | Register a new user |
| **Auth** | `GET` | `/auth/me` | Protected (All) | Get current authenticated user profile |
| **Vouchers** | `GET` | `/vouchers` | Protected (All) | List vouchers (scoped by role with filters & pagination) |
| **Vouchers** | `POST` | `/vouchers` | Employee | Create voucher (Draft or Submit) |
| **Vouchers** | `GET` | `/vouchers/:id` | Protected (All) | Get voucher details by ID |
| **Vouchers** | `PUT` | `/vouchers/:id` | Employee (Creator) | Edit voucher (Draft only) |
| **Vouchers** | `DELETE`| `/vouchers/:id` | Employee (Creator) | Delete voucher (Draft only) |
| **Vouchers** | `POST` | `/vouchers/:id/submit`| Employee (Creator) | Submit draft voucher for approval with signature |
| **Vouchers** | `POST` | `/vouchers/upload-signature` | Protected (All) | Upload physical signature image file |
| **Approvals** | `GET` | `/approvals/pending` | Director | List all vouchers pending executive review |
| **Approvals** | `POST` | `/approvals/:id/approve` | Director | Approve voucher with Director signature |
| **Approvals** | `POST` | `/approvals/:id/reject` | Director | Reject voucher with mandatory reason |
| **Dashboard** | `GET` | `/dashboard/stats` | Protected (All) | Get role-specific KPI cards and recent metrics |

### Sample Payloads

#### 1. Login (`POST /api/auth/login`)
```json
// Request:
{
  "email": "john.doe@abccompany.com",
  "password": "Password123!"
}

// Response (200 OK):
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "_id": "67080e72c8402b1f1589a101",
      "name": "John Doe",
      "email": "john.doe@abccompany.com",
      "role": "Employee",
      "employeeId": "EMP-101",
      "department": "Engineering"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Create Voucher (`POST /api/vouchers`)
```json
// Request:
{
  "title": "AWS Cloud Infrastructure",
  "department": "Engineering",
  "category": "Software & Tools",
  "expenseDate": "2026-10-10",
  "amount": 3250.00,
  "description": "Monthly production server hosting invoice",
  "status": "Draft",
  "employeeSignature": "data:image/svg+xml;utf8,<svg..."
}
```

#### 3. Director Approval (`POST /api/approvals/:id/approve`)
```json
// Request:
{
  "directorSignature": "data:image/svg+xml;utf8,<svg..."
}
```

#### 4. Director Rejection (`POST /api/approvals/:id/reject`)
```json
// Request:
{
  "rejectionReason": "Itemized tax invoice receipt is required for reimbursement."
}
```

Extended API documentation is available at: [`docs/api-documentation.md`](docs/api-documentation.md).

---

## 📐 Assumptions Made During Development

1. **Voucher Numbering**:
   Voucher numbers follow the format `EV-YYYYMM-XXXX` (e.g. `EV-202610-0001`), auto-incremented sequentially per month with fallback randomness to prevent collisions.
2. **Draft Vouchers vs Submission**:
   Employees can save a voucher as a **Draft** even before attaching a signature. However, submitting for Director approval (`Pending Approval`) strictly requires a valid signature image or drawn canvas.
3. **Database Portability**:
   The backend connects to MongoDB if `MONGODB_URI` is provided, and gracefully defaults to an in-memory MongoDB server (`mongodb-memory-server`) with pre-seeded demo users and realistic vouchers so that evaluators can run the project out-of-the-box without configuring an external database. Relational SQL schemas are also supplied for SQL migrations.
4. **Signature Options**:
   Both image upload (PNG, JPG, SVG) and dynamic HTML5 Canvas signature drawing are provided. Drawing exports high-resolution PNG data URIs that persist identically to uploaded images.
5. **Read-Only Guarantees**:
   Once submitted, vouchers become read-only for employees. Once approved or rejected, vouchers are strictly read-only for all roles to preserve audit compliance.
6. **Role Isolation**:
   Employees can view and manage only their own vouchers. Directors and Accounts officers have organization-wide visibility. Accounts officers have read-only audit and print access without modification rights.

---

## 📋 Submission Requirements Checklist (Section 13 Compliance)

| Requirement | Location / Artifact | Status |
| :--- | :--- | :--- |
| **GitHub repository with complete source code** | `https://github.com/neelbhavnagari/Expense-Voucher-Management-System` | ✅ Complete |
| **README: Project setup instructions** | [`README.md # Getting Started & Setup Instructions`](#getting-started--setup-instructions) | ✅ Complete |
| **README: Database schema explanation** | [`README.md # Database Schema Explanation`](#database-schema-explanation) | ✅ Complete |
| **README: API documentation** | [`README.md # API Documentation`](#api-documentation) | ✅ Complete |
| **README: Assumptions made** | [`README.md # Assumptions Made During Development`](#assumptions-made-during-development) | ✅ Complete |
| **Database schema or migration files** | [`backend/src/migrations/schema.sql`](backend/src/migrations/schema.sql)<br>[`backend/src/migrations/init-mongo.js`](backend/src/migrations/init-mongo.js)<br>[`backend/src/models/`](backend/src/models/) | ✅ Complete |
| **.env.example file** | [`.env.example`](.env.example)<br>[`backend/.env.example`](backend/.env.example)<br>[`frontend/.env.example`](frontend/.env.example) | ✅ Complete |
