import { createSlice } from '@reduxjs/toolkit';

const submitSlice = createSlice({
  name: 'submit',
  initialState: {
    resume: null,
    job_posting: "",
    github_url: "",
    gitlab_url: "",
    personal_write_up: "",
    personal_website: "",
  },
  reducers: {
    // This updates all fields at once (can include resume too)
    setSubmit: (state, action) => {
    
      console.log(action.payload)
      state = { ...state, ...action.payload };
      console.log(state)
    },

    // This sets just the resume separately (from Dropzone)
    setResume: (state, action) => {
      console.log(action.payload)
      state.resume = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});


export const { setSubmit, setResume, setError } = submitSlice.actions;
export default submitSlice.reducer;

