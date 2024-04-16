import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
  status: "idle",
  userLoggedIn: null,
  error: null,
  userFullInfo:null
}

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (loginFormData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/users/login",
        loginFormData
      )
      return data
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    reset(state,action){
      state.error=null
      state.userLoggedIn=null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userLoggedIn = true;
        localStorage.setItem("todotoken", action.payload.token);
        state.userFullInfo = action.payload.info;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload.message || "Something Went Wrong. Try Again Later!!";
      });
  }
})

export const { reset } = loginSlice.actions

export default loginSlice.reducer 