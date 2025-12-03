// lib/sessionManager.js
class SecureSessionManager {
  constructor() {
    this.SESSION_KEYS = {
      ADMIN_TOKEN: 'bw_admin_tkn',
      ADMIN_DATA: 'bw_admin_dt', 
      USER_ID: 'bw_usr_id',
      SESSION_ID: 'bw_sess_id'
    };
  }

  // Secure storage with encryption (basic example)
  encryptData(data) {
    if (typeof window === 'undefined') return data;
    try {
      // In production, use a proper encryption library like crypto-js
      return btoa(JSON.stringify(data));
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  decryptData(encryptedData) {
    if (typeof window === 'undefined' || !encryptedData) return null;
    try {
      return JSON.parse(atob(encryptedData));
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  // Session-based storage (expires with browser session)
  setSession(key, data) {
    if (typeof window === 'undefined') return;
    try {
      const encrypted = this.encryptData({
        data,
        timestamp: Date.now()
      });
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Session storage error:', error);
    }
  }

  getSession(key) {
    if (typeof window === 'undefined') return null;
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = this.decryptData(encrypted);
      return decrypted?.data || null;
    } catch (error) {
      console.error('Session retrieval error:', error);
      return null;
    }
  }

  removeSession(key) {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  }

  // Admin session management
  setAdminSession(token, adminData) {
    this.setSession(this.SESSION_KEYS.ADMIN_TOKEN, token);
    this.setSession(this.SESSION_KEYS.ADMIN_DATA, adminData);
    
    // Also set a session identifier
    this.setSession(this.SESSION_KEYS.SESSION_ID, this.generateSessionId());
  }

  getAdminSession() {
    const token = this.getSession(this.SESSION_KEYS.ADMIN_TOKEN);
    const adminData = this.getSession(this.SESSION_KEYS.ADMIN_DATA);
    
    if (!token || !adminData) {
      this.clearAdminSession();
      return null;
    }

    return { token, adminData };
  }

  clearAdminSession() {
    this.removeSession(this.SESSION_KEYS.ADMIN_TOKEN);
    this.removeSession(this.SESSION_KEYS.ADMIN_DATA);
    this.removeSession(this.SESSION_KEYS.SESSION_ID);
  }

  // User session management
  setUserSession(userId) {
    this.setSession(this.SESSION_KEYS.USER_ID, userId);
  }

  getUserId() {
    return this.getSession(this.SESSION_KEYS.USER_ID);
  }

  clearUserSession() {
    this.removeSession(this.SESSION_KEYS.USER_ID);
  }

  // Generate unique session ID
  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Validate session
  validateAdminSession() {
    const session = this.getAdminSession();
    if (!session) return false;

    // Add additional validation logic here if needed
    return true;
  }

  // Clear all sessions
  clearAllSessions() {
    Object.values(this.SESSION_KEYS).forEach(key => {
      this.removeSession(key);
    });
  }
}

export const sessionManager = new SecureSessionManager();