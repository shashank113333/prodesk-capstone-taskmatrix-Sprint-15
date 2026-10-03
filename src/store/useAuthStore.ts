import { create } from 'zustand';

export interface UserPayload {
  uid: string;
  name: string;
  email: string;
  role: 'Developer' | 'Project Lead' | 'Admin';
}

export interface RegisteredUser extends UserPayload {
  password?: string;
}

interface AuthState {
  user: UserPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  loginError: string | null;
  login: (email: string, password?: string, role?: 'Developer' | 'Project Lead' | 'Admin') => boolean;
  register: (name: string, email: string, role: 'Developer' | 'Project Lead' | 'Admin', password?: string) => void;
  resetPassword: (email: string, newPassword?: string) => { success: boolean; error?: string };
  logout: () => void;
  hydrateAuth: () => void;
  clearError: () => void;
}

// Default pre-registered developer profile
const defaultRegisteredUsers: RegisteredUser[] = [
  {
    uid: 'usr_dev_default',
    name: 'Shashank',
    email: 'developer@prodesk.io',
    role: 'Developer',
    password: 'password123',
  },
];

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loginError: null,

  clearError: () => set({ loginError: null }),

  // STRICT LOGIN Handler with Email & Password Match
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

    // 1. Check if Email exists
    const existingUser = registeredList.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!existingUser) {
      set({
        loginError: `No account found for "${email}". Please register an account first!`,
        isAuthenticated: false,
      });
      return false;
    }

    // 2. STRICT PASSWORD MATCH CHECK!
    if (existingUser.password && existingUser.password !== password) {
      set({
        loginError: `Incorrect password entered for "${email}". Please try again or click Forgot Password.`,
        isAuthenticated: false,
      });
      return false;
    }

    const userPayload: UserPayload = {
      uid: existingUser.uid,
      name: existingUser.name,
      email: existingUser.email,
      role: role || existingUser.role,
    };

    const mockToken = `jwt_mock_token_${Date.now()}`;
    localStorage.setItem('taskmatrix_user', JSON.stringify(userPayload));
    localStorage.setItem('taskmatrix_token', mockToken);

    set({
      user: userPayload,
      token: mockToken,
      isAuthenticated: true,
      loginError: null,
    });

    return true;
  },

  // REGISTER Handler
  register: (name: string, email: string, role: 'Developer' | 'Project Lead' | 'Admin', password = '') => {
    const newUser: RegisteredUser = {
      uid: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role,
      password: password,
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
        ...registeredList.filter((u) => u.email.toLowerCase() !== newUser.email),
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

    registeredList[targetIndex].password = newPassword;
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
      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          set({
            user: parsedUser,
            token: savedToken,
            isAuthenticated: true,
            loginError: null,
          });
        } catch (err) {
          console.error('Failed to parse user', err);
        }
      }
    }
  },
}));