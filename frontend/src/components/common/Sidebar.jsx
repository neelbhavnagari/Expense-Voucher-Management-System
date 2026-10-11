import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  LayoutDashboard,
  FilePlus,
  Files,
  CheckSquare,
  Clock,
  Layers,
  FileSpreadsheet,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header-mobile">
          <span className="sidebar-title">Menu Navigation</span>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* Employee Menu */}
          {role === 'Employee' && (
            <div className="nav-group">
              <span className="nav-group-title">Employee Portal</span>
              <NavLink
                to="/employee/dashboard"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                onClick={onClose}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/employee/vouchers"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                onClick={onClose}
              >
                <Files size={18} />
                <span>My Vouchers</span>
              </NavLink>
              <NavLink
                to="/employee/vouchers/create"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                onClick={onClose}
              >
                <FilePlus size={18} />
                <span>Create Voucher</span>
              </NavLink>
            </div>
          )}

          {/* Director Menu */}
          {role === 'Director' && (
            <div className="nav-group">
              <span className="nav-group-title">Director Administration</span>
              <NavLink
                to="/director/dashboard"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                onClick={onClose}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/director/approvals/pending"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                onClick={onClose}
              >
                <Clock size={18} />
                <span>Pending Approvals</span>
              </NavLink>
              <NavLink
                to="/director/vouchers"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                onClick={onClose}
              >
                <Layers size={18} />
                <span>All Vouchers</span>
              </NavLink>
            </div>
          )}

          {/* Accounts Menu */}
          {role === 'Accounts' && (
            <div className="nav-group">
              <span className="nav-group-title">Accounts & Finance</span>
              <NavLink
                to="/accounts/dashboard"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                onClick={onClose}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/accounts/vouchers"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                onClick={onClose}
              >
                <FileSpreadsheet size={18} />
                <span>All Vouchers</span>
              </NavLink>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="system-pill">
            <span className="status-dot-active" />
            <span>Workflow Engine Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
