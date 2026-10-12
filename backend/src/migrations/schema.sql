-- ==============================================================================
-- EXPENSE VOUCHER MANAGEMENT SYSTEM (EVM) - DATABASE SCHEMA / MIGRATION SCRIPT
-- Compatible with PostgreSQL 13+ / MySQL 8.0+
-- ==============================================================================

-- 1. Create Enums / Types
CREATE TYPE user_role AS ENUM ('Employee', 'Director', 'Accounts');
CREATE TYPE voucher_status AS ENUM ('Draft', 'Pending Approval', 'Approved', 'Rejected');

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'Employee',
    employee_id VARCHAR(50),
    department VARCHAR(100),
    signature TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 3. Vouchers Table
CREATE TABLE IF NOT EXISTS vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_number VARCHAR(50) NOT NULL UNIQUE,
    voucher_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expense_date DATE NOT NULL,
    department VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    description TEXT DEFAULT '',
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    employee_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) DEFAULT '',
    employee_signature TEXT DEFAULT NULL,
    status voucher_status NOT NULL DEFAULT 'Draft',
    director_signature TEXT DEFAULT NULL,
    approval_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_by UUID DEFAULT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance querying and filtering
CREATE INDEX idx_vouchers_number ON vouchers(voucher_number);
CREATE INDEX idx_vouchers_status ON vouchers(status);
CREATE INDEX idx_vouchers_created_by ON vouchers(created_by);
CREATE INDEX idx_vouchers_department ON vouchers(department);
CREATE INDEX idx_vouchers_category ON vouchers(category);
CREATE INDEX idx_vouchers_expense_date ON vouchers(expense_date);
CREATE INDEX idx_vouchers_amount ON vouchers(amount);
CREATE INDEX idx_vouchers_created_at ON vouchers(created_at DESC);
