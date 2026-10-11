# REST API Documentation

## Expense Voucher Management System (EVM)

Base URL: `http://localhost:5000/api`

All protected endpoints require an `Authorization` header formatted as:
```http
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Login User
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john.doe@abccompany.com",
  "password": "Password123!"
}
```
- **Success Response (200 OK)**:
```json
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
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

### 1.2 Register User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Sarah Connor",
  "email": "sarah@abccompany.com",
  "password": "Password123!",
  "role": "Employee",
  "department": "Operations",
  "employeeId": "EMP-105"
}
```

### 1.3 Get Current User Profile
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Access**: Protected (Bearer Token)

---

## 2. Voucher Endpoints (`/api/vouchers`)

### 2.1 Get Vouchers (Scoped & Filtered)
- **Method**: `GET`
- **Endpoint**: `/api/vouchers`
- **Access**: Protected (Role scoped: Employee sees own; Director and Accounts see all)
- **Query Parameters**:
  - `search` (String): Multi-field text match
  - `status` (Enum: `Draft`, `Pending Approval`, `Approved`, `Rejected`)
  - `department` (String)
  - `category` (String)
  - `voucherNumber` (String)
  - `employeeName` (String)
  - `startDate`, `endDate` (ISO Dates: `YYYY-MM-DD`)
  - `minAmount`, `maxAmount` (Numbers)
  - `page` (Integer, default 1)
  - `limit` (Integer, default 10)
  - `sortBy` (String, default `createdAt`)
  - `sortOrder` (`asc` or `desc`)

### 2.2 Create Voucher
- **Method**: `POST`
- **Endpoint**: `/api/vouchers`
- **Access**: Protected (`Employee` only)
- **Request Body**:
```json
{
  "title": "AWS Cloud Production Servers",
  "department": "Engineering",
  "category": "Software & Tools",
  "expenseDate": "2026-10-10",
  "amount": 3250.00,
  "description": "Monthly cloud hosting renewal invoice",
  "status": "Draft",
  "employeeSignature": "data:image/svg+xml;utf8,<svg..."
}
```

### 2.3 Get Voucher By ID
- **Method**: `GET`
- **Endpoint**: `/api/vouchers/:id`
- **Access**: Protected (Employee limited to own vouchers; Director/Accounts see all)

### 2.4 Update Draft Voucher
- **Method**: `PUT`
- **Endpoint**: `/api/vouchers/:id`
- **Access**: Protected (`Employee` creator only)
- **Rules**: Voucher must be in `Draft` status.

### 2.5 Delete Draft Voucher
- **Method**: `DELETE`
- **Endpoint**: `/api/vouchers/:id`
- **Access**: Protected (`Employee` creator only)
- **Rules**: Voucher must be in `Draft` status.

### 2.6 Submit Draft Voucher for Approval
- **Method**: `POST`
- **Endpoint**: `/api/vouchers/:id/submit`
- **Access**: Protected (`Employee` creator only)
- **Request Body**:
```json
{
  "employeeSignature": "data:image/png;base64,..."
}
```

### 2.7 Upload Signature Image
- **Method**: `POST`
- **Endpoint**: `/api/vouchers/upload-signature`
- **Access**: Protected
- **Payload**: `multipart/form-data` with field `signature` (image file)

---

## 3. Director Approval Endpoints (`/api/approvals`)

### 3.1 Get Pending Approvals
- **Method**: `GET`
- **Endpoint**: `/api/approvals/pending`
- **Access**: Protected (`Director` role only)

### 3.2 Approve Voucher
- **Method**: `POST`
- **Endpoint**: `/api/approvals/:id/approve`
- **Access**: Protected (`Director` role only)
- **Request Body**:
```json
{
  "directorSignature": "data:image/svg+xml;utf8,..."
}
```

### 3.3 Reject Voucher
- **Method**: `POST`
- **Endpoint**: `/api/approvals/:id/reject`
- **Access**: Protected (`Director` role only)
- **Request Body**:
```json
{
  "rejectionReason": "Itemized tax invoice receipt is required."
}
```

---

## 4. Dashboard Metrics Endpoints (`/api/dashboard`)

### 4.1 Get Role-Specific Dashboard Metrics
- **Method**: `GET`
- **Endpoint**: `/api/dashboard/stats`
- **Access**: Protected (Returns role-tailored stats)
  - **Employee**: Total Vouchers, Draft, Pending, Approved, Rejected, Total Claimed Amount, Recent 5 vouchers.
  - **Director**: Pending Approval Count, Approved Today, Rejected Today, Total Pending Amount, Total Vouchers, Recent 6 activity.
  - **Accounts**: Total Vouchers, Pending Approval, Approved Vouchers, Rejected Vouchers, Total Approved Amount, Recent 6 approved vouchers.
