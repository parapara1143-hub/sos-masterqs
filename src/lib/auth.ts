"use client";
import { api } from "./api";

const K={ ACCESS:"safein_access", REFRESH:"safein_refresh", EXP:"safein_exp" };

export function saveTokens(data:any){
  if(!data) return;
  if(data.access_token) localStorage.setItem(K.ACCESS,data.access_token);
  if(data.refresh_token) localStorage.setItem(K.REFRESH,data.refresh_token);
  if(data.expires_at) localStorage.setItem(K.EXP,String(data.expires_at));
}
export function clearTokens(){ localStorage.removeItem(K.ACCESS); localStorage.removeItem(K.REFRESH); localStorage.removeItem(K.EXP); }
export function getAccessToken(){ if(typeof window==="undefined") return null; return localStorage.getItem(K.ACCESS); }
export function getRefreshToken(){ if(typeof window==="undefined") return null; return localStorage.getItem(K.REFRESH); }
export function hasSession(){ if(typeof window==="undefined") return false; return !!localStorage.getItem(K.ACCESS); }

export async function doLogin(username:string, password:string){
  const res = await api.post("/api/auth/login",{ username, password });
  saveTokens(res.data);
  return res.data;
}
