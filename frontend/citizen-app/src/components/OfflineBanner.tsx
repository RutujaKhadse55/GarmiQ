import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/useUserStore';
import { getLocalQueuedReports } from '@garmiq/api-client';
import { WifiOff, RefreshCw, UploadCloud } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { t } = useTranslation();
  const { isOnline, setIsOnline } = useUserStore();
  const [queuedCount, setQueuedCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check queued reports
    const checkReports = () => {
      const reports = getLocalQueuedReports();
      setQueuedCount(reports.filter((r) => r.status === 'pending_sync').length);
    };

    checkReports();
    const interval = setInterval(checkReports, 4000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [setIsOnline]);

  if (isOnline && queuedCount === 0) {
    return null;
  }

  const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-[#102A4C] text-white px-4 py-2.5 text-xs flex items-center justify-between gap-3 shadow-md sticky top-0 z-50 animate-fade-in">
      <div className="flex items-center gap-2 min-w-0">
        {!isOnline ? (
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <UploadCloud className="w-4 h-4 text-[#4B99FE] shrink-0" />
        )}
        <span className="truncate font-medium">
          {!isOnline
            ? t('common.offlineBanner', { time: currentTime, defaultValue: `Offline: showing cached update from ${currentTime}` })
            : `${queuedCount} report(s) pending sync...`}
        </span>
      </div>

      {!isOnline ? (
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg font-semibold shrink-0 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>{t('common.retry', 'Retry')}</span>
        </button>
      ) : (
        <span className="px-2 py-0.5 rounded-full bg-[#0866D9] text-[10px] font-bold">
          {t('common.pendingSync', 'Pending Sync')}
        </span>
      )}
    </div>
  );
};
