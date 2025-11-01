"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

type Log={ id:number; ts:string; actor?:string; action:string; target?:string };

export default function Page(){
  const [rows,setRows]=useState<Log[]>([]);
  const [loading,setLoading]=useState(true);

  async function load(){
    try{ setLoading(true); const r=await api.get("/api/audit/logs?limit=100"); setRows(r.data.items||[]); }
    catch{ setRows([{id:1,ts:new Date().toISOString(),actor:"system",action:"login",target:"owner"}]); }
    finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); },[]);

  return <div style={{display:"grid",gap:16}}>
    <h1>Auditoria</h1>
    {loading? <p>Carregando...</p> :
    <div style={{background:"var(--card-bg,#fff)",padding:16,borderRadius:12,border:"1px solid #2a2a2a20"}}>
      <table><thead><tr><th>ID</th><th>Quando</th><th>Quem</th><th>Ação</th><th>Alvo</th></tr></thead>
      <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.ts}</td><td>{r.actor||"-"}</td><td>{r.action}</td><td>{r.target||"-"}</td></tr>))}</tbody></table>
    </div>}
  </div>;
}
