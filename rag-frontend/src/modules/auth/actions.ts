import { createAction } from '@reduxjs/toolkit'

export interface User {
  token?: string
  email?: string
  name?: string
  picture?: string
}

// Action types
export const AUTH_ACTIONS = {
  SET_TOKEN: 'auth/setToken',
  SET_USER: 'auth/setUser',
  LOGOUT: 'auth/logout',
  SET_INITIALIZED: 'auth/setInitialized',
} as const

// Action creators
export const setToken = createAction<string>(AUTH_ACTIONS.SET_TOKEN)
export const setUser = createAction<User | null>(AUTH_ACTIONS.SET_USER)
export const logout = createAction(AUTH_ACTIONS.LOGOUT)
export const setInitialized = createAction<boolean>(AUTH_ACTIONS.SET_INITIALIZED)
