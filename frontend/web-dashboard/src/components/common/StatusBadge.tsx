import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const norm = (status || '').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;

  if (norm === 'online' || norm === 'approved' || norm === 'resolved' || norm === 'completed' || norm === 'published') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  } else if (norm === 'warning' || norm === 'under_review' || norm === 'in_progress' || norm === 'pending_approval' || norm === 'draft') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    label = status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  } else if (norm === 'offline' || norm === 'rejected' || norm === 'critical' || norm === 'failed') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
    label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  } else if (norm === 'submitted' || norm === 'running' || norm === 'queued') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    label = status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles} ${className}`}
    >
      {label}
    </span>
  );
};
