import React, { useEffect, useState } from 'react';
import App from './App';
import { CustomerHubStandalone } from './pages/CustomerHubStandalone';

export function Router() {
  const [route, setRoute] = useState<string>('');

  useEffect(() => {
    // Check URL path
    const path = window.location.pathname;
    setRoute(path);
  }, []);

  // Customer Hub standalone route
  if (route === '/customer-hub' || route === '/hub') {
    return <CustomerHubStandalone />;
  }

  // Default to main app
  return <App />;
}
