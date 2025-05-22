import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMicOn: true,
  isCameraOn: true,
  isScreenSharing: false,
};

const liveStreamSlice = createSlice({
  name: "live",
  initialState,
  reducers: {
    toggleMic: (state) => {
      state.isMicOn = !state.isMicOn;
    },
    toggleCamera: (state) => {
      state.isCameraOn = !state.isCameraOn;
    },
    toggleScreen: (state) => {
      state.isScreenSharing = !state.isScreenSharing;
    },

    setScreenSharing: (state, action) => {
      state.isScreenSharing = action.payload;
    },
  },
});

export const { toggleMic, toggleCamera, toggleScreen, setScreenSharing } =
  liveStreamSlice.actions;
export default liveStreamSlice.reducer;
