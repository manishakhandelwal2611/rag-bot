import { createReducer } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  setLoading,
  setError,
  clearError,
  showSnackbar,
  hideSnackbar
} from './actions'
import { type FeatureValue } from '../../types/global'

export interface LoadingState {
  [K in FeatureValue]?: boolean
}

export interface ErrorState {
  [K in FeatureValue]?: string | null
}

export interface SnackbarState {
  isOpen: boolean
  message: string
  severity: 'error' | 'warning' | 'info' | 'success'
}

export interface GlobalState {
  loading: LoadingState
  errors: ErrorState
  snackbar: SnackbarState
}

const initialState: GlobalState = {
  loading: {},
  errors: {},
  snackbar: {
    isOpen: false,
    message: '',
    severity: 'info'
  }
}

export const globalReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLoading, (state, action: PayloadAction<{ feature: FeatureValue; isLoading: boolean }>) => {
      const { feature, isLoading } = action.payload
      state.loading[feature] = isLoading
    })
    .addCase(setError, (state, action: PayloadAction<{ feature: FeatureValue; error: string | null }>) => {
      const { feature, error } = action.payload
      state.errors[feature] = error
    })
    .addCase(clearError, (state, action: PayloadAction<FeatureValue>) => {
      const feature = action.payload
      state.errors[feature] = null
    })
    .addCase(showSnackbar, (state, action: PayloadAction<{ message: string; severity: 'error' | 'warning' | 'info' | 'success' }>) => {
      const { message, severity } = action.payload
      state.snackbar = {
        isOpen: true,
        message,
        severity
      }
    })
    .addCase(hideSnackbar, (state) => {
      state.snackbar.isOpen = false
    })
})
