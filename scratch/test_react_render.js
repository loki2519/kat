import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

// Test importing App
import App from '../src/App.jsx';

console.log('🧪 Testing React SSR rendering for /admin and /admin/dashboard...');

try {
  const htmlAdmin = renderToString(
    <StaticRouter location="/admin">
      <App />
    </StaticRouter>
  );
  console.log('✅ /admin rendered successfully. Length:', htmlAdmin.length);
  if (htmlAdmin.includes('KAT PRIVATE ADMIN PORTAL') || htmlAdmin.includes('Username')) {
    console.log('✅ /admin contains AdminLogin content.');
  } else {
    console.warn('⚠️ /admin rendered, but text content was unexpected:', htmlAdmin.substring(0, 300));
  }
} catch (err) {
  console.error('❌ CRASH during /admin render:', err);
}

try {
  const htmlDashboard = renderToString(
    <StaticRouter location="/admin/dashboard">
      <App />
    </StaticRouter>
  );
  console.log('✅ /admin/dashboard rendered successfully. Length:', htmlDashboard.length);
  if (htmlDashboard.includes('Dashboard') || htmlDashboard.includes('Checking authentication')) {
    console.log('✅ /admin/dashboard contains expected content.');
  } else {
    console.warn('⚠️ /admin/dashboard rendered unexpected output:', htmlDashboard.substring(0, 300));
  }
} catch (err) {
  console.error('❌ CRASH during /admin/dashboard render:', err);
}
