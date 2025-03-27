import React, { useEffect } from 'react';

const Debug = () => {
  useEffect(() => {
    console.log('Debug component mounted');
    
    // Check if there are any errors in the console
    const originalError = console.error;
    console.error = function(...args) {
      console.log('Error intercepted:', ...args);
      originalError.apply(console, args);
    };
    
    // Check DOM rendering
    console.log('DOM root element:', document.getElementById('root'));
    console.log('DOM body children:', document.body.children);
    
    // Check React version
    console.log('React version:', React.version);
    
    return () => {
      console.error = originalError;
      console.log('Debug component unmounted');
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default Debug;