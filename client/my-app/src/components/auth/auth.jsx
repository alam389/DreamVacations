import React, { useEffect, useState } from 'react';
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Auth = () => {
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      console.log(token);

      if (token) {
        try {
          const response = await fetch(`${apiUrl}/public/auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          const data = await response.json();

          if (response.ok) {
            setMessage('Your email has been verified successfully!');
          } else {
            setMessage(`Verification failed: ${data.error}`);
          }
        } catch (error) {
          setMessage('An error occurred while verifying your email.');
          console.error('Error:', error);
        }
      } else {
        setMessage('Invalid verification link.');
      }
    };

    verifyEmail();
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
};

export default Auth;