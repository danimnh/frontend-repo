import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { User } from 'firebase/auth';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  accessToken: string | null;
}

interface UserState {
  user: User | null;
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  success: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setSuccess, setError, clearError } =
  userSlice.actions;
export default userSlice.reducer;
