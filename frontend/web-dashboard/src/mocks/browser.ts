import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export async function enableMocking(): Promise<void> {
  const useMocks = (import.meta as any).env?.VITE_USE_MOCKS !== 'false';
  if (!useMocks) {
    console.log('[GarmiQ] Real backend mode active (VITE_USE_MOCKS=false)');
    return;
  }

  try {
    await (worker.start as any)({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('[GarmiQ] MSW mock service worker initialized successfully.');
  } catch (err) {
    console.warn('[GarmiQ] MSW could not start in this environment. Fallback service mocks will be used.', err);
  }
}
