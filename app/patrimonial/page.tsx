"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

type Patrol={ id:number; route:string; guard:string; status?:string; ts?:string };

export default function Page(){
  const [rows,setRows]=useState<Patrol[]>([]);
  const [loading,setLoading]=useState(true);
  const [route,setRoute]=useState("Ronda A");
  const [guard,setGuard]=useState("");

  async function load(){
    try{ setLoading(true); const r=await api.get("/api/patrimonial/patrols?limit=50"); setRows(r.data.items||[]); }
    catch{ setRows([{id:1,route:"Ronda A",guard:"Carlos",status:"done"},{id:2,route:"Ronda B",guard:"Ana",status:"pending"}]); }
    finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); },[]);

  async function create(){
    try{ await api.post("/api/patrimonial/patrols",{ route, guard }); await load(); }
    catch{ alert("Falha ao criar ronda"); }
  }

  return <div style={{display:"grid",gap:16}}>
    <h1>Segurança Patrimonial</h1>
    <div style={{display:"flex",gap:8}}>
      <input placeholder="Rota" value={route} onChange={e=>setRoute(e.target.value)}/>
      <input placeholder="Vigilante" value={guard} onChange={e=>setGuard(e.target.value)}/>
      <button onClick={create}>Criar Ronda</button>
    </div>
    {loading? <p>Carregando...</p> :
    <div style={{background:"var(--card-bg,#fff)",padding:16,borderRadius:12,border:"1px solid #2a2a2a20"}}>
      <table><thead><tr><th>ID</th><th>Rota</th><th>Vigilante</th><th>Status</th></tr></thead>
      <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.route}</td><td>{r.guard}</td><td>{r.status||"-"}</td></tr>))}</tbody></table>
    </div>}
  </div>;
}
