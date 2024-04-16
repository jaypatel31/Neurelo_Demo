import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
  categoryStatus: "idle",
  categoryInfo: null,
  categoryError: null,
  newCreated:null
}

export const addCategory = createAsyncThunk(
  "category/addNew",
  async ({categoryData,token}, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/category/new",
        categoryData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      )
      return data
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const getAllCategory = createAsyncThunk(
    "category/getAll",
    async ({token}, { rejectWithValue }) => {
      try {
        const { data } = await axios.get(
          "/api/category/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        return data
      } catch (err) {
        return rejectWithValue(err.response.data)
      }
    }
  )

export const loginSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetCategory(state,action){
      state.categoryError=null
      state.categoryInfo=null
      state.newCreated=null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(addCategory.pending, state => {
        state.categoryStatus = "loading";
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categoryStatus = "succeeded";
        state.categoryInfo = action.payload.data;
        state.newCreated = action.payload.new;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.categoryStatus = "failed";
        state.categoryError =
          action.payload.message || "Something Went Wrong. Try Again Later!!";
      });

      builder
      .addCase(getAllCategory.pending, state => {
        state.categoryStatus = "loading";
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.categoryStatus = "succeeded";
        state.categoryInfo = action.payload.data;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.categoryStatus = "failed";
        state.categoryError =
          action.payload.message || "Something Went Wrong. Try Again Later!!";
      });
  }
})

export const { resetCategory } = loginSlice.actions

export default loginSlice.reducer 