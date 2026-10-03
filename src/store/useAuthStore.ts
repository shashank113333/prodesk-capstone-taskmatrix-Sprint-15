import { create } from 'zustand';

export interface UserPayload {
  uid: string;
  name: string;
  email: string;
  role: 'Developer' | 'Project Lead' | 'Admin';
}

export interface RegisteredUser extends UserPayload {
  password?: string;
  registeredAt?: string;
  status?: 'active' | 'suspended' | 'banned';
  suspendedUntil?: string | null; // ISO string date or 'PERMANENT'
  suspensionReason?: string;
}

interface AuthState {
  user: UserPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  loginError: string | null;
  registeredUsers: RegisteredUser[];
  
  login: (email: string, password: string, role?: 'Developer' | 'Project Lead' | 'Admin') => boolean;
  register: (name: string, email: string, password: string, role?: 'Developer' | 'Project Lead' | 'Admin') => boolean;
  resetPassword: (email: string, newPassword: string) => { success: boolean; error?: string };
  logout: () => void;
  hydrateAuth: () => void;
  clearError: () => void;

  // Admin Master Controls (RBAC User Management)
  deleteUserAccount: (email: string) => void;
  suspendUserAccount: (email: string, duration: '1h' | '24h' | '7d' | '30d' | 'permanent', reason?: string) => void;
  reactivateUserAccount: (email: string) => void;
  updateUserRole: (email: string, newRole: 'Developer' | 'Project Lead' | 'Admin') => void;
}

const defaultRegisteredUsers: RegisteredUser[] = [
  {
    uid: 'usr_dev_default',
    name: 'Shashank',
    email: 'developer@prodesk.io',
    role: 'Developer',
    password: 'password123',
    registeredAt: '2026-09-28',
    status: 'active',
  },
];

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loginError: null,
  registeredUsers: defaultRegisteredUsers,

  clearError: () => set({ loginError: null }),

  // STRICT LOGIN Handler with Suspension & Restriction Check
  login: (email: string, password = '', role = 'Developer') => {
    if (typeof window === 'undefined') return false;

    const savedRegistered = localStorage.getItem('taskmatrix_registered_users');
    let registeredList: RegisteredUser[] = defaultRegisteredUsers;

    if (savedRegistered) {
      try {
        registeredList = JSON.parse(savedRegistered);
      } catch (err) {
        registeredList = defaultRegisteredUsers;
      }
    } else {
      localStorage.setItem('taskmatrix_registered_users', JSON.stringify(defaultRegisteredUsers));
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Check if Email exists
    const existingUser = registeredList.find(
      (u) => u.email.trim().toLowerCase() === cleanEmail
    );

    if (!existingUser) {
      set({
        loginError: `No registered account found for "${email}". Please create an account first!`,
        isAuthenticated: false,
        user: null,
        token: null,
      });
      return false;
    }

    // 2. Strict Password Check
    const userStoredPassword = existingUser.password || 'password123';
    if (userStoredPassword !== cleanPassword) {
      set({
        loginError: `Incorrect password entered for "${email}". Please enter correct password or click Forgot Password.`,
        isAuthenticated: false,
        user: null,
        token: null,
      });
      return false;
    }

    // 3. Strict Role-Based Check
    if (existingUser.role && existingUser.role !== role) {
      set({
        loginError: `Role Mismatch! Your account is registered as "${existingUser.role}". Please select "${existingUser.role}" to sign in.`,
        isAuthenticated: false,
        user: null,
        token: null,
      });
      return false;
    }

    // 4. ADMIN USER SUSPENSION / BAN CHECK!
    if (existingUser.status === 'suspended' || existingUser.status === 'banned') {
      if (existingUser.suspendedUntil === 'PERMANENT') {
        set({
          loginError: `Access Denied: Account "${email}" has been Permanently Banned by System Admin.`,
          isAuthenticated: false,
          user: null,
          token: null,
        });
        return false;
      } else if (existingUser.suspendedUntil) {
        const expiryDate = new Date(existingUser.suspendedUntil);
        if (expiryDate > new Date()) {
          set({
            loginError: `Account Suspended! Your access is restricted until ${expiryDate.toLocaleString()}. Reason: ${existingUser.suspensionReason || 'Admin Policy Enforcement'}.`,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          return false;
        } else {
          // Suspension Expired - Auto Reactivate
          existingUser.status = 'active';
          existingUser.suspendedUntil = null;
          localStorage.setItem('taskmatrix_registered_users', JSON.stringify(registeredList));
        }
      }
    }

    const userPayload: UserPayload = {
      uid: existingUser.uid,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    const mockToken = `jwt_mock_token_${Date.now()}`;
    localStorage.setItem('taskmatrix_user', JSON.stringify(userPayload));
    localStorage.setItem('taskmatrix_token', mockToken);

    set({
      user: userPayload,
      token: mockToken,
      isAuthenticated: true,
      loginError: null,
      registeredUsers: registeredList,
    });

    return true;
  },

  // REGISTER Handler
  register: (name: string, email: string, password = '', role: 'Developer' | 'Project Lead' | 'Admin' = 'Developer') => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (typeof window === 'undefined') return false;

    const savedRegistered = localStorage.getItem('taskmatrix_registered_users');
    let registeredList: RegisteredUser[] = defaultRegisteredUsers;

    if (savedRegistered) {
      try {
        registeredList = JSON.parse(savedRegistered);
      } catch (err) {
        registeredList = defaultRegisteredUsers;
      }
    }

    const existing = registeredList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      set({
        loginError: `An account with email "${cleanEmail}" is already registered. Please Sign In instead!`,
      });
      return false;
    }

    const newUser: RegisteredUser = {
      uid: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: role,
      password: cleanPassword,
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    const updatedList = [newUser, ...registeredList];
    localStorage.setItem('taskmatrix_registered_users', JSON.stringify(updatedList));

    const mockToken = `jwt_mock_token_${Date.now()}`;
    localStorage.setItem('taskmatrix_user', JSON.stringify(newUser));
    localStorage.setItem('taskmatrix_token', mockToken);

    set({
      user: {
        uid: newUser.uid,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token: mockToken,
      isAuthenticated: true,
      loginError: null,
      registeredUsers: updatedList,
    });

    return true;
  },

  // RESET PASSWORD Handler
  resetPassword: (email: string, newPassword = '') => {
    if (typeof window === 'undefined') return { success: false, error: 'Browser missing' };

    const savedRegistered = localStorage.getItem('taskmatrix_registered_users');
    let registeredList: RegisteredUser[] = defaultRegisteredUsers;

    if (savedRegistered) {
      try {
        registeredList = JSON.parse(savedRegistered);
      } catch (err) {
        registeredList = defaultRegisteredUsers;
      }
    }

    const targetIndex = registeredList.findIndex(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (targetIndex === -1) {
      return { success: false, error: `No registered account found for email "${email}".` };
    }

    registeredList[targetIndex].password = newPassword.trim();
    localStorage.setItem('taskmatrix_registered_users', JSON.stringify(registeredList));

    set({ registeredUsers: registeredList });
    return { success: true };
  },

  // ADMIN ACTION: Delete User Account
  deleteUserAccount: (email: string) => {
    const list = get().registeredUsers.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskmatrix_registered_users', JSON.stringify(list));
    }
    set({ registeredUsers: list });
  },

  // ADMIN ACTION: Suspend / Restrict User Account
  suspendUserAccount: (email: string, duration: '1h' | '24h' | '7d' | '30d' | 'permanent', reason = 'Admin Policy Enforcement') => {
    const now = Date.now();
    let until: string | null = 'PERMANENT';

    if (duration === '1h') until = new Date(now + 3600 * 1000).toISOString();
    else if (duration === '24h') until = new Date(now + 24 * 3600 * 1000).toISOString();
    else if (duration === '7d') until = new Date(now + 7 * 24 * 3600 * 1000).toISOString();
    else if (duration === '30d') until = new Date(now + 30 * 24 * 3600 * 1000).toISOString();
    else until = 'PERMANENT';

    const updated = get().registeredUsers.map((u) => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return {
          ...u,
          status: (duration === 'permanent' ? 'banned' : 'suspended') as RegisteredUser['status'],
          suspendedUntil: until,
          suspensionReason: reason,
        };
      }
      return u;
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('taskmatrix_registered_users', JSON.stringify(updated));
    }
    set({ registeredUsers: updated });
  },

  // ADMIN ACTION: Reactivate User Account
  reactivateUserAccount: (email: string) => {
    const updated = get().registeredUsers.map((u) => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return {
          ...u,
          status: 'active' as RegisteredUser['status'],
          suspendedUntil: null,
          suspensionReason: undefined,
        };
      }
      return u;
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('taskmatrix_registered_users', JSON.stringify(updated));
    }
    set({ registeredUsers: updated });
  },

  // ADMIN ACTION: Update User Role
  updateUserRole: (email: string, newRole: 'Developer' | 'Project Lead' | 'Admin') => {
    const updated = get().registeredUsers.map((u) => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, role: newRole };
      }
      return u;
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('taskmatrix_registered_users', JSON.stringify(updated));
    }
    set({ registeredUsers: updated });
  },

  // LOGOUT Handler
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('taskmatrix_user');
      localStorage.removeItem('taskmatrix_token');
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loginError: null,
    });
  },

  // HYDRATE AUTH Handler
  hydrateAuth: () => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('taskmatrix_user');
      const savedToken = localStorage.getItem('taskmatrix_token');
      const savedRegistered = localStorage.getItem('taskmatrix_registered_users');

      let regList = defaultRegisteredUsers;
      if (savedRegistered) {
        try {
          regList = JSON.parse(savedRegistered);
        } catch (e) {
          regList = defaultRegisteredUsers;
        }
      }

      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          set({
            user: parsedUser,
            token: savedToken,
            isAuthenticated: true,
            loginError: null,
            registeredUsers: regList,
          });
        } catch (err) {
          console.error('Failed to parse user', err);
        }
      } else {
        set({ registeredUsers: regList });
      }
    }
  },
}));