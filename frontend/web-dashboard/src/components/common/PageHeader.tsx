import React, { ReactNode } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  backUrl?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  backUrl,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-[#7186A3] mb-1.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                {crumb.href ? (
                  <button
                    onClick={() => navigate(crumb.href!)}
                    className="hover:text-[#0866D9] transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-[#132D50] font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {backUrl && (
            <button
              onClick={() => navigate(backUrl)}
              className="p-1.5 rounded-lg border border-[#DFEAF7] bg-white text-[#7186A3] hover:text-[#102442] hover:bg-slate-50 transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-[#102442] tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-[#7186A3] mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>

      {actions && <div className="flex items-center gap-2.5 self-start md:self-auto">{actions}</div>}
    </div>
  );
};
