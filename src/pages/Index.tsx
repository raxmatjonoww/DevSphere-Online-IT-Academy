
import React from 'react';
import Home from './Home';
import { useIsMobile } from '@/hooks/use-mobile';

// Redirect to Home component with mobile awareness
const Index = () => {
  const isMobile = useIsMobile();
  
  // We can pass isMobile as a prop if needed for Home-specific mobile optimizations
  return <Home />;
};

export default Index;
