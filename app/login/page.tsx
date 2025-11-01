"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/store/useAuth";

export default function Page(){
  const r=useRouter();
  const { login } = useAuth();
  const [username,setU]=useState("Qsinclusao1143");
  const [password,setP]=useState("Poli@1143");
  const [remember,setRemember]=useState(true);
  const [loading,setLoading]=useState(false);
  async function onSubmit(e:React.FormEvent){ e.preventDefault(); try{ setLoading(true); await login(username,password,remember); r.push("/dashboard"); } catch(e){ alert("Falha no login"); } finally{ setLoading(false); } }
  return <div style={{height:"100vh",display:"grid",placeItems:"center"}}>
    <form onSubmit={onSubmit} style={{width:380,background:"var(--card-bg,#fff)",padding:24,borderRadius:12,border:"1px solid #2a2a2a20"}}>
      <div style={{fontSize:22,fontWeight:800}}>SOS Enterprise – Painel Master QS Inclusão</div>
      <p>SafeIN — Seguro e Inclusivo</p>
      <input style={{width:"100%",margin:"8px 0",padding:10}} placeholder="Usuário/E-mail" value={username} onChange={e=>setU(e.target.value)}/>
      <input style={{width:"100%",margin:"8px 0",padding:10}} type="password" placeholder="Senha" value={password} onChange={e=>setP(e.target.value)}/>
      <label style={{display:"flex",alignItems:"center",gap:8}}><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Lembrar por 30 dias</label>
      <button type="submit" disabled={loading} style={{width:"100%",marginTop:12,padding:10}}>{loading?"Entrando...":"Entrar"}</button>
    </form>
  </div>;
}
