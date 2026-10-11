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

## 📐 Assumptions Made During Development

1. **Voucher Numbering**:
   Voucher numbers follow the format `EV-YYYYMM-XXXX` (e.g. `EV-202610-0001`), auto-incremented sequentially per month with fallback randomness to prevent collisions.
2. **Draft Vouchers vs Submission**:
   Employees can save a voucher as a **Draft** even before attaching a signature. However, submitting for Director approval (`Pending Approval`) strictly requires a valid signature image or drawn canvas.
3. **Database Portability**:
   The backend connects to MongoDB if `MONGODB_URI` is provided, and gracefully defaults to an in-memory MongoDB server (`mongodb-memory-server`) with pre-seeded demo users and realistic vouchers so that evaluators can run the project out-of-the-box without configuring an external database.
4. **Signature Options**:
   Both image upload (PNG, JPG, SVG) and dynamic HTML5 Canvas signature drawing are provided. Drawing exports high-resolution PNG data URIs that persist identically to uploaded images.
5. **Read-Only Guarantees**:
   Once submitted, vouchers become read-only for employees. Once approved or rejected, vouchers are strictly read-only for all roles to preserve audit compliance.
