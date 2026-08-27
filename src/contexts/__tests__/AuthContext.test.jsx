import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, AuthContext } from '../AuthContext';
import { useContext } from 'react';


// Mock auth API
vi.mock('../../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

import * as authApi from '../../api/auth';


// Test component to access context
const TestConsumer = () => {
  const context = useContext(AuthContext);
  
  if (context.isLoading)
    return <div data-testid="loading">Loading...</div>;
  
  const handleLogin = async () => {
    try {
      await context.login({ username: 'test', password: 'pass' });
    } catch (e) {}
  };
  
  const handleRegister = async () => {
    try {
      await context.register({ username: 'newuser', password: 'pass', email: 'test@example.com' });
    } catch (e) {}
  };
  
  return (
    <div>
      <span data-testid="is-authenticated">{context.isAuthenticated.toString()}</span>
      <span data-testid="is-admin">{context.isAdmin.toString()}</span>
      <span data-testid="user">{context.user ? JSON.stringify(context.user) : 'null'}</span>
      <span data-testid="error">{context.error || 'null'}</span>
      <button 
        onClick={handleLogin} 
        data-testid="login"
      >
        Login
      </button>
      <button onClick={context.logout} data-testid="logout">
        Logout
      </button>
      <button 
        onClick={handleRegister} 
        data-testid="register"
      >
        Register
      </button>
    </div>
  );
};


describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('AuthProvider', () => {
    it('should render children', async () => {
      render(
        <AuthProvider>
          <div data-testid="child">Child content</div>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeInTheDocument();
      });
    });

    it('should not be authenticated initially when no stored token', async () => {
      localStorage.getItem.mockReturnValue(null);
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      });
    });

    it('should be authenticated when valid token exists in storage', async () => {
      const futureExpiry = Date.now() + 86400000; // 24 hours from now

      localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'token': return 'valid-token';
          case 'user': return JSON.stringify({ id: 1, username: 'testuser' });
          case 'tokenExpiry': return futureExpiry.toString();
          default: return null;
        }
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });
    });

    it('should clear expired token on initialization', async () => {
      const pastExpiry = Date.now() - 1000; // 1 second ago

      localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'token': return 'expired-token';
          case 'user': return JSON.stringify({ id: 1, username: 'testuser' });
          case 'tokenExpiry': return pastExpiry.toString();
          default: return null;
        }
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      });
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const user = userEvent.setup();
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIifQ.abc';
      
      authApi.login.mockResolvedValue({
        token: mockToken,
        user: { id: 1, username: 'testuser' },
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('login'));

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    });

    it('should handle login error', async () => {
      const user = userEvent.setup();
      
      authApi.login.mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } },
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('login'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
      });
    });
  });

  describe('logout', () => {
    it('should logout and clear auth data', async () => {
      const user = userEvent.setup();
      const futureExpiry = Date.now() + 86400000;
      
      localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'token': return 'valid-token';
          case 'user': return JSON.stringify({ id: 1, username: 'testuser' });
          case 'tokenExpiry': return futureExpiry.toString();
          default: return null;
        }
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      await user.click(screen.getByTestId('logout'));

      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(localStorage.removeItem).toHaveBeenCalledWith('tokenExpiry');
    });
  });

  describe('register', () => {
    it('should register successfully and auto-login', async () => {
      const user = userEvent.setup();
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoibmV3dXNlciJ9.xyz';
      
      authApi.register.mockResolvedValue({
        token: mockToken,
        user: { id: 2, username: 'newuser', email: 'test@example.com' },
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('register')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('register'));

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    });
  });

  describe('isAdmin', () => {
    it('should detect admin role from roles array', async () => {
      const futureExpiry = Date.now() + 86400000;

      localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'token': return 'valid-token';
          case 'user': return JSON.stringify({ 
            id: 1, 
            username: 'admin', 
            roles: ['ROLE_ADMIN'] 
          });
          case 'tokenExpiry': return futureExpiry.toString();
          default: return null;
        }
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
      });
    });

    it('should detect admin from isAdmin property', async () => {
      const futureExpiry = Date.now() + 86400000;

      localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'token': return 'valid-token';
          case 'user': return JSON.stringify({ 
            id: 1, 
            username: 'admin', 
            isAdmin: true 
          });
          case 'tokenExpiry': return futureExpiry.toString();
          default: return null;
        }
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
      });
    });

    it('should return false for non-admin user', async () => {
      const futureExpiry = Date.now() + 86400000;

      localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'token': return 'valid-token';
          case 'user': return JSON.stringify({ 
            id: 1, 
            username: 'user', 
            roles: ['ROLE_USER'] 
          });
          case 'tokenExpiry': return futureExpiry.toString();
          default: return null;
        }
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
      });
    });
  });

  describe('token expiry handling', () => {
    it('should not authenticate with already expired token', async () => {
      const pastExpiry = Date.now() - 10000; // Expired 10 seconds ago

      localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'token': return 'expired-token';
          case 'user': return JSON.stringify({ id: 1, username: 'testuser' });
          case 'tokenExpiry': return pastExpiry.toString();
          default: return null;
        }
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      });
    });

    it('should authenticate with valid non-expired token', async () => {
      const futureExpiry = Date.now() + 3600000; // Expires in 1 hour

      localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'token': return 'valid-token';
          case 'user': return JSON.stringify({ id: 1, username: 'testuser' });
          case 'tokenExpiry': return futureExpiry.toString();
          default: return null;
        }
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });
    });
  });

  describe('isAdmin with different role formats', () => {
    it('should detect admin from role object with authority', async () => {
      const futureExpiry = Date.now() + 86400000;

      localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'token': return 'valid-token';
          case 'user': return JSON.stringify({ 
            id: 1, 
            username: 'admin', 
            roles: [{ authority: 'ROLE_ADMIN' }] 
          });
          case 'tokenExpiry': return futureExpiry.toString();
          default: return null;
        }
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
      });
    });

    it('should detect admin from single role property', async () => {
      const futureExpiry = Date.now() + 86400000;

      localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'token': return 'valid-token';
          case 'user': return JSON.stringify({ 
            id: 1, 
            username: 'admin', 
            role: 'ADMIN' 
          });
          case 'tokenExpiry': return futureExpiry.toString();
          default: return null;
        }
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
      });
    });
  });

  describe('additional auth scenarios', () => {
    it('should handle login response with accessToken field', async () => {
      const user = userEvent.setup();
      
      authApi.login.mockResolvedValue({
        accessToken: 'access-token-123',
        user: { id: 1, username: 'testuser' },
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('login'));

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });
    });

    it('should handle login error without response data', async () => {
      const user = userEvent.setup();
      
      authApi.login.mockRejectedValue(new Error('Network error'));
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('login'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });
    });

    it('should handle register error', async () => {
      const user = userEvent.setup();
      
      authApi.register.mockRejectedValue({
        response: { data: { message: 'Username already exists' } },
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('register')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('register'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Username already exists');
      });
    });

    it('should handle register without token in response', async () => {
      const user = userEvent.setup();
      
      authApi.register.mockResolvedValue({
        message: 'Registration successful',
      });
      
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('register')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('register'));

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      });
    });
  });

  describe('clearError and updateUser', () => {
    it('should clear error', async () => {
      const user = userEvent.setup();
      
      authApi.login.mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } },
      });
      
      const TestClearError = () => {
        const context = useContext(AuthContext);
        
        const handleLogin = async () => {
          try {
            await context.login({ username: 'test', password: 'pass' });
          } catch (e) {}
        };
        
        return (
          <div>
            <span data-testid="error">{context.error || 'null'}</span>
            <button onClick={handleLogin} data-testid="login">Login</button>
            <button onClick={context.clearError} data-testid="clear">Clear</button>
          </div>
        );
      };
      
      render(
        <AuthProvider>
          <TestClearError />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('login'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
      });

      await user.click(screen.getByTestId('clear'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('null');
      });
    });

    it('should update user data', async () => {
      const user = userEvent.setup();
      const futureExpiry = Date.now() + 86400000;
      
      localStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'token': return 'valid-token';
          case 'user': return JSON.stringify({ id: 1, username: 'testuser' });
          case 'tokenExpiry': return futureExpiry.toString();
          default: return null;
        }
      });
      
      const TestUpdateUser = () => {
        const context = useContext(AuthContext);
        
        return (
          <div>
            <span data-testid="user">{context.user ? JSON.stringify(context.user) : 'null'}</span>
            <button 
              onClick={() => context.updateUser({ email: 'new@email.com' })} 
              data-testid="update"
            >
              Update
            </button>
          </div>
        );
      };
      
      render(
        <AuthProvider>
          <TestUpdateUser />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('update')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('update'));

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('new@email.com');
      });
    });
  });
});
