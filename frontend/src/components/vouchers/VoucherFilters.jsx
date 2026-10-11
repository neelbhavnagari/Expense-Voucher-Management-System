import React, { useState } from 'react';
import { Search, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { DEPARTMENTS, EXPENSE_CATEGORIES } from '../../utils/constants';

const VoucherFilters = ({ filters, onFilterChange, onReset, showRoleFilters = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="filters-card">
      {/* Top Quick Search Bar */}
      <div className="filters-top-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            name="search"
            placeholder="Search by Voucher #, title, employee or department..."
            value={filters.search || ''}
            onChange={handleInputChange}
            className="filter-search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            name="status"
            value={filters.status || 'All'}
            onChange={handleInputChange}
            className="filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-icon-sm"
            onClick={() => setIsExpanded(!isExpanded)}
            title="Toggle Advanced Filters"
          >
            <Filter size={16} />
            <span>Filters</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <button
            type="button"
            className="btn btn-outline btn-icon-sm"
            onClick={onReset}
            title="Reset Filters"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Advanced Collapsible Filters */}
      {isExpanded && (
        <div className="advanced-filters-grid">
          <div className="filter-group">
            <label>Department</label>
            <select
              name="department"
              value={filters.department || 'All'}
              onChange={handleInputChange}
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              name="category"
              value={filters.category || 'All'}
              onChange={handleInputChange}
            >
              <option value="All">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {showRoleFilters && (
            <div className="filter-group">
              <label>Employee Name</label>
              <input
                type="text"
                name="employeeName"
                placeholder="Filter by employee name..."
                value={filters.employeeName || ''}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="filter-group">
            <label>Voucher Number</label>
            <input
              type="text"
              name="voucherNumber"
              placeholder="e.g. EV-202610-0001"
              value={filters.voucherNumber || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="filter-group">
            <label>Expense Date From</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="filter-group">
            <label>Expense Date To</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="filter-group">
            <label>Min Amount (₹)</label>
            <input
              type="number"
              name="minAmount"
              placeholder="0.00"
              value={filters.minAmount || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="filter-group">
            <label>Max Amount (₹)</label>
            <input
              type="number"
              name="maxAmount"
              placeholder="Any"
              value={filters.maxAmount || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherFilters;
