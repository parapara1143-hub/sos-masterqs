"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

type Noti={ id:number; title:string; channel?:string; status?:string };

export default function Page(){
  const [rows,setRows]=useState<Noti[]>([]);
  const [title,setTitle]=useState("");
  const [channel,setChannel]=useState("push");
  const [loading,setLoading]=useState(true);

  async function load(){
    try{ setLoading(true); const r=await api.get("/api/notifications?limit=50"); setRows(r.data.items||[]); }
    catch{ setRows([{id:1,title:"Simulado 10h",channel:"push",status:"sent"}]); }
    finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); },[]);

  async function sendNow(){
    try{ await api.post("/api/notifications",{ title, channel }); setTitle(""); await load(); }
    catch{ alert("Falha ao enviar"); }
  }

  return <div style={{display:"grid",gap:16}}>
    <h1>Notificações</h1>
    <div style={{display:"flex",gap:8}}>
      <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)}/>
      <select value={channel} onChange={e=>setChannel(e.target.value)}>
        <option value="push">Push</option>
        <option value="sms">SMS</option>
        <option value="email">E-mail</option>
        <option value="pa">PA (alto-falante)</option>
      </select>
      <button onClick={sendNow}>Enviar</button>
    </div>
    {loading? <p>Carregando...</p> :
    <div style={{background:"var(--card-bg,#fff)",padding:16,borderRadius:12,border:"1px solid #2a2a2a20"}}>
      <table><thead><tr><th>ID</th><th>Título</th><th>Canal</th><th>Status</th></tr></thead>
      <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.title}</td><td>{r.channel||"-"}</td><td>{r.status||"-"}</td></tr>))}</tbody></table>
    </div>}
  </div>;
}
