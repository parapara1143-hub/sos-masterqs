"use client";
import { create } from "zustand";
import { doLogin, clearTokens, hasSession } from "@/src/lib/auth";

type AuthState = {
  logged:boolean;
  login:(u:string,p:string,remember?:boolean)=>Promise<void>;
  logout:()=>void;
};
export const useAuth = create<AuthState>((set)=>({
  logged: hasSession(),
  async login(u,p,remember){ await doLogin(u,p); set({ logged:true }); },
  logout(){ clearTokens(); set({logged:false}); if(typeof window!=="undefined") window.location.href="/login"; }
}));
