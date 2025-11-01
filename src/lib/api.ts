"use client";
import axios from "axios";
import { API_BASE } from "./constants";
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./auth";

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(cfg=>{
  const at = getAccessToken();
  if(at){
    (cfg.headers as any) = { ...(cfg.headers||{}), Authorization: `Bearer ${at}` };
  }
  return cfg;
});

let refreshing:Promise<any>|null=null;
api.interceptors.response.use(r=>r, async err=>{
  const status = err?.response?.status;
  if(status===401 && !err.config.__retried){
    if(!refreshing){
      refreshing=(async()=>{
        const rt=getRefreshToken();
        if(!rt){ clearTokens(); throw new Error("no refresh"); }
        const resp=await axios.post(`${API_BASE}/api/auth/refresh`, {}, { headers:{ Authorization:`Bearer ${rt}` } });
        saveTokens(resp.data);
        return resp.data;
      })();
    }
    await refreshing;
    (err.config as any).__retried=true;
    return api.request(err.config);
  }
  return Promise.reject(err);
});
