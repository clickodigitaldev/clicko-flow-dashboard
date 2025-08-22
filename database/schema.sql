-- Clicko Flow Database Schema
-- This schema supports monthly financial planning and project management

-- Users table for authentication (future use)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Monthly Planning table
CREATE TABLE monthly_planning (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    month_year VARCHAR(20) NOT NULL, -- Format: "January 2025"
    month_index INTEGER NOT NULL, -- 0-23 for 24 months
    revenue DECIMAL(15,2) DEFAULT 0,
    break_even DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, month_year)
);

-- Overhead positions for each month
CREATE TABLE monthly_overhead (
    id SERIAL PRIMARY KEY,
    monthly_planning_id INTEGER REFERENCES monthly_planning(id) ON DELETE CASCADE,
    position_name VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- General expenses for each month
CREATE TABLE monthly_expenses (
    id SERIAL PRIMARY KEY,
    monthly_planning_id INTEGER REFERENCES monthly_planning(id) ON DELETE CASCADE,
    expense_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) DEFAULT 'General', -- Rent, Subscriptions, Marketing, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    project_id VARCHAR(20) UNIQUE NOT NULL, -- PROJ001, PROJ002, etc.
    client_name VARCHAR(100) NOT NULL,
    project_title VARCHAR(200),
    description TEXT,
    total_amount DECIMAL(15,2) NOT NULL,
    deposit_paid DECIMAL(15,2) DEFAULT 0,
    deposit_date DATE,
    expected_completion DATE NOT NULL,
    actual_completion DATE,
    status VARCHAR(20) DEFAULT 'Pending', -- Pending, In Progress, Completed, Cancelled
    priority VARCHAR(10) DEFAULT 'Medium', -- High, Medium, Low
    month_of_payment VARCHAR(20) NOT NULL, -- "August 2025"
    payment_terms TEXT,
    client_email VARCHAR(100),
    client_phone VARCHAR(20),
    project_manager VARCHAR(100),
    tags TEXT[], -- Array of tags for categorization
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project milestones/tasks
CREATE TABLE project_milestones (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    milestone_name VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(20) DEFAULT 'Pending', -- Pending, In Progress, Completed
    percentage_complete INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project payments/invoices
CREATE TABLE project_payments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    payment_type VARCHAR(20) NOT NULL, -- Deposit, Milestone, Final
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status VARCHAR(20) DEFAULT 'Pending', -- Pending, Paid, Overdue
    invoice_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project expenses (costs associated with projects)
CREATE TABLE project_expenses (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    expense_name VARCHAR(200) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) DEFAULT 'General', -- Materials, Subcontractor, Software, etc.
    expense_date DATE NOT NULL,
    receipt_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project time tracking (for future use)
CREATE TABLE project_time_entries (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    task_description TEXT NOT NULL,
    hours_spent DECIMAL(5,2) NOT NULL,
    date_worked DATE NOT NULL,
    hourly_rate DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table for user preferences
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, setting_key)
);

-- Audit log for tracking changes
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_monthly_planning_user_month ON monthly_planning(user_id, month_year);
CREATE INDEX idx_projects_user_status ON projects(user_id, status);
CREATE INDEX idx_projects_month_payment ON projects(month_of_payment);
CREATE INDEX idx_projects_completion_date ON projects(expected_completion);
CREATE INDEX idx_project_payments_status ON project_payments(status);
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);

-- Views for common queries
CREATE VIEW monthly_summary AS
SELECT 
    mp.month_year,
    mp.revenue,
    mp.break_even,
    COALESCE(SUM(mo.salary), 0) as total_overhead,
    COALESCE(SUM(me.amount), 0) as total_expenses,
    mp.revenue - COALESCE(SUM(mo.salary), 0) - COALESCE(SUM(me.amount), 0) as monthly_profit,
    CASE WHEN mp.revenue >= mp.break_even THEN 'Above' ELSE 'Below' END as break_even_status
FROM monthly_planning mp
LEFT JOIN monthly_overhead mo ON mp.id = mo.monthly_planning_id
LEFT JOIN monthly_expenses me ON mp.id = me.monthly_planning_id
GROUP BY mp.id, mp.month_year, mp.revenue, mp.break_even;

CREATE VIEW project_summary AS
SELECT 
    p.month_of_payment,
    COUNT(p.id) as total_projects,
    SUM(p.total_amount) as total_value,
    SUM(p.deposit_paid) as total_deposits,
    SUM(p.total_amount - p.deposit_paid) as remaining_payments,
    COUNT(CASE WHEN p.status = 'Completed' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN p.status = 'In Progress' THEN 1 END) as in_progress_projects,
    COUNT(CASE WHEN p.status = 'Pending' THEN 1 END) as pending_projects
FROM projects p
GROUP BY p.month_of_payment
ORDER BY p.month_of_payment;

-- Functions for common operations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_monthly_planning_updated_at BEFORE UPDATE ON monthly_planning FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monthly_overhead_updated_at BEFORE UPDATE ON monthly_overhead FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monthly_expenses_updated_at BEFORE UPDATE ON monthly_expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion (optional)
INSERT INTO users (username, email, password_hash) VALUES 
('admin', 'admin@clickoflow.com', 'hashed_password_here');

-- Insert sample monthly planning data
INSERT INTO monthly_planning (user_id, month_year, month_index, revenue, break_even) VALUES 
(1, 'August 2025', 0, 150000, 120000),
(1, 'September 2025', 1, 180000, 120000),
(1, 'October 2025', 2, 200000, 120000);

-- Insert sample overhead data
INSERT INTO monthly_overhead (monthly_planning_id, position_name, salary) VALUES 
(1, 'Developer', 8000),
(1, 'Designer', 6000),
(1, 'Project Manager', 7000);

-- Insert sample expenses
INSERT INTO monthly_expenses (monthly_planning_id, expense_name, amount, category) VALUES 
(1, 'Office Rent', 3000, 'Rent'),
(1, 'Software Subscriptions', 500, 'Subscriptions'),
(1, 'Internet & Utilities', 200, 'Utilities'),
(1, 'Marketing', 1000, 'Marketing');
