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

const pool = new SimplePool()


const nostrInitial = {
    relayList: ['wss://nos.lol'],
    events: null,
    privateKey: '',
    publicKey: '',
};

export const nostrSlice = createSlice({
  name: 'nostr',
  initialState: nostrInitial,
  reducers: {
    setRelays: (state, action) => {
        console.log(`setRelays: ${action.payload}`)
        state.relayList = action.payload;
    },
    setPrivateKey: (state, action) => {
      console.log(`setPrivateKey: ${action.payload}`);
      state.privateKey = action.payload;
    },
    getEvents: async (state) => {
      console.log(`Retrieving Events`);
      state.events = await pool.list(nostrInitial.relayList, [{kinds: [1]}])
      console.log(`Retrieved Events: ${state.events}`);
    },
  },
})

export const { setRelays, setPrivateKey, getEvents } = nostrSlice.actions

export default nostrSlice.reducer