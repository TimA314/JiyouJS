import { configureStore } from '@reduxjs/toolkit'
import nostrReducer from './nostr.js'

export const store = configureStore({
  reducer: {
    nostr: nostrReducer
  },
})