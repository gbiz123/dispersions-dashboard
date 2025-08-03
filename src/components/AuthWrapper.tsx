import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, [navigate]);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('https://l47qj.wiremockapi.cloud/user-details/user-info', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      setAuthChecking(false);
      
    } catch (error) {
      console.error('Failed to check authentication:', error);
      setAuthChecking(false);
    }
  };

  if (authChecking) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;