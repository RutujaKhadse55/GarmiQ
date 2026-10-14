import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { enableMocking } from './mocks/browser';
import { MOCK_OFFICER } from './mocks/fixtures';

// Initialize default municipal officer session if first visit
try {
  if (!localStorage.getItem('garmiq_officer_token')) {
    localStorage.setItem('garmiq_officer_token', 'jwt_pmc_demo_session_' + Date.now());
    localStorage.setItem('garmiq_officer_user', JSON.stringify(MOCK_OFFICER));
  }
} catch {
  // ignore storage exceptions
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
