"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

type Integration={ key:string; name:string; status:string };

export default function Page(){
  const [rows,setRows]=useState<Integration[]>([]);
  const [loading,setLoading]=useState(true);

  async function load(){
    try{ setLoading(true); const r=await api.get("/api/integrations"); setRows(r.data.items||[]); }
    catch{ setRows([{key:"firebase",name:"Firebase FCM",status:"connected"},{key:"cameras",name:"IpCams",status:"pending"}]); }
    finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); },[]);

  async function connect(key:string){
    try{ await api.post(`/api/integrations/${key}/connect`); await load(); }catch{ alert("Falha na conexão"); }
  }

  return <div style={{display:"grid",gap:16}}>
    <h1>Integrações</h1>
    {loading? <p>Carregando...</p> :
    <div style={{background:"var(--card-bg,#fff)",padding:16,borderRadius:12,border:"1px solid #2a2a2a20"}}>
      <table><thead><tr><th>Chave</th><th>Nome</th><th>Status</th><th>Ações</th></tr></thead>
      <tbody>{rows.map(r=>(<tr key={r.key}><td>{r.key}</td><td>{r.name}</td><td>{r.status}</td>
        <td><button onClick={()=>connect(r.key)}>Conectar</button></td></tr>))}</tbody></table>
    </div>}
  </div>;
}
