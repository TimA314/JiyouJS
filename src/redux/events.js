import { createSlice } from '@reduxjs/toolkit'







const initialEvents = {
    events: ['Loading...'],
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState: initialEvents,
  reducers: {
    setEvents: (state, action) => {
        console.log(`setEvents: ${action.payload}`)
        state.relayList = action.payload;
    },
  },
})

export const { setRelays } = eventsSlice.actions

export default eventsSlice.reducer