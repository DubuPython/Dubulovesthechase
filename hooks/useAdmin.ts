'use client';

import { useState, useEffect } from 'react';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check local storage on load
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem('jo_admin_mode') === 'true');
    };
    
    checkAdmin();
    
    // Listen for the secret toggle event
    window.addEventListener('adminToggled', checkAdmin);
    return () => window.removeEventListener('adminToggled', checkAdmin);
  }, []);

  const toggleAdmin = () => {
    const currentState = localStorage.getItem('jo_admin_mode') === 'true';
    const newState = !currentState;
    localStorage.setItem('jo_admin_mode', String(newState));
    
    // Dispatch event to update all components instantly
    window.dispatchEvent(new Event('adminToggled'));
    
    // Secret alert so you know it worked
    alert(newState ? "Admin Mode: UNLOCKED 🔓" : "Admin Mode: LOCKED 🔒");
  };

  return { isAdmin, toggleAdmin };
}