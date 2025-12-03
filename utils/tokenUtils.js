// utils/tokenUtils.js
export const validateToken = (token) => {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if it's a valid JWT structure
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return false;
    
    return true;
  } catch (error) {
    return false;
  }
};

export const cleanToken = (token) => {
  if (!token) return null;
  return token.trim().replace(/\s+/g, '');
};