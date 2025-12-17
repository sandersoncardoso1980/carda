const AUTH_KEY = 'burgerhub_is_admin';

export const AuthService = {
  login: (email: string, password: string): boolean => {
    if (email === 'admin@admin.com' && password === '123456') {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_KEY);
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  }
};