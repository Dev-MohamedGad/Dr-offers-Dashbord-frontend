import { createSlice } from '@reduxjs/toolkit'

export type State = {
  asideShow: boolean
  sidebarShow: boolean
  theme: string
  sidebarUnfoldable: boolean
}

const initialState: State = {
  asideShow: false,
  sidebarShow: true,
  theme: 'light',
  sidebarUnfoldable: false,
}

export const layout = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    set: (state, action) => {
      state.asideShow = action.payload.asideShow
      state.sidebarShow = action.payload.sidebarShow
      state.theme = action.payload.theme
      state.sidebarUnfoldable = action.payload.sidebarUnfoldable
    },
  },
})

export const { set } = layout.actions

export default layout.reducer