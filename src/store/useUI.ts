"use client";
import { create } from "zustand";
type UIState={ dark:boolean; toggleDark:()=>void };
export const useUI = create<UIState>((set,get)=>({
  dark:false, toggleDark:()=>set({ dark: !get().dark })
}));
