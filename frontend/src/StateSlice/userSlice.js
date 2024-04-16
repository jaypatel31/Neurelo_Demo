import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  userInfo: null,
  error: null,
  profile: null,
  userProductCount: null,
  taskCreationStatus:null
};

export const getuserInfo = createAsyncThunk(
  "user/getuserInfo",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/users/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createNewTask = createAsyncThunk(
    "user/createTask",
    async ({ payload, token }, { rejectWithValue }) => {
      try {
        const { data } = await axios.post(`/api/users/newtask`, payload ,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return data;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );


  export const editTask = createAsyncThunk(
    "user/editTask",
    async ({ payload, token }, { rejectWithValue }) => {
      try {
        const { data } = await axios.put(`/api/users/updatetask`, payload ,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return data;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const deleteTaskAction = createAsyncThunk(
    "user/deleteTask",
    async ({ id, token }, { rejectWithValue }) => {
      try {
        const { data } = await axios.delete(`/api/users/deletetask/${id}` ,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return data;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );


export const userInfoSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset(state, action) {
      state.error = null;
      state.profile = null;
      state.userInfo = null;
      state.userProductCount = null;
    },
    resetStatus(state,action){
      state.status="idle"
      state.taskCreationStatus=null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getuserInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getuserInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.userInfo = action.payload.data;
      })
      .addCase(getuserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });

    builder
      .addCase(createNewTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createNewTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.userInfo = action.payload.data;
        state.taskCreationStatus = true
      })
      .addCase(createNewTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });

      builder
      .addCase(editTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.userInfo = action.payload.data;
        state.taskCreationStatus = true
      })
      .addCase(editTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });

      builder
      .addCase(deleteTaskAction.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTaskAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.userInfo = action.payload.data;
        state.taskCreationStatus = true
      })
      .addCase(deleteTaskAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  }
});

export const { reset,resetStatus } = userInfoSlice.actions;
export default userInfoSlice.reducer;
