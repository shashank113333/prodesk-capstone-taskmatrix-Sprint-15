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
}

interface AuthState {
  user: UserPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  loginError: string | null;
  registeredUsers: RegisteredUser[];
  login: (email: string, password: string, role?: 'Developer' | 'Project Lead' | 'Admin') => boolean;
  register: (name: string, email: string, password: string, role?: 'Developer' | 'Project Lead' | 'Admin') => void;
  resetPassword: (email: string, newPassword: string) => { success: boolean; error?: string };
  logout: () => void;
  hydrateAuth: () => void;
  clearError: () => void;
}

const defaultRegisteredUsers: RegisteredUser[] = [
  {
    uid: 'usr_dev_default',
    name: 'Shashank',
    email: 'developer@prodesk.io',
    role: 'Developer',
    password: 'password123',
    registeredAt: '2026-09-28',
  },
];

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loginError: null,
  registeredUsers: defaultRegisteredUsers,

  clearError: () => set({ loginError: null }),

  // STRICT LOGIN Handler with Email, Password AND Registered Role Match
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

    // 1. Email Check
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

    // 3. STRICT ROLE-BASED ACCESS CONTROL (RBAC) MATCH!
    if (existingUser.role && existingUser.role !== role) {
      set({
        loginError: `Role Authorization Mismatch! Your registered account role is "${existingUser.role}". Please select "${existingUser.role}" to sign in.`,
        isAuthenticated: false,
        user: null,
        token: null,
      });
      return false;
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

    const newUser: RegisteredUser = {
      uid: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: role,
      password: cleanPassword,
      registeredAt: new Date().toISOString().split('T')[0],
    };

    if (typeof window !== 'undefined') {
      const savedRegistered = localStorage.getItem('taskmatrix_registered_users');
      let registeredList: RegisteredUser[] = defaultRegisteredUsers;

      if (savedRegistered) {
        try {
          registeredList = JSON.parse(savedRegistered);
        } catch (err) {
          registeredList = defaultRegisteredUsers;
        }
      }

      const updatedList = [
        newUser,
        ...registeredList.filter((u) => u.email.toLowerCase() !== cleanEmail),
      ];
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
    }
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
      return { success: false, error: `No registered account found with email "${email}".` };
    }

    registeredList[targetIndex].password = newPassword.trim();
    localStorage.setItem('taskmatrix_registered_users', JSON.stringify(registeredList));

    return { success: true };
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