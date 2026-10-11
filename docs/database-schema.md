# Database Schema Documentation

## Expense Voucher Management System (EVM)

The application uses MongoDB (with Mongoose schemas) and supports standard relational equivalents in PostgreSQL/MySQL.

---

## 1. Entity Relationship Overview

```
+-----------------------------------+
|               User                |
+-----------------------------------+
| _id          : ObjectId (PK)      |
| name         : String             |
| email        : String (Unique)    |
| password     : String (Hashed)    |
| role         : Enum               | <---+
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

---

## 2. Model Schemas in Detail

### 2.1 `User` Collection / Table

Represents system actors across the three functional roles.

| Field Name | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Auto-generated MongoDB identifier |
| `name` | String | Required, Trimmed | Full display name of the user |
| `email` | String | Required, Unique, Lowercase, Indexed | Corporate email address used for login |
| `password` | String | Required, Hashed (Bcrypt, Salt=10) | Securely hashed password |
| `role` | String | Enum (`['Employee', 'Director', 'Accounts']`) | Role determines permissions & route access |
| `employeeId` | String | Optional, Trimmed | Company ID code (e.g. `EMP-101`) |
| `department` | String | Optional, Trimmed | Primary departmental unit |
| `signature` | String | Optional | Default uploaded or drawn signature image |
| `createdAt` | Date | Auto-managed timestamp | Registration record timestamp |
| `updatedAt` | Date | Auto-managed timestamp | Profile update timestamp |

---

### 2.2 `Voucher` Collection / Table

Central record representing an expense claim throughout its lifecycle.

| Field Name | Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique voucher document identifier |
| `voucherNumber`| String | Required, Unique, Indexed | Sequential code: `EV-YYYYMM-XXXX` (e.g. `EV-202610-0001`) |
| `voucherDate` | Date | Required, Defaults to `Date.now` | Creation/issuance date |
| `expenseDate` | Date | Required | Date when expenditure occurred |
| `department` | String | Required, Trimmed | Claiming department (e.g., Engineering, Marketing) |
| `title` | String | Required, Trimmed | Title or brief description of the expense |
| `category` | String | Required | Category (Travel, Software, Supplies, Meals, etc.) |
| `description` | String | Optional | Detailed breakdown or business justification |
| `amount` | Number | Required, Min: `0.01` | Monetary value (> 0) claimed |
| `employeeName`| String | Required | Name of the claimant |
| `employeeId` | String | Optional | Employee badge identifier |
| `employeeSignature` | String | Mandatory before submission | URL or base64 data URI of claimant's signature |
| `status` | String | Enum: `Draft`, `Pending Approval`, `Approved`, `Rejected` | Current lifecycle state (default `Draft`) |
| `directorSignature` | String | Mandatory before approval | URL or base64 data URI of Director signature |
| `approvalDate` | Date | Nullable | Timestamp when Director signed or rejected |
| `rejectionReason` | String | Mandatory if status = `Rejected` | Explanation explaining why voucher was rejected |
| `submittedAt` | Date | Nullable | Timestamp when employee submitted from Draft |
| `createdBy` | ObjectId | Required, Ref: `User`, Indexed | Foreign key linking claimant user account |
| `reviewedBy` | ObjectId | Nullable, Ref: `User` | Foreign key linking reviewing Director |
| `createdAt` | Date | Auto-managed timestamp | Initial document creation timestamp |
| `updatedAt` | Date | Auto-managed timestamp | Last modification timestamp |

---

## 3. Data Integrity & Validation Rules

1. **Voucher Number Uniqueness**:
   Enforced via MongoDB unique index on `voucherNumber`. Auto-generated using sequential sequence tracking per month with fallback randomness.
2. **Amount Constraint**:
   Amount must be strictly positive (`$gt: 0`).
3. **Workflow Invariants**:
   - Vouchers can only be modified or deleted when `status === 'Draft'`.
   - Vouchers cannot be submitted without `employeeSignature`.
   - Vouchers cannot be approved without `directorSignature`.
   - Vouchers cannot be rejected without non-empty `rejectionReason`.
   - Only `Director` role can invoke approval/rejection endpoints.
   - `Employee` role queries are scoped exclusively to `createdBy: req.user._id`.
