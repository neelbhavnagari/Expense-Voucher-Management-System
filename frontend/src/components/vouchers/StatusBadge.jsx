import React from 'react';
import { Clock, CheckCircle, XCircle, FileEdit } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getIcon = () => {
    switch (status) {
      case 'Draft':
        return <FileEdit size={13} />;
      case 'Pending Approval':
        return <Clock size={13} />;
      case 'Approved':
        return <CheckCircle size={13} />;
      case 'Rejected':
        return <XCircle size={13} />;
      default:
        return null;
    }
  };

  const getClassName = () => {
    switch (status) {
      case 'Draft':
        return 'badge-draft';
      case 'Pending Approval':
        return 'badge-pending';
      case 'Approved':
        return 'badge-approved';
      case 'Rejected':
        return 'badge-rejected';
      default:
        return 'badge-default';
    }
  };

  return (
    <span className={`status-badge ${getClassName()}`}>
      {getIcon()}
      <span>{status || 'Unknown'}</span>
    </span>
  );
};

export default StatusBadge;
