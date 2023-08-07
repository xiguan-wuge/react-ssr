import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

import { serverPath } from '@/server/config'

export const getDemoData = createAsyncThunk(
  'demo/getData',
  async (initData: string) => {
    const res = await axios.post(`${serverPath}/api/getDemoData`, {
      content:initData
    })
    return res?.data?.data?.content
  }
)

export const demoReducer = createSlice({
  name: 'demo',
  initialState: 
    // {content: '默认数据'},
    // 因为服务器端下访问的时候是没有 window 等 BOM 的，所以需要用 typeof 来判断。
    // 这也是SSR中常常遇到的问题，当有对 BOM的调用时，需要进行判空，否则在服务器端执行的时候将会报错
    typeof window !== "undefined"
      ? (window as any)?.context?.state?.demo
      : {
          content: "默认数据",
        },
  // 同步reducer
  reducers:{},
  extraReducers(build:any) {
    build
      .addCase(getDemoData.pending, (state: any) => {
        state.content = "pending";
      })
      .addCase(getDemoData.fulfilled, (state:any, action:any) => {
        state.content = action.payload;
      })
      .addCase(getDemoData.rejected, (state:any) => {
        state.content = "rejected";
      });
  }
})

