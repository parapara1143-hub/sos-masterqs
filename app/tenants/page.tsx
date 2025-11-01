"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { IMPERSONATE_PATH } from "@/src/lib/constants";
import { saveTokens } from "@/src/lib/auth";
import { useRouter } from "next/navigation";

type Company={ id:number; name:string; logo_url?:string; incidents_open?:number; users?:number; city?:string };

export default function Page(){
  const [items,setItems]=useState<Company[]>([]);
  const [loading,setLoading]=useState(true);
  const r=useRouter();
  useEffect(()=>{ (async()=>{
    try{ const res=await api.get("/api/master/companies"); setItems(res.data.items||[]); }
    catch{ setItems([{id:1,name:"TechSeed",incidents_open:2,users:148,city:"Betim"},{id:2,name:"Stellantis",incidents_open:5,users:3000,city:"Betim"}]); }
    finally{ setLoading(false); }
  })(); },[]);

  async function impersonate(company_id:number){
    try{ const res=await api.post(`${IMPERSONATE_PATH}/${company_id}`); saveTokens(res.data); r.push("/dashboard"); }
    catch{ alert("Falha ao entrar no painel da empresa"); }
  }

  if(loading) return <p>Carregando...</p>;
  return <div style={{display:"grid",gap:16}}>
    <h1>Empresas</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
      {items.map(c=>(<div key={c.id} style={{background:"var(--card-bg,#fff)",border:"1px solid #2a2a2a20",borderRadius:12,padding:16}}>
        <div style={{fontWeight:700,fontSize:18}}>{c.name}</div>
        <div style={{fontSize:12,opacity:.7}}>{c.city||"-"}</div>
        <div style={{marginTop:8,fontSize:14}}>Incidentes abertos: {c.incidents_open??"-"}</div>
        <div style={{fontSize:14}}>Usuários: {c.users??"-"}</div>
        <button onClick={()=>impersonate(c.id)} style={{marginTop:10,width:"100%"}}>Entrar no painel</button>
      </div>))}
    </div>
  </div>;
}
