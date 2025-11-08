import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  userId: localStorage.getItem('userId') || null,
  userName: localStorage.getItem('userName') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, role, userId, userName } = action.payload;
      state.token = token;
      state.role = role;
      state.userId = userId;
      state.userName = userName;
      state.isAuthenticated = true;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.userId = null;
      state.userName = null;
      state.isAuthenticated = false;
      
      localStorage.clear();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

