import { createReducer } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { parseJwt } from '../../utils/tokenUtils'
import { AUTH_ACTIONS, type User } from './actions'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitialized: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
}

export const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(AUTH_ACTIONS.SET_TOKEN, (state, action: PayloadAction<string>) => {
      const token = action.payload
      if (!token) {
        localStorage.removeItem("chat_user")
        state.user = null
        state.isAuthenticated = false
        return
      }
      
      const decoded = parseJwt(token)
      if (decoded?.email) {
        localStorage.setItem("chat_user", token)
        state.user = {
          token,
          email: decoded.email,
          name: decoded.name || decoded.given_name || "",
          picture: decoded.picture || decoded.avatar_url || "",
        }
        state.isAuthenticated = true
      } else {
        // Invalid token case
        localStorage.removeItem("chat_user")
        state.user = null
        state.isAuthenticated = false
      }
    })
    .addCase(AUTH_ACTIONS.SET_USER, (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    })
    .addCase(AUTH_ACTIONS.LOGOUT, (state) => {
      localStorage.removeItem("chat_user")
      state.user = null
      state.isAuthenticated = false
    })
    .addCase(AUTH_ACTIONS.SET_INITIALIZED, (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    })
})
