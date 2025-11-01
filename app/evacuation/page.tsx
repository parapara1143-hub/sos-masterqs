"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

type Plan={ id:number; name:string; area:string; status?:string };

export default function Page(){
  const [rows,setRows]=useState<Plan[]>([]);
  const [name,setName]=useState("Simulado Geral");
  const [area,setArea]=useState("Fábrica A");
  const [loading,setLoading]=useState(true);

  async function load(){
    try{ setLoading=true; 
      const r=await api.get("/api/evacuation/plans?limit=50"); setRows(r.data.items||[]);
    }catch{ setRows([{id:1,name:"Simulado 2025/10",area:"Betim",status:"draft"}]); }
    finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); },[]);

  async function create(){
    try{ await api.post("/api/evacuation/plans",{ name, area }); await load(); }
    catch{ alert("Falha ao criar plano"); }
  }
  async function launch(id:number){
    try{ await api.post(`/api/evacuation/plans/${id}/launch`); await load(); }
    catch{ alert("Falha ao iniciar"); }
  }

  return <div style={{display:"grid",gap:16}}>
    <h1>Evacuação</h1>
    <div style={{display:"flex",gap:8}}>
      <input placeholder="Nome do plano" value={name} onChange={e=>setName(e.target.value)}/>
      <input placeholder="Área" value={area} onChange={e=>setArea(e.target.value)}/>
      <button onClick={create}>Criar Plano</button>
    </div>
    {loading? <p>Carregando...</p> :
    <div style={{background:"var(--card-bg,#fff)",padding:16,borderRadius:12,border:"1px solid #2a2a2a20"}}>
      <table><thead><tr><th>ID</th><th>Plano</th><th>Área</th><th>Status</th><th>Ações</th></tr></thead>
      <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.area}</td><td>{r.status||"-"}</td>
        <td><button onClick={()=>launch(r.id)}>Iniciar Simulado</button></td></tr>))}</tbody></table>
    </div>}
  </div>;
}
