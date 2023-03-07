import { createSlice } from '@reduxjs/toolkit'
import {
  generatePrivateKey,
  relayInit, 
  getPublicKey,
  SimplePool,
  validateEvent,
  verifySignature,
  signEvent,
  getEventHash
} from 'nostr-tools'


const nostrInitial = {
    relayList: [
      'wss://eden.nostr.land'
    ],
    events: [],
    profiles: [],
    privateKey: "",
    publicKey: "",
};

export const nostrSlice = createSlice({
  name: 'nostr',
  initialState: nostrInitial,
  reducers: {
    addRelay: (state, action) => {
        console.log(`addRelays: ${action.payload}`)
        state.relayList = [...state.relayList, action.payload];
    },
    removeRelay: (state, action) => {
      console.log(`removeRelay: ${action}`);
      state.relayList = state.relayList.filter((r) => r !== action.payload);
    },
    setPrivateKey: (state, action) => {
      console.log(`setPrivateKey: ${action.payload}`);
      state.privateKey = action.payload;
      state.publicKey = getPublicKey(action.payload);
    },
    setEvents: (state, action) => {
      console.log("setEvents: payload " + action.payload)
      state.events = action.payload;
    },
    setProfiles: (state, action) => {
      console.log("setProfiles: " + action.payload)
      state.profiles = action.payload
    }
  },
})

export const { addRelay, setPrivateKey, setEvents, removeRelay, setProfiles } = nostrSlice.actions

export default nostrSlice.reducer